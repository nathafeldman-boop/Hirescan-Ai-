// ── Tests créés par Nova, à partager ─────────────────────────────────────────
// Génère un mini-quiz (questions à choix + tranches de résultat) via Mistral,
// en JSON structuré. Un peu de code, rien de fou : pas de moteur de scoring
// séparé — le score est juste la somme des points des options cochées,
// comparée aux tranches renvoyées par le modèle.

import { callMistral } from './chat';

const MAX_QUESTIONS = 8;
const MIN_QUESTIONS = 5;

export interface QuizOption { label: string; points: number }
export interface QuizQuestion { text: string; options: QuizOption[] }
export interface ResultBand { min: number; max: number; title: string; description: string }

export interface GeneratedQuiz {
  title: string;
  intro: string;
  questions: QuizQuestion[];
  resultBands: ResultBand[];
  disclaimer: string;
}

const SAFETY_DISCLAIMER =
  "Ce test a été généré automatiquement, à visée ludique. Ce n'est PAS un outil de diagnostic médical, psychologique ou professionnel — en cas de doute réel, parle à un professionnel de santé.";

export function quizGeneratorPrompt(topic: string): string {
  return `Tu génères un mini-test de personnalité à choix multiples sur le thème donné par l'utilisateur, pour UrCecret (site de tests de personnalité). Réponds UNIQUEMENT avec un objet JSON valide, RIEN d'autre (pas de markdown, pas de phrase avant/après), au format EXACT suivant :

{
  "title": "titre court et accrocheur du test (max 60 caractères)",
  "intro": "1-2 phrases qui donnent envie de faire le test",
  "questions": [
    { "text": "texte de la question", "options": [
      { "label": "texte de la réponse", "points": 0 },
      { "label": "texte de la réponse", "points": 1 },
      { "label": "texte de la réponse", "points": 2 },
      { "label": "texte de la réponse", "points": 3 }
    ] }
  ],
  "resultBands": [
    { "min": 0, "max": 8, "title": "titre de ce résultat", "description": "2-3 phrases qui décrivent ce profil, ton chaleureux et bienveillant" },
    { "min": 9, "max": 16, "title": "...", "description": "..." },
    { "min": 17, "max": 24, "title": "...", "description": "..." }
  ]
}

RÈGLES :
- Entre ${MIN_QUESTIONS} et ${MAX_QUESTIONS} questions, chacune avec exactement 4 options.
- Les "points" de chaque option vont de 0 à 3 (0 = la réponse la "moins" du trait mesuré, 3 = la "plus").
- "resultBands" doit couvrir TOUT l'intervalle possible (de 0 à questions×3) sans trou ni chevauchement, généralement 3 à 4 tranches.
- Ton chaleureux, bienveillant, jamais moralisateur ni jugeant — même sur un thème sensible.
- Un thème du style "qui est le/la plus [trait] du groupe" (ex : toxique, chaotique, control freak, en couple imaginaire...) est un format de jeu entre amis tout à fait normal — génère-le normalement, garde juste un ton taquin, jamais méchant, dans les descriptions de résultat.
- Seul cas à refuser (génère alors un test générique et positif sur la connaissance de soi à la place) : le thème nomme une personne réelle précise dans l'intention de l'humilier, ou est haineux/dangereux/illégal.
- N'utilise JAMAIS de vocabulaire médical/clinique (pas de "diagnostic", "trouble", "pathologie", "dépression clinique"...) même si le thème y fait penser — reste dans le registre "personnalité/ressenti", jamais médical.

Thème demandé par l'utilisateur : "${topic.slice(0, 200)}"`;
}

// Génère un test avec 1 retry (prompt renforcé + température plus basse) si le
// modèle a dévié du JSON attendu au 1er essai — les thèmes "fun" (ex: "qui est
// le plus toxique du groupe") le font dévier plus souvent qu'un thème neutre,
// et un seul essai raté sur deux ne doit pas priver l'utilisateur de son test.
export async function generateQuiz(topic: string): Promise<GeneratedQuiz | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const system = attempt === 0
      ? quizGeneratorPrompt(topic)
      : `${quizGeneratorPrompt(topic)}\n\nRappel strict : ta réponse précédente n'était pas du JSON valide. Réponds UNIQUEMENT avec l'objet JSON demandé, sans aucun texte, markdown ou commentaire autour.`;
    const gen = await callMistral(system, [
      { role: 'user', content: 'Génère le test maintenant, au format JSON demandé, rien d\'autre.' },
    ], { maxTokens: 1800, temperature: attempt === 0 ? 0.8 : 0.4 });
    const quiz = gen.ok && gen.reply ? parseGeneratedQuiz(gen.reply) : null;
    if (quiz) return quiz;
  }
  return null;
}

// Parse + valide la réponse JSON du modèle. Retourne null si invalide (le
// serveur API décidera de retenter ou d'échouer proprement) — jamais on
// n'affiche un test à moitié cassé.
export function parseGeneratedQuiz(raw: string): GeneratedQuiz | null {
  let jsonText = raw.trim();
  // Le modèle glisse parfois des fences markdown malgré la consigne — on les retire.
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

  if (typeof d.title !== 'string' || !d.title.trim()) return null;
  if (typeof d.intro !== 'string' || !d.intro.trim()) return null;
  if (!Array.isArray(d.questions) || d.questions.length < MIN_QUESTIONS || d.questions.length > MAX_QUESTIONS) return null;
  if (!Array.isArray(d.resultBands) || d.resultBands.length < 2 || d.resultBands.length > 6) return null;

  const questions: QuizQuestion[] = [];
  for (const q of d.questions) {
    if (!q || typeof q !== 'object') return null;
    const qq = q as Record<string, unknown>;
    if (typeof qq.text !== 'string' || !qq.text.trim()) return null;
    if (!Array.isArray(qq.options) || qq.options.length < 2 || qq.options.length > 6) return null;
    const options: QuizOption[] = [];
    for (const o of qq.options) {
      if (!o || typeof o !== 'object') return null;
      const oo = o as Record<string, unknown>;
      if (typeof oo.label !== 'string' || !oo.label.trim()) return null;
      const points = typeof oo.points === 'number' && Number.isFinite(oo.points) ? Math.max(0, Math.round(oo.points)) : 0;
      options.push({ label: oo.label.slice(0, 200), points });
    }
    questions.push({ text: qq.text.slice(0, 300), options });
  }

  const resultBands: ResultBand[] = [];
  for (const b of d.resultBands) {
    if (!b || typeof b !== 'object') return null;
    const bb = b as Record<string, unknown>;
    if (typeof bb.min !== 'number' || typeof bb.max !== 'number') return null;
    if (typeof bb.title !== 'string' || !bb.title.trim()) return null;
    if (typeof bb.description !== 'string' || !bb.description.trim()) return null;
    resultBands.push({ min: bb.min, max: bb.max, title: bb.title.slice(0, 100), description: bb.description.slice(0, 500) });
  }

  return {
    title: d.title.slice(0, 100),
    intro: d.intro.slice(0, 300),
    questions,
    resultBands,
    disclaimer: SAFETY_DISCLAIMER,
  };
}

// Trouve la tranche de résultat correspondant au score total. Fallback sur la
// tranche la plus proche si le modèle a laissé un trou (garde-fou défensif).
export function matchResultBand(bands: ResultBand[], total: number): ResultBand {
  const exact = bands.find((b) => total >= b.min && total <= b.max);
  if (exact) return exact;
  return [...bands].sort((a, b) => Math.abs((a.min + a.max) / 2 - total) - Math.abs((b.min + b.max) / 2 - total))[0];
}
