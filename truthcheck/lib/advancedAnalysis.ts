// ── Analyse de personnalité avancée ─────────────────────────────────────────
// Va plus loin que le simple résultat MBTI : combine le profil de test
// (via buildCoachContext, déjà utilisé par le coach) avec les signaux
// disponibles en plus — dernières analyses de conversation, tendances du
// journal émotionnel — pour donner l'impression que Nova connaît vraiment
// l'utilisateur. Même logique que les autres générateurs : prompt JSON
// strict + parseur qui ne fait confiance à rien.

import { callMistral } from './chat';
import { buildCoachContext } from './coach';
import type { MbtiScores } from './mbti';

export interface AdvancedAnalysisContext {
  mbtiType: string;
  mbtiScores: MbtiScores | null;
  // Extraits courts des dernières analyses de conversation (personality + advice)
  recentConversationInsights: string[];
  // Résumé du journal émotionnel (déjà calculé, texte prêt à injecter)
  journalSummary: string | null;
}

// Résumé déterministe (pas d'appel IA) des dernières entrées du journal —
// moyennes + tendance simple (7 derniers jours vs le reste). Sert de contexte
// factuel injecté dans le prompt, pour ne pas payer un 2e appel Mistral en
// plus de celui de lib/journalInsights.ts (qui, lui, sert l'onglet Journal).
export function summarizeJournalForAnalysis(
  entries: { day: string; mood: number; energy: number; stress: number }[],
): string | null {
  if (entries.length < 3) return null;
  const sorted = [...entries].sort((a, b) => (a.day < b.day ? -1 : 1));
  const avg = (key: 'mood' | 'energy' | 'stress', list: typeof sorted) =>
    list.reduce((sum, e) => sum + e[key], 0) / list.length;

  const overallMood = avg('mood', sorted);
  const overallEnergy = avg('energy', sorted);
  const overallStress = avg('stress', sorted);

  const recent = sorted.slice(-7);
  const older = sorted.slice(0, -7);
  let trend = '';
  if (older.length >= 3) {
    const diff = avg('mood', recent) - avg('mood', older);
    if (diff > 0.4) trend = ' Son humeur est plutôt en hausse récemment.';
    else if (diff < -0.4) trend = ' Son humeur est plutôt en baisse récemment.';
  }

  return `Sur ${sorted.length} jours notés, moyennes sur 5 : humeur ${overallMood.toFixed(1)}, énergie ${overallEnergy.toFixed(1)}, stress ${overallStress.toFixed(1)}.${trend}`;
}

export interface AdvancedAnalysisResult {
  strengths: string[];
  weaknesses: string[];
  communicationStyle: string;
  conflictStyle: string;
  idealEnvironment: string;
  advice: string[];
}

export function advancedAnalysisPrompt(ctx: AdvancedAnalysisContext): string {
  const baseContext = buildCoachContext(ctx.mbtiType, ctx.mbtiScores);

  const extraBlocks: string[] = [];
  if (ctx.recentConversationInsights.length) {
    extraBlocks.push(`• Ce que ses conversations analysées révèlent : ${ctx.recentConversationInsights.join(' | ')}`);
  }
  if (ctx.journalSummary) {
    extraBlocks.push(`• Son journal émotionnel récent : ${ctx.journalSummary}`);
  }

  return `Tu es Nova, le coach IA d'UrCecret. Tu dois produire une analyse de personnalité APPROFONDIE, plus riche qu'un simple résultat MBTI, pour quelqu'un que tu connais déjà bien. Voici tout ce que tu sais de cette personne :

${baseContext}
${extraBlocks.length ? '\n' + extraBlocks.join('\n') : ''}

Réponds UNIQUEMENT avec un objet JSON valide, RIEN d'autre (pas de markdown, pas de phrase avant/après), au format EXACT suivant :

{
  "strengths": ["3 à 4 forces principales, concrètes et spécifiques à CE profil (pas des généralités MBTI)"],
  "weaknesses": ["2 à 3 faiblesses ou angles morts honnêtes, formulés avec bienveillance"],
  "communicationStyle": "2-3 phrases sur sa manière de communiquer avec les autres",
  "conflictStyle": "2-3 phrases sur sa façon de gérer les conflits et désaccords",
  "idealEnvironment": "2-3 phrases sur l'environnement (relationnel, professionnel) où elle s'épanouit le plus",
  "advice": ["3 conseils personnalisés et actionnables, qui s'appuient explicitement sur son profil"]
}

RÈGLES :
- Parle TOUJOURS à partir de CE profil précis, jamais en généralités MBTI ("les INFP sont..."). Si tu utilises les données de conversation/journal, relie-les explicitement.
- Ton chaleureux, direct, jamais clinique — comme un coach qui connaît vraiment la personne, pas un rapport généré.
- N'utilise JAMAIS de vocabulaire médical/clinique ("trouble", "pathologie", "diagnostic").
- Si les données de conversation ou de journal sont absentes, base-toi uniquement sur le profil MBTI — ne les mentionne pas comme manquantes, contente-toi de ne pas y faire référence.`;
}

export function parseAdvancedAnalysis(raw: string): AdvancedAnalysisResult | null {
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
  const d = data as Record<string, unknown>;

  const arr = (v: unknown, max = 6) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && !!x.trim()).map((x) => x.slice(0, 240)).slice(0, max) : null;
  const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, 700) : null);

  const strengths = arr(d.strengths);
  const weaknesses = arr(d.weaknesses);
  const communicationStyle = str(d.communicationStyle);
  const conflictStyle = str(d.conflictStyle);
  const idealEnvironment = str(d.idealEnvironment);
  const advice = arr(d.advice);

  if (!strengths?.length || !weaknesses?.length || !communicationStyle || !conflictStyle || !idealEnvironment || !advice?.length) {
    return null;
  }

  return { strengths, weaknesses, communicationStyle, conflictStyle, idealEnvironment, advice };
}

export async function generateAdvancedAnalysis(ctx: AdvancedAnalysisContext): Promise<AdvancedAnalysisResult | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    let system = advancedAnalysisPrompt(ctx);
    if (attempt > 0) {
      system += '\n\nRappel strict : ta réponse précédente n\'était pas du JSON valide. Réponds UNIQUEMENT avec l\'objet JSON demandé, sans aucun texte, markdown ou commentaire autour.';
    }
    const gen = await callMistral(system, [
      { role: 'user', content: 'Génère l\'analyse maintenant, au format JSON demandé, rien d\'autre.' },
    ], { maxTokens: 1400, temperature: attempt === 0 ? 0.65 : 0.3 });
    const parsed = gen.ok && gen.reply ? parseAdvancedAnalysis(gen.reply) : null;
    if (parsed) return parsed;
  }
  return null;
}
