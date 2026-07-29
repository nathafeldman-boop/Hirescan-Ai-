// ── Score de compatibilité — gratuit, déterministe, sans appel IA ───────────
// C'est la valeur que voit TOUT LE MONDE, abonné ou pas (voir /api/compat) :
// un vrai pourcentage + une phrase concrète, pas une promesse vague. L'analyse
// approfondie de Elio (commonPoints/differences/strengths/watchPoints/summary)
// reste, elle, réservée aux abonnés — voir lib/friendCompat.ts.
//
// Seules 3 des 8 questions (social/decisions/organisation) se traduisent
// clairement en lettre MBTI (E/I, T/F, J/P) ; les 5 autres nourrissent la
// perception mais n'ont pas d'équivalent fiable côté "propre profil" de
// l'utilisateur (pas de question S/N ici) — volontairement pas forcées dans
// le score pour ne pas fabriquer une fausse précision.

import type { MbtiScores } from './mbti';

interface AnswerIn { questionId: string; choiceIndex: number }

function otherLetter(questionId: string, choiceIndex: number): string | null {
  if (questionId === 'social') return choiceIndex <= 1 ? 'E' : choiceIndex === 2 ? 'I' : null;
  if (questionId === 'decisions') return choiceIndex === 0 ? 'T' : choiceIndex === 1 ? 'F' : null;
  if (questionId === 'organisation') return choiceIndex === 0 ? 'J' : choiceIndex === 1 ? 'P' : null;
  return null;
}

const AXIS_BY_LETTER: Record<string, 'EI' | 'TF' | 'JP'> = { E: 'EI', I: 'EI', T: 'TF', F: 'TF', J: 'JP', P: 'JP' };

const HEADLINES: Record<string, { same: string; diff: string }> = {
  TF: {
    same: 'Vous décidez de la même façon face à un choix important — la logique (ou le cœur) parle le même langage des deux côtés.',
    diff: 'L\'un(e) tranche à la logique, l\'autre à l\'instinct du cœur — ça peut se compléter, ou se télescoper selon le sujet.',
  },
  EI: {
    same: 'Vous vous ressourcez de la même façon — le même rythme social, sans avoir à se forcer.',
    diff: 'L\'un(e) puise son énergie dans le monde, l\'autre dans le calme — un vrai équilibre, si vous respectez ce rythme différent.',
  },
  JP: {
    same: 'Vous abordez l\'organisation pareil — ni l\'un ni l\'autre n\'a à s\'adapter en permanence.',
    diff: 'L\'un(e) planifie, l\'autre s\'adapte sur le moment — la vraie friction du quotidien se joue souvent ici.',
  },
};

export interface CompatScoreResult { score: number; headline: string }

export function computeCompatScore(userScores: MbtiScores | null, answers: AnswerIn[]): CompatScoreResult {
  const contributions: { axis: 'EI' | 'TF' | 'JP'; same: boolean }[] = [];
  let sum = 0;
  let n = 0;

  for (const a of answers) {
    const letter = otherLetter(a.questionId, a.choiceIndex);
    if (!letter) continue;
    const axis = AXIS_BY_LETTER[letter];
    const ownLetter = userScores?.[axis]?.letter;
    if (!ownLetter) { sum += 0.68; n++; continue; }
    const same = ownLetter === letter;
    contributions.push({ axis, same });
    sum += same ? 1 : 0.45;
    n++;
  }

  const base = n > 0 ? sum / n : 0.68;
  const score = Math.round(38 + base * 58); // reste dans une plage crédible (38-96)

  // Priorité éditoriale : TF (le plus parlant pour une relation) > EI > JP.
  const priority: ('TF' | 'EI' | 'JP')[] = ['TF', 'EI', 'JP'];
  const found = priority.map((axis) => contributions.find((c) => c.axis === axis)).find(Boolean);
  const headline = found ? HEADLINES[found.axis][found.same ? 'same' : 'diff'] : 'Votre alchimie a des nuances qu\'un simple pourcentage ne peut pas raconter.';

  return { score, headline };
}
