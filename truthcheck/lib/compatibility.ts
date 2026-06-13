import { mbtiTypes, MbtiType } from './mbti';

export const ALL_MBTI_TYPES = [
  'INTJ','INTP','ENTJ','ENTP',
  'INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ',
  'ISTP','ISFP','ESTP','ESFP',
] as const;

export type MbtiCode = typeof ALL_MBTI_TYPES[number];

// Cognitive function stacks per type (dominant, auxiliary, tertiary, inferior)
const FUNCTIONS: Record<string, string[]> = {
  INTJ: ['Ni','Te','Fi','Se'], INTP: ['Ti','Ne','Si','Fe'],
  ENTJ: ['Te','Ni','Se','Fi'], ENTP: ['Ne','Ti','Fe','Si'],
  INFJ: ['Ni','Fe','Ti','Se'], INFP: ['Fi','Ne','Si','Te'],
  ENFJ: ['Fe','Ni','Se','Ti'], ENFP: ['Ne','Fi','Te','Si'],
  ISTJ: ['Si','Te','Fi','Ne'], ISFJ: ['Si','Fe','Ti','Ne'],
  ESTJ: ['Te','Si','Ne','Fi'], ESFJ: ['Fe','Si','Ne','Ti'],
  ISTP: ['Ti','Se','Ni','Fe'], ISFP: ['Fi','Se','Ni','Te'],
  ESTP: ['Se','Ti','Fe','Ni'], ESFP: ['Se','Fi','Te','Ni'],
};

export interface CompatibilityResult {
  score: number;         // 0-100
  label: string;         // Excellent / Bonne / Compatible / Complexe
  labelEn: string;
  sharedStrengths: string[];
  challenges: string[];
  inLoveSummary: string;
  atWorkSummary: string;
  tips: string[];
}

function countSharedFunctions(a: string, b: string): number {
  const fa = FUNCTIONS[a] ?? [];
  const fb = FUNCTIONS[b] ?? [];
  return fa.filter(f => fb.includes(f)).length;
}

function countSharedLetters(a: string, b: string): number {
  let shared = 0;
  for (let i = 0; i < 4; i++) {
    if (a[i] === b[i]) shared++;
  }
  return shared;
}

export function getCompatibility(codeA: string, codeB: string): CompatibilityResult {
  const A = mbtiTypes[codeA];
  const B = mbtiTypes[codeB];
  if (!A || !B) throw new Error(`Unknown type: ${codeA} or ${codeB}`);

  const aInB = (B.compatibleWith ?? []).includes(codeA);
  const bInA = (A.compatibleWith ?? []).includes(codeB);
  const sharedFunctions = countSharedFunctions(codeA, codeB);
  const sharedLetters = countSharedLetters(codeA, codeB);

  // Score calculation
  let score = 50;
  if (aInB && bInA) score = 88 + sharedFunctions * 2;
  else if (aInB || bInA) score = 70 + sharedFunctions * 2;
  else score = 48 + sharedLetters * 5 + sharedFunctions;
  score = Math.min(97, Math.max(35, score));

  const label =
    score >= 85 ? 'Excellente' :
    score >= 70 ? 'Bonne' :
    score >= 55 ? 'Compatible' : 'Complexe';

  const labelEn =
    score >= 85 ? 'Excellent' :
    score >= 70 ? 'Good' :
    score >= 55 ? 'Compatible' : 'Challenging';

  // Shared strengths (from traits intersection)
  const traitsA = new Set(A.traits ?? []);
  const sharedStrengths = (B.traits ?? []).filter(t => traitsA.has(t));

  // Challenges — from differing poles
  const challenges: string[] = [];
  if (codeA[0] !== codeB[0]) challenges.push(`${A.code[0] === 'E' ? A.name : B.name} a besoin de stimulation sociale que l'autre préfère éviter`);
  if (codeA[1] !== codeB[1]) challenges.push(`L'un pense en abstractions, l'autre préfère les faits concrets`);
  if (codeA[2] !== codeB[2]) challenges.push(`Les décisions logiques de l'un peuvent heurter la sensibilité de l'autre`);
  if (codeA[3] !== codeB[3]) challenges.push(`L'un aime planifier, l'autre préfère rester flexible`);
  if (challenges.length === 0) challenges.push('Les différences restent minimes et gérables');

  const inLoveSummary =
    score >= 85
      ? `${A.code} et ${B.code} se comprennent naturellement en amour. Leur complémentarité crée une relation profonde et stimulante.`
      : score >= 70
      ? `La relation ${A.code}/${B.code} demande des ajustements mais offre un potentiel émotionnel fort.`
      : `${A.code} et ${B.code} peuvent construire quelque chose d'unique si chacun accepte les différences de l'autre.`;

  const atWorkSummary =
    score >= 85
      ? `En équipe, ${A.code} et ${B.code} se complètent efficacement — leurs fonctions cognitives créent une synergie productive.`
      : score >= 70
      ? `${A.code} et ${B.code} peuvent former un duo professionnel solide en jouant sur leurs forces respectives.`
      : `La collaboration ${A.code}/${B.code} nécessite de définir clairement les rôles pour éviter les frictions.`;

  const tips = [
    `${A.name} (${A.code}) : valorise et exprime ${sharedLetters > 2 ? 'vos similitudes' : 'ce que vous apportez de différent'}.`,
    `${B.name} (${B.code}) : comprendre le mode de fonctionnement de l'autre évite 80% des conflits.`,
    'Passer le test MBTI ensemble révèle vos styles de communication et d\'attachement.',
  ];

  return { score, label, labelEn, sharedStrengths, challenges, inLoveSummary, atWorkSummary, tips };
}

// Generate all unique pairs (A-B where A < B alphabetically to avoid duplicates)
export function getAllPairs(): { pair: string; codeA: string; codeB: string }[] {
  const pairs: { pair: string; codeA: string; codeB: string }[] = [];
  for (let i = 0; i < ALL_MBTI_TYPES.length; i++) {
    for (let j = i + 1; j < ALL_MBTI_TYPES.length; j++) {
      const a = ALL_MBTI_TYPES[i];
      const b = ALL_MBTI_TYPES[j];
      pairs.push({ pair: `${a.toLowerCase()}-${b.toLowerCase()}`, codeA: a, codeB: b });
    }
  }
  return pairs;
}

// Parse pair slug like "infj-enfp" → { codeA: "INFJ", codeB: "ENFP" }
export function parsePair(slug: string): { codeA: string; codeB: string } | null {
  const parts = slug.toUpperCase().split('-');
  if (parts.length !== 2) return null;
  const [a, b] = parts;
  if (!mbtiTypes[a] || !mbtiTypes[b]) return null;
  return { codeA: a, codeB: b };
}
