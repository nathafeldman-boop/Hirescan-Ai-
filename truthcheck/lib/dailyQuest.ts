// ── Quête du jour ─────────────────────────────────────────────────────────
// UNE quête, partagée par tous les comptes, générée une fois par jour à
// minuit (voir app/api/cron/daily-quest/route.ts) — remplace une partie du
// rôle de rétention que jouaient les séquences email (day1/3/7, rappel
// journal), désactivées le 01/08 pour économiser Resend. Contrairement à
// GeneratedQuest (personnalisée par compte, complétion confirmée à la main),
// ici la complétion est TOUJOURS recalculée depuis une vraie action — jamais
// une case à cocher — même philosophie que checkAndRecordQuestCompletions
// (lib/quests.ts).
//
// Le TEXTE change chaque jour (généré par Mistral, même pattern que
// lib/questGenerator.ts), mais le TYPE d'action attendu est fixé par une
// rotation déterministe sur les 3 seules actions qu'on sait détecter de
// façon fiable : Journal, message à Elio, niveau de Parcours. Si Mistral
// échoue, un texte de repli fixe est utilisé — la quête du jour doit TOUJOURS
// exister, jamais silencieusement absente (contrairement aux autres
// générations Elio, qui peuvent échouer sans conséquence).
import { prisma } from './db';
import { callMistral, parisDay } from './chat';

export type DailyActionType = 'journal' | 'chat' | 'parcours';

const ACTION_TYPES: DailyActionType[] = ['journal', 'chat', 'parcours'];

const FALLBACKS: Record<DailyActionType, { title: string; description: string; emoji: string }> = {
  journal: { title: 'Note ton humeur du jour', description: 'Prends 30 secondes pour écrire comment tu te sens, là, maintenant.', emoji: '📖' },
  chat: { title: 'Dis un mot à Elio', description: "Raconte-lui un détail de ta journée, même petit — il s'en souviendra.", emoji: '🤖' },
  parcours: { title: 'Avance d\'un niveau', description: 'Ton Parcours t\'attend — un seul niveau suffit pour aujourd\'hui.', emoji: '🌱' },
};

const PROMPTS: Record<DailyActionType, string> = {
  journal: "une quête qui donne envie d'écrire dans son Journal émotionnel aujourd'hui (noter son humeur, un ressenti, un événement marquant)",
  chat: "une quête qui donne envie d'écrire à Elio (son coach IA) aujourd'hui, même un message court",
  parcours: "une quête qui donne envie de faire un niveau de son Parcours de progression aujourd'hui",
};

// Rotation déterministe (pas de hasard) sur le jour calendaire — la même
// action pour tout le monde le même jour, et reproductible si jamais appelée
// deux fois pour le même `day` (voir getOrCreateTodayDailyQuest).
function actionTypeForDay(day: string): DailyActionType {
  const n = Number(day.replaceAll('-', ''));
  return ACTION_TYPES[n % ACTION_TYPES.length];
}

function buildPrompt(actionType: DailyActionType): string {
  return `Tu es Elio, le compagnon de développement personnel d'UrCecret. Écris ${PROMPTS[actionType]}.

Cette quête sera vue par TOUS les utilisateurs de l'application aujourd'hui — jamais personnalisée, jamais un prénom, jamais une référence à une situation individuelle.

Réponds UNIQUEMENT avec un objet JSON valide, RIEN d'autre (pas de markdown, pas de phrase avant/après), au format EXACT suivant :

{ "title": "titre court, orienté action (4-7 mots)", "description": "1 phrase qui donne envie, jamais moralisatrice", "emoji": "un seul emoji pertinent" }

RÈGLES :
- Toujours à la 2e personne, ton chaleureux et curieux, jamais scolaire.
- Une action précise et réalisable en quelques minutes, jamais une habitude à tenir sur plusieurs jours.
- Ne mentionne jamais que tu es une IA.`;
}

function parseDailyQuestDraft(raw: string, actionType: DailyActionType): { title: string; description: string; emoji: string } | null {
  let jsonText = raw.trim();
  const fenced = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) jsonText = fenced[1].trim();

  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch {
    return null;
  }
  if (!data || typeof data !== 'object') return null;
  const rec = data as Record<string, unknown>;
  if (typeof rec.title !== 'string' || typeof rec.description !== 'string') return null;
  return {
    title: rec.title.trim().slice(0, 120),
    description: rec.description.trim().slice(0, 300),
    emoji: typeof rec.emoji === 'string' && rec.emoji.trim() ? rec.emoji.trim().slice(0, 4) : FALLBACKS[actionType].emoji,
  };
}

// Génère (via Mistral) ou, à défaut, retourne le texte de repli fixe pour ce
// type d'action — ne retourne JAMAIS null : la quête du jour doit toujours
// avoir un texte, même si Mistral est indisponible.
export async function generateDailyQuestText(actionType: DailyActionType): Promise<{ title: string; description: string; emoji: string }> {
  try {
    const gen = await callMistral(buildPrompt(actionType), [
      { role: 'user', content: 'Génère la quête du jour maintenant, au format JSON demandé, rien d\'autre.' },
    ], { maxTokens: 200, temperature: 0.8 });
    if (gen.ok && gen.reply) {
      const parsed = parseDailyQuestDraft(gen.reply, actionType);
      if (parsed) return parsed;
    }
  } catch (e) {
    console.error('generateDailyQuestText error:', e);
  }
  return FALLBACKS[actionType];
}

// Idempotent : si la quête du jour existe déjà (posée par le cron ou par un
// appel précédent), la retourne telle quelle — ne régénère jamais deux fois
// le même jour, même appelée en parallèle (upsert sur la clé unique `day`).
export async function getOrCreateTodayDailyQuest(now: Date = new Date()) {
  const day = parisDay(now);
  const existing = await prisma.dailyQuest.findUnique({ where: { day } });
  if (existing) return existing;

  const actionType = actionTypeForDay(day);
  const text = await generateDailyQuestText(actionType);
  return prisma.dailyQuest.upsert({
    where: { day },
    create: { day, actionType, title: text.title, description: text.description, emoji: text.emoji },
    update: {},
  });
}

// Recalcule si CE compte a rempli la quête du jour à partir d'une vraie
// action (jamais un flag posé à la main) — même philosophie que
// checkAndRecordQuestCompletions. Sans conséquence si appelée plusieurs fois
// le même jour (contrainte unique userId+day).
export async function checkAndRecordDailyQuestCompletion(userId: string, quest: { day: string; actionType: string }): Promise<boolean> {
  const already = await prisma.dailyQuestCompletion.findUnique({
    where: { userId_day: { userId, day: quest.day } },
  }).catch(() => null);
  if (already) return true;

  const done = await didRealAction(userId, quest.day, quest.actionType as DailyActionType);
  if (!done) return false;

  await prisma.dailyQuestCompletion.create({ data: { userId, day: quest.day } }).catch(() => {});
  return true;
}

async function didRealAction(userId: string, day: string, actionType: DailyActionType): Promise<boolean> {
  if (actionType === 'journal') {
    const entry = await prisma.journalEntry.findFirst({ where: { userId, day }, select: { id: true } });
    return !!entry;
  }
  if (actionType === 'parcours') {
    const level = await prisma.levelCompletion.findFirst({ where: { userId, day }, select: { id: true } });
    return !!level;
  }
  // 'chat' — ChatMessage n'a qu'un createdAt (pas de champ `day`) : on borne
  // sur minuit Paris du jour de la quête, même calcul que natha-admin
  // (parisMidnight), dupliqué ici volontairement (fichier isolé, pas de
  // dépendance croisée avec l'admin).
  const utcMid = new Date(day + 'T00:00:00Z');
  const parisHour = +new Intl.DateTimeFormat('en', { timeZone: 'Europe/Paris', hour: 'numeric', hour12: false }).format(utcMid);
  const startOfDayParis = new Date(utcMid.getTime() - parisHour * 3_600_000);
  const msg = await prisma.chatMessage.findFirst({
    where: { userId, role: 'user', createdAt: { gte: startOfDayParis } },
    select: { id: true },
  });
  return !!msg;
}
