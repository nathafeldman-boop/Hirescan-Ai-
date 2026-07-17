// MBTI-equivalent personality test — French version
// 70 statements · 4 dimensions · agree/disagree format
// EI(20) · SN(20) · TF(20) · JP(10)
//
// Ce module ne contient QUE la logique du quiz (questions, calcul du type) et
// les interfaces de types — aucune donnée payante, donc sûr à importer depuis
// un composant 'use client'. Pour le profil complet des 16 types (serveur
// uniquement), voir lib/mbti-server.ts. Pour les champs gratuits côté client
// (nom, tagline, rareté, description courte), voir lib/mbti-free.ts.

export type MbtiPole = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface MbtiQuestion {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  text: string;
  optionA: { text: string; pole: MbtiPole };
  optionB: { text: string; pole: MbtiPole };
  optionC?: { text: string; pole: MbtiPole };
  optionD?: { text: string; pole: MbtiPole };
}

export type QuizAnswer = 'A' | 'B' | 'C' | 'D' | 'E';

export interface MbtiType {
  code: string;
  name: string;
  tagline: string;
  emoji: string;
  accentColor: string;
  rarity: string; // % de la population
  shortDesc: string; // free — 3 phrases
  traits: string[];
  // paid sections
  fullDesc: string;
  inLove: string;
  atWork: string;
  strengths: string[];
  weaknesses: string[];
  growth: string;
  famousExamples: string[];
  compatibleWith: string[];
}

const OUI = "D'accord";
const NON = "Pas d'accord";

export const mbtiQuestions: MbtiQuestion[] = [
  // ── E vs I — Q1-10 ──
  { id: 1,  dimension: 'EI', text: "J'aime être entouré de nombreuses personnes.",                            optionA: { text: OUI, pole: 'E' }, optionB: { text: NON, pole: 'I' } },
  { id: 2,  dimension: 'EI', text: "Je préfère réfléchir seul avant de parler.",                              optionA: { text: OUI, pole: 'I' }, optionB: { text: NON, pole: 'E' } },
  { id: 3,  dimension: 'EI', text: "Les événements sociaux me donnent de l'énergie.",                         optionA: { text: OUI, pole: 'E' }, optionB: { text: NON, pole: 'I' } },
  { id: 4,  dimension: 'EI', text: "Je recherche souvent de nouvelles rencontres.",                           optionA: { text: OUI, pole: 'E' }, optionB: { text: NON, pole: 'I' } },
  { id: 5,  dimension: 'EI', text: "Je me sens à l'aise au centre de l'attention.",                           optionA: { text: OUI, pole: 'E' }, optionB: { text: NON, pole: 'I' } },
  { id: 6,  dimension: 'EI', text: "Après une journée chargée, j'ai besoin de solitude.",                    optionA: { text: OUI, pole: 'I' }, optionB: { text: NON, pole: 'E' } },
  { id: 7,  dimension: 'EI', text: "Je parle facilement à des inconnus.",                                     optionA: { text: OUI, pole: 'E' }, optionB: { text: NON, pole: 'I' } },
  { id: 8,  dimension: 'EI', text: "Je préfère écouter plutôt que parler.",                                   optionA: { text: OUI, pole: 'I' }, optionB: { text: NON, pole: 'E' } },
  { id: 9,  dimension: 'EI', text: "Les discussions de groupe me stimulent.",                                  optionA: { text: OUI, pole: 'E' }, optionB: { text: NON, pole: 'I' } },
  { id: 10, dimension: 'EI', text: "Je garde souvent mes pensées pour moi.",                                   optionA: { text: OUI, pole: 'I' }, optionB: { text: NON, pole: 'E' } },

  // ── S vs N — Q11-20 ──
  { id: 11, dimension: 'SN', text: "Je fais davantage confiance aux faits qu'aux intuitions.",                optionA: { text: OUI, pole: 'S' }, optionB: { text: NON, pole: 'N' } },
  { id: 12, dimension: 'SN', text: "Je remarque rapidement les détails de mon environnement.",                optionA: { text: OUI, pole: 'S' }, optionB: { text: NON, pole: 'N' } },
  { id: 13, dimension: 'SN', text: "Les idées abstraites me passionnent.",                                    optionA: { text: OUI, pole: 'N' }, optionB: { text: NON, pole: 'S' } },
  { id: 14, dimension: 'SN', text: "J'aime imaginer différentes possibilités futures.",                       optionA: { text: OUI, pole: 'N' }, optionB: { text: NON, pole: 'S' } },
  { id: 15, dimension: 'SN', text: "Je préfère les solutions concrètes aux théories.",                        optionA: { text: OUI, pole: 'S' }, optionB: { text: NON, pole: 'N' } },
  { id: 16, dimension: 'SN', text: "Je réfléchis souvent à ce qui pourrait être.",                            optionA: { text: OUI, pole: 'N' }, optionB: { text: NON, pole: 'S' } },
  { id: 17, dimension: 'SN', text: "Je me fie à mon expérience passée pour décider.",                         optionA: { text: OUI, pole: 'S' }, optionB: { text: NON, pole: 'N' } },
  { id: 18, dimension: 'SN', text: "Les concepts innovants attirent mon attention.",                           optionA: { text: OUI, pole: 'N' }, optionB: { text: NON, pole: 'S' } },
  { id: 19, dimension: 'SN', text: "Je remarque plus facilement les tendances que les détails.",               optionA: { text: OUI, pole: 'N' }, optionB: { text: NON, pole: 'S' } },
  { id: 20, dimension: 'SN', text: "Je préfère apprendre par la pratique.",                                    optionA: { text: OUI, pole: 'S' }, optionB: { text: NON, pole: 'N' } },

  // ── T vs F — Q21-30 ──
  { id: 21, dimension: 'TF', text: "Je prends mes décisions principalement avec logique.",                    optionA: { text: OUI, pole: 'T' }, optionB: { text: NON, pole: 'F' } },
  { id: 22, dimension: 'TF', text: "Les émotions influencent fortement mes choix.",                           optionA: { text: OUI, pole: 'F' }, optionB: { text: NON, pole: 'T' } },
  { id: 23, dimension: 'TF', text: "Je privilégie l'équité même si cela déplaît.",                            optionA: { text: OUI, pole: 'T' }, optionB: { text: NON, pole: 'F' } },
  { id: 24, dimension: 'TF', text: "Je cherche à préserver l'harmonie dans un groupe.",                       optionA: { text: OUI, pole: 'F' }, optionB: { text: NON, pole: 'T' } },
  { id: 25, dimension: 'TF', text: "Je peux critiquer une idée sans me sentir mal.",                          optionA: { text: OUI, pole: 'T' }, optionB: { text: NON, pole: 'F' } },
  { id: 26, dimension: 'TF', text: "Les besoins des autres influencent mes décisions.",                       optionA: { text: OUI, pole: 'F' }, optionB: { text: NON, pole: 'T' } },
  { id: 27, dimension: 'TF', text: "Je préfère les débats francs aux compromis rapides.",                     optionA: { text: OUI, pole: 'T' }, optionB: { text: NON, pole: 'F' } },
  { id: 28, dimension: 'TF', text: "Je suis sensible à l'impact émotionnel de mes paroles.",                  optionA: { text: OUI, pole: 'F' }, optionB: { text: NON, pole: 'T' } },
  { id: 29, dimension: 'TF', text: "J'analyse les problèmes de façon objective.",                             optionA: { text: OUI, pole: 'T' }, optionB: { text: NON, pole: 'F' } },
  { id: 30, dimension: 'TF', text: "Je cherche d'abord à comprendre les personnes concernées.",               optionA: { text: OUI, pole: 'F' }, optionB: { text: NON, pole: 'T' } },

  // ── J vs P — Q31-40 ──
  { id: 31, dimension: 'JP', text: "J'aime planifier les choses à l'avance.",                                 optionA: { text: OUI, pole: 'J' }, optionB: { text: NON, pole: 'P' } },
  { id: 32, dimension: 'JP', text: "Je préfère garder mes options ouvertes.",                                  optionA: { text: OUI, pole: 'P' }, optionB: { text: NON, pole: 'J' } },
  { id: 33, dimension: 'JP', text: "Les listes de tâches me motivent.",                                        optionA: { text: OUI, pole: 'J' }, optionB: { text: NON, pole: 'P' } },
  { id: 34, dimension: 'JP', text: "J'apprécie l'improvisation.",                                              optionA: { text: OUI, pole: 'P' }, optionB: { text: NON, pole: 'J' } },
  { id: 35, dimension: 'JP', text: "Je respecte les délais avec rigueur.",                                     optionA: { text: OUI, pole: 'J' }, optionB: { text: NON, pole: 'P' } },
  { id: 36, dimension: 'JP', text: "Je décide souvent au dernier moment.",                                     optionA: { text: OUI, pole: 'P' }, optionB: { text: NON, pole: 'J' } },
  { id: 37, dimension: 'JP', text: "J'aime savoir exactement ce qui m'attend.",                                optionA: { text: OUI, pole: 'J' }, optionB: { text: NON, pole: 'P' } },
  { id: 38, dimension: 'JP', text: "Les changements spontanés me plaisent.",                                   optionA: { text: OUI, pole: 'P' }, optionB: { text: NON, pole: 'J' } },
  { id: 39, dimension: 'JP', text: "Je termine généralement ce que je commence rapidement.",                   optionA: { text: OUI, pole: 'J' }, optionB: { text: NON, pole: 'P' } },
  { id: 40, dimension: 'JP', text: "Je travaille mieux quand il y a de la flexibilité.",                       optionA: { text: OUI, pole: 'P' }, optionB: { text: NON, pole: 'J' } },

  // ── E vs I — Q41-50 ──
  { id: 41, dimension: 'EI', text: "Je me présente facilement lors d'un événement.",                          optionA: { text: OUI, pole: 'E' }, optionB: { text: NON, pole: 'I' } },
  { id: 42, dimension: 'EI', text: "Je préfère observer avant de participer.",                                 optionA: { text: OUI, pole: 'I' }, optionB: { text: NON, pole: 'E' } },
  { id: 43, dimension: 'EI', text: "Je prends souvent l'initiative dans les groupes.",                        optionA: { text: OUI, pole: 'E' }, optionB: { text: NON, pole: 'I' } },
  { id: 44, dimension: 'EI', text: "Les longues périodes seul me conviennent.",                                optionA: { text: OUI, pole: 'I' }, optionB: { text: NON, pole: 'E' } },
  { id: 45, dimension: 'EI', text: "J'aime échanger mes idées à voix haute.",                                  optionA: { text: OUI, pole: 'E' }, optionB: { text: NON, pole: 'I' } },
  { id: 46, dimension: 'EI', text: "Je réfléchis mieux en silence.",                                          optionA: { text: OUI, pole: 'I' }, optionB: { text: NON, pole: 'E' } },
  { id: 47, dimension: 'EI', text: "Je me fais rapidement de nouveaux amis.",                                  optionA: { text: OUI, pole: 'E' }, optionB: { text: NON, pole: 'I' } },
  { id: 48, dimension: 'EI', text: "Je sélectionne soigneusement les personnes avec qui je partage.",          optionA: { text: OUI, pole: 'I' }, optionB: { text: NON, pole: 'E' } },
  { id: 49, dimension: 'EI', text: "Je préfère les activités collectives.",                                    optionA: { text: OUI, pole: 'E' }, optionB: { text: NON, pole: 'I' } },
  { id: 50, dimension: 'EI', text: "Je préfère les activités individuelles.",                                  optionA: { text: OUI, pole: 'I' }, optionB: { text: NON, pole: 'E' } },

  // ── S vs N — Q51-60 ──
  { id: 51, dimension: 'SN', text: "Je remarque facilement les changements subtils autour de moi.",           optionA: { text: OUI, pole: 'S' }, optionB: { text: NON, pole: 'N' } },
  { id: 52, dimension: 'SN', text: "Je suis attiré par les idées originales.",                                 optionA: { text: OUI, pole: 'N' }, optionB: { text: NON, pole: 'S' } },
  { id: 53, dimension: 'SN', text: "Je préfère des instructions précises.",                                    optionA: { text: OUI, pole: 'S' }, optionB: { text: NON, pole: 'N' } },
  { id: 54, dimension: 'SN', text: "Je relie souvent différents concepts entre eux.",                          optionA: { text: OUI, pole: 'N' }, optionB: { text: NON, pole: 'S' } },
  { id: 55, dimension: 'SN', text: "Je fais confiance à ce qui est prouvé.",                                   optionA: { text: OUI, pole: 'S' }, optionB: { text: NON, pole: 'N' } },
  { id: 56, dimension: 'SN', text: "J'aime explorer des hypothèses inhabituelles.",                            optionA: { text: OUI, pole: 'N' }, optionB: { text: NON, pole: 'S' } },
  { id: 57, dimension: 'SN', text: "Les détails sont essentiels pour moi.",                                    optionA: { text: OUI, pole: 'S' }, optionB: { text: NON, pole: 'N' } },
  { id: 58, dimension: 'SN', text: "Je vois souvent le tableau d'ensemble avant les détails.",                 optionA: { text: OUI, pole: 'N' }, optionB: { text: NON, pole: 'S' } },
  { id: 59, dimension: 'SN', text: "Je préfère les exemples concrets.",                                        optionA: { text: OUI, pole: 'S' }, optionB: { text: NON, pole: 'N' } },
  { id: 60, dimension: 'SN', text: "Les métaphores me parlent beaucoup.",                                      optionA: { text: OUI, pole: 'N' }, optionB: { text: NON, pole: 'S' } },

  // ── T vs F — Q61-70 ──
  { id: 61, dimension: 'TF', text: "Je sépare facilement les émotions des décisions.",                        optionA: { text: OUI, pole: 'T' }, optionB: { text: NON, pole: 'F' } },
  { id: 62, dimension: 'TF', text: "Je cherche à éviter les conflits inutiles.",                               optionA: { text: OUI, pole: 'F' }, optionB: { text: NON, pole: 'T' } },
  { id: 63, dimension: 'TF', text: "Je préfère la vérité à la diplomatie.",                                    optionA: { text: OUI, pole: 'T' }, optionB: { text: NON, pole: 'F' } },
  { id: 64, dimension: 'TF', text: "Je fais attention à ne pas blesser les autres.",                           optionA: { text: OUI, pole: 'F' }, optionB: { text: NON, pole: 'T' } },
  { id: 65, dimension: 'TF', text: "Je peux paraître direct lorsque je défends une idée.",                    optionA: { text: OUI, pole: 'T' }, optionB: { text: NON, pole: 'F' } },
  { id: 66, dimension: 'TF', text: "Je valorise fortement l'empathie.",                                        optionA: { text: OUI, pole: 'F' }, optionB: { text: NON, pole: 'T' } },
  { id: 67, dimension: 'TF', text: "Les critères objectifs sont prioritaires pour moi.",                       optionA: { text: OUI, pole: 'T' }, optionB: { text: NON, pole: 'F' } },
  { id: 68, dimension: 'TF', text: "Je prends en compte le ressenti de chacun.",                               optionA: { text: OUI, pole: 'F' }, optionB: { text: NON, pole: 'T' } },
  { id: 69, dimension: 'TF', text: "Je préfère évaluer les performances avec des mesures claires.",            optionA: { text: OUI, pole: 'T' }, optionB: { text: NON, pole: 'F' } },
  { id: 70, dimension: 'TF', text: "Je préfère tenir compte du contexte humain.",                              optionA: { text: OUI, pole: 'F' }, optionB: { text: NON, pole: 'T' } },
];

// Score par axe : la lettre gagnante + la force de préférence (50–100%).
export interface MbtiDimensionScore { letter: string; pct: number }
export type MbtiAxis = 'EI' | 'SN' | 'TF' | 'JP';
export type MbtiScores = Record<MbtiAxis, MbtiDimensionScore>;
export interface MbtiProfile { type: string; scores: MbtiScores }

function rawPoleScores(answers: Record<number, QuizAnswer>): Record<string, number> {
  const sc: Record<string, number> = { E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0 };
  for (const q of mbtiQuestions) {
    const ans = answers[q.id];
    if (!ans) continue;
    // 5-point weighted: A=+2 poleA, B=+1 poleA, C=neutral, D=+1 poleB, E=+2 poleB
    if (ans === 'A') sc[q.optionA.pole] += 2;
    else if (ans === 'B') sc[q.optionA.pole] += 1;
    else if (ans === 'D') sc[q.optionB.pole] += 1;
    else if (ans === 'E') sc[q.optionB.pole] += 2;
    // C = neutral, no points
  }
  return sc;
}

export function computeMbtiType(answers: Record<number, QuizAnswer>): string {
  const sc = rawPoleScores(answers);
  return `${sc.E >= sc.I ? 'E' : 'I'}${sc.S >= sc.N ? 'S' : 'N'}${sc.T >= sc.F ? 'T' : 'F'}${sc.J >= sc.P ? 'J' : 'P'}`;
}

// Comme computeMbtiType, mais conserve la FORCE de préférence par axe —
// c'est ce signal (ex : "Sentiment 80%", "J/P 54% proche de la limite") qui
// permet au coach IA de personnaliser au lieu de rester générique.
export function computeMbtiProfile(answers: Record<number, QuizAnswer>): MbtiProfile {
  const sc = rawPoleScores(answers);
  const axis = (a: string, b: string): MbtiDimensionScore => {
    const total = sc[a] + sc[b];
    const winner = sc[a] >= sc[b] ? a : b;
    const pct = total > 0 ? Math.round((Math.max(sc[a], sc[b]) / total) * 100) : 50;
    return { letter: winner, pct };
  };
  const scores: MbtiScores = { EI: axis('E', 'I'), SN: axis('S', 'N'), TF: axis('T', 'F'), JP: axis('J', 'P') };
  return { type: `${scores.EI.letter}${scores.SN.letter}${scores.TF.letter}${scores.JP.letter}`, scores };
}

export { ALL_MBTI_TYPES } from './mbti-free';
