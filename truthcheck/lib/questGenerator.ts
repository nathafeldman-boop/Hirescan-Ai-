// ── Quêtes générées par Elio ──────────────────────────────────────────────
// Quand un compte a complété tout le catalogue statique (lib/quests.ts)
// disponible pour son palier, Elio génère 3 nouvelles quêtes personnalisées à
// partir de ce qu'on sait déjà de lui (objectif du questionnaire d'accueil,
// thèmes récents du Journal, type MBTI) — jamais depuis rien : sans signal
// exploitable, on ne génère pas (voir shouldGenerate). Même philosophie que
// les autres générateurs Elio : prompt JSON strict, parseur qui ne fait
// confiance à rien, échec silencieux (voir lib/journalInsights.ts).
import { callMistral } from './chat';

export interface QuestGenerationInput {
  firstName: string | null;
  onboardingGoal: string | null;
  mbtiType: string | null;
  recentJournalNotes: string[]; // notes libres récentes, déjà filtrées non-vides
}

export interface GeneratedQuestDraft {
  title: string;
  description: string;
  emoji: string;
}

export function shouldGenerate(input: QuestGenerationInput): boolean {
  return !!input.onboardingGoal || input.recentJournalNotes.length > 0 || !!input.mbtiType;
}

function buildPrompt(input: QuestGenerationInput): string {
  const parts: string[] = [];
  if (input.onboardingGoal) parts.push(`Son objectif principal déclaré à l'inscription : "${input.onboardingGoal}".`);
  if (input.mbtiType) parts.push(`Son type de personnalité : ${input.mbtiType}.`);
  if (input.recentJournalNotes.length > 0) {
    parts.push(`Ce qu'il/elle a récemment écrit dans son Journal émotionnel :\n${input.recentJournalNotes.slice(0, 8).map((n) => `- ${n}`).join('\n')}`);
  }

  return `Tu es Elio, le compagnon de développement personnel d'UrCecret. ${input.firstName ? `La personne s'appelle ${input.firstName}.` : ''}
${parts.join('\n')}

Cette personne a déjà terminé toutes les quêtes disponibles dans l'application. Propose-lui 3 NOUVELLES quêtes personnelles, concrètes, réalisables en une seule fois (pas une habitude à tenir sur plusieurs jours), qui prolongent VRAIMENT son objectif/son vécu récent — jamais des quêtes génériques qui iraient à n'importe qui.

Réponds UNIQUEMENT avec un objet JSON valide, RIEN d'autre (pas de markdown, pas de phrase avant/après), au format EXACT suivant :

{
  "quests": [
    { "title": "titre court, orienté action (5-8 mots)", "description": "1 phrase qui explique le geste concret à faire", "emoji": "un seul emoji pertinent" }
  ]
}

RÈGLES :
- Exactement 3 quêtes.
- Toujours à la 2e personne, ton chaleureux, jamais moralisateur ni clinique.
- Chaque quête doit être une ACTION précise à faire (ex: "Écrire une qualité que tu oublies souvent"), jamais un thème vague (ex: "Travailler sur la confiance").
- Ne mentionne jamais que tu es une IA.`;
}

export function parseGeneratedQuests(raw: string): GeneratedQuestDraft[] | null {
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
  const quests = (data as Record<string, unknown>).quests;
  if (!Array.isArray(quests)) return null;

  const drafts: GeneratedQuestDraft[] = [];
  for (const q of quests) {
    if (!q || typeof q !== 'object') continue;
    const rec = q as Record<string, unknown>;
    if (typeof rec.title !== 'string' || typeof rec.description !== 'string') continue;
    drafts.push({
      title: rec.title.trim().slice(0, 120),
      description: rec.description.trim().slice(0, 300),
      emoji: typeof rec.emoji === 'string' && rec.emoji.trim() ? rec.emoji.trim().slice(0, 4) : '✨',
    });
  }
  return drafts.length > 0 ? drafts : null;
}

export async function generatePersonalizedQuests(input: QuestGenerationInput): Promise<GeneratedQuestDraft[] | null> {
  if (!shouldGenerate(input)) return null;
  const system = buildPrompt(input);
  const gen = await callMistral(system, [
    { role: 'user', content: 'Génère mes 3 prochaines quêtes maintenant, au format JSON demandé, rien d\'autre.' },
  ], { maxTokens: 500, temperature: 0.7 });
  if (!gen.ok || !gen.reply) return null;
  return parseGeneratedQuests(gen.reply);
}
