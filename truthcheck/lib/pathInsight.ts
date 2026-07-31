// ── Reflet de niveau (Parcours) ─────────────────────────────────────────────
// À la complétion d'un niveau qui produit une réponse texte, Elio génère UNE
// phrase "ce que ça révèle sur toi" à partir de la réponse donnée — jamais un
// conseil, un simple reflet. Même philosophie que lib/questGenerator.ts :
// prompt JSON strict, parseur qui ne fait confiance à rien, échec silencieux
// (une génération ratée n'empêche jamais la complétion du niveau, voir l'API
// route qui l'appelle).
import { callMistral } from './chat';

export interface PathInsightInput {
  firstName: string | null;
  levelTitle: string;
  exercisePrompt: string; // la question/le scénario/le défi de l'exercice
  userAnswer: string;
  mbtiType: string | null;
}

function buildPrompt(input: PathInsightInput): string {
  return `Tu es Elio, le compagnon de développement personnel d'UrCecret. ${input.firstName ? `La personne s'appelle ${input.firstName}.` : ''}${input.mbtiType ? ` Son type de personnalité : ${input.mbtiType}.` : ''}

Elle vient de terminer un exercice intitulé "${input.levelTitle}".
Consigne de l'exercice : "${input.exercisePrompt}"
Sa réponse : "${input.userAnswer}"

Écris UNE seule phrase courte (20 à 35 mots), à la 2e personne, qui lui reflète ce que sa réponse révèle sur elle — jamais un jugement, jamais un conseil ("tu devrais..."), juste un reflet bienveillant et précis de ce qu'elle vient de montrer d'elle-même.

Réponds UNIQUEMENT avec un objet JSON valide, RIEN d'autre (pas de markdown, pas de phrase avant/après), au format EXACT suivant :

{ "insight": "ta phrase ici" }

RÈGLES :
- Une seule phrase, jamais de liste.
- Toujours bienveillant, jamais clinique ni moralisateur.
- Ne mentionne jamais que tu es une IA.`;
}

export function parsePathInsight(raw: string): string | null {
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
  const insight = (data as Record<string, unknown>).insight;
  if (typeof insight !== 'string' || !insight.trim()) return null;
  return insight.trim().slice(0, 400);
}

export async function generatePathInsight(input: PathInsightInput): Promise<string | null> {
  if (!input.userAnswer.trim()) return null;
  const system = buildPrompt(input);
  const gen = await callMistral(system, [
    { role: 'user', content: "Donne-moi mon reflet maintenant, au format JSON demandé, rien d'autre." },
  ], { maxTokens: 200, temperature: 0.7 });
  if (!gen.ok || !gen.reply) return null;
  return parsePathInsight(gen.reply);
}
