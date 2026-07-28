// ── Compatibilité avec un ami / partenaire / membre de la famille ───────────
// À ne pas confondre avec lib/compatibility.ts (calcul déterministe entre 2
// TYPES MBTI abstraits, pour les pages SEO /compatibilite/[pair]). Ici,
// l'utilisateur répond à un court questionnaire de PERCEPTION sur une
// personne réelle de son entourage (elle n'a pas de compte, pas de vrai test
// MBTI) — Elio compare ce profil perçu au sien et génère un résultat
// structuré, dans le même esprit que lib/conversationAnalysis.ts.

import { callMistral } from './chat';
import { RELATION_TYPES, COMPAT_QUESTIONS, type RelationType } from './friendCompatQuestions';

export { RELATION_TYPES, COMPAT_QUESTIONS };
export type { RelationType };

export interface FriendCompatResult {
  commonPoints: string[];
  differences: string[];
  strengths: string[];
  watchPoints: string[];
  summary: string;
}

const RELATION_LABEL: Record<RelationType, string> = {
  ami: 'une relation amicale',
  couple: 'une relation de couple',
  famille: 'une relation familiale',
};

export function friendCompatPrompt(
  relationType: RelationType,
  personName: string,
  ownMbtiType: string | null,
  answers: { question: string; choice: string }[],
): string {
  const answersText = answers.map((a) => `- ${a.question} → ${a.choice}`).join('\n');
  return `Tu es Elio, le compagnon de développement personnel d'UrCecret. Un utilisateur analyse ${RELATION_LABEL[relationType]} avec "${personName}". Voici son propre type MBTI (s'il est connu) : ${ownMbtiType ?? 'inconnu'}. Voici comment il perçoit "${personName}" au quotidien (questionnaire de perception, pas un vrai test passé par cette personne) :
${answersText}

Réponds UNIQUEMENT avec un objet JSON valide, RIEN d'autre (pas de markdown, pas de phrase avant/après), au format EXACT suivant :

{
  "commonPoints": ["2 à 4 points communs probables entre l'utilisateur et ${personName}, courts (1 phrase max chacun)"],
  "differences": ["2 à 4 différences probables, courtes (1 phrase max chacune)"],
  "strengths": ["2 à 3 forces de cette relation, concrètes et positives"],
  "watchPoints": ["1 à 3 points d'attention ou de friction possible — honnête mais jamais alarmiste"],
  "summary": "2-3 phrases de synthèse chaleureuse sur cette relation, adaptées au type de relation (${relationType})"
}

RÈGLES :
- Ton chaleureux, direct, jamais moralisateur — comme un ami perspicace, pas un rapport clinique.
- Base-toi sur les réponses données, ne les recopie pas telles quelles, interprète-les.
- Reste nuancé : ce n'est qu'une perception, pas un vrai test passé par "${personName}".
- N'utilise JAMAIS de vocabulaire médical/clinique.
- Adapte le vocabulaire au type de relation : ${relationType === 'couple' ? 'complicité, alignement des valeurs, vie à deux' : relationType === 'famille' ? 'dynamique familiale, historique, loyauté' : 'complicité, fun, soutien mutuel'}.`;
}

export function parseFriendCompatResult(raw: string): FriendCompatResult | null {
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
    Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && !!x.trim()).map((x) => x.slice(0, 200)).slice(0, max) : null;
  const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, 600) : null);

  const commonPoints = arr(d.commonPoints);
  const differences = arr(d.differences);
  const strengths = arr(d.strengths);
  const watchPoints = arr(d.watchPoints);
  const summary = str(d.summary);

  if (!commonPoints?.length || !differences?.length || !strengths?.length || !watchPoints || !summary) return null;

  return { commonPoints, differences, strengths, watchPoints, summary };
}

// Génère avec 1 retry (prompt renforcé) si le modèle dévie du JSON attendu.
export async function generateFriendCompat(
  relationType: RelationType,
  personName: string,
  ownMbtiType: string | null,
  answers: { question: string; choice: string }[],
): Promise<FriendCompatResult | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    let system = friendCompatPrompt(relationType, personName, ownMbtiType, answers);
    if (attempt > 0) {
      system += '\n\nRappel strict : ta réponse précédente n\'était pas du JSON valide. Réponds UNIQUEMENT avec l\'objet JSON demandé, sans aucun texte, markdown ou commentaire autour.';
    }
    const gen = await callMistral(system, [
      { role: 'user', content: 'Génère le résultat maintenant, au format JSON demandé, rien d\'autre.' },
    ], { maxTokens: 1200, temperature: attempt === 0 ? 0.7 : 0.35 });
    const parsed = gen.ok && gen.reply ? parseFriendCompatResult(gen.reply) : null;
    if (parsed) return parsed;
  }
  return null;
}
