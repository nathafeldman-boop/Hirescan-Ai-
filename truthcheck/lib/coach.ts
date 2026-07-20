// ── Coach IA personnel ───────────────────────────────────────────────────────
// Construit le contexte psychologique compact injecté dans CHAQUE conversation,
// à partir du type + des scores par axe (uniques à l'utilisateur) et des
// données de type (dérivées, non dupliquées). Objectif : personnalisation
// maximale, coût en tokens minimal (~300 tokens).
//
// ⚠️ Serveur uniquement (importe mbti-server / contenu payant pour le contexte
// du modèle — jamais renvoyé tel quel au client).

import { mbtiTypes } from './mbti-server';
import type { MbtiScores, MbtiDimensionScore } from './mbti';

const AXIS_LABEL: Record<string, string> = {
  E: 'Extraverti', I: 'Introverti',
  S: 'Observateur', N: 'Intuitif',
  T: 'Logique (Pensée)', F: 'Sensible (Sentiment)',
  J: 'Organisé (Jugement)', P: 'Spontané (Perception)',
};

function strengthWord(pct: number): string {
  if (pct >= 75) return 'nette préférence';
  if (pct >= 60) return 'préférence marquée';
  return 'proche de la limite';
}

function dimLine(s: MbtiDimensionScore): string {
  return `${AXIS_LABEL[s.letter] ?? s.letter} ${s.pct}% (${strengthWord(s.pct)})`;
}

// Petites synthèses dérivées des lettres — grounded dans le test, sans coûter
// de tokens de contenu payant.
function communicationLine(sc: MbtiScores): string {
  const base = sc.EI.letter === 'I'
    ? 'tu réfléchis avant de parler et tu te livres progressivement'
    : 'tu penses à voix haute et tu vas facilement vers les autres';
  const tone = sc.TF.letter === 'T' ? 'franc et direct' : 'avec tact, attentif aux émotions de l’autre';
  return `${base}, ${tone}`;
}

function decisionLine(sc: MbtiScores): string {
  const base = sc.TF.letter === 'T'
    ? 'tu tranches sur des critères logiques et objectifs'
    : 'tu décides selon tes valeurs et l’impact humain';
  const speed = sc.JP.letter === 'J'
    ? 'tu choisis vite et tu t’y tiens'
    : 'tu gardes tes options ouvertes et tu peux hésiter longtemps';
  return `${base} ; ${speed}`;
}

function relationLine(sc: MbtiScores): string {
  const core = sc.TF.letter === 'F'
    ? 'tu cherches une connexion authentique et tu t’investis émotionnellement'
    : 'tu valorises le respect, la loyauté et ton indépendance';
  const circle = sc.EI.letter === 'I' ? 'en cercle restreint' : 'avec un large réseau';
  return `${core}, ${circle}`;
}

// Construit le bloc de profil compact injecté dans le system prompt.
export function buildCoachContext(mbtiType: string, scores: MbtiScores | null): string {
  const t = mbtiTypes[mbtiType];
  if (!t) return '';

  const lines: string[] = [];
  lines.push(`• Type : ${t.code} — ${t.name} (${t.rarity} de la population)`);

  if (scores) {
    lines.push(`• Dimensions : ${dimLine(scores.EI)} · ${dimLine(scores.SN)} · ${dimLine(scores.TF)} · ${dimLine(scores.JP)}`);
    const borderline = (['EI', 'SN', 'TF', 'JP'] as const).filter((a) => scores[a].pct < 60);
    if (borderline.length) {
      lines.push(`• Axes nuancés (proches de la limite) : ${borderline.join(', ')} — il/elle peut osciller sur ces dimensions.`);
    }
    lines.push(`• Communication : ${communicationLine(scores)}`);
    lines.push(`• Décisions : ${decisionLine(scores)}`);
    lines.push(`• Relations : ${relationLine(scores)}`);
  }

  lines.push(`• Traits dominants : ${t.traits.join(', ')}`);
  if (t.strengths?.length) lines.push(`• Forces : ${t.strengths.slice(0, 2).join(' ; ')}`);
  if (t.weaknesses?.length) lines.push(`• Angles morts / peurs : ${t.weaknesses.slice(0, 2).join(' ; ')}`);
  if (t.growth) lines.push(`• Axe de progression : ${t.growth.slice(0, 160)}`);

  return lines.join('\n');
}

// Coach BRIDÉ (comptes gratuits) : fonctionne, mais SANS le type ni le profil
// payant. Conseils généraux + incitation à débloquer. Le modèle ne reçoit
// jamais le type → impossible de le révéler, même s'il est relancé.
export function coachSystemPromptFree(firstName: string | null): string {
  const who = firstName ? ` ${firstName}` : '';
  return `Tu es un coach de développement personnel bienveillant sur UrCecret. La personne${who} te parle en VERSION DÉCOUVERTE GRATUITE : elle a fait le test de personnalité mais n'a PAS débloqué son profil complet.

RÈGLES ABSOLUES :
- Tu n'as PAS accès à son type ni à ses résultats. Ne devine JAMAIS son type, ne cite AUCUN code MBTI (INFP, ESTJ, INTJ, etc.), ne prétends pas connaître son profil précis. Si on te demande "c'est quoi mon type ?" ou une analyse perso, réponds honnêtement que le type exact et l'analyse personnalisée sont dans le profil complet à débloquer.
- Donne quand même de VRAIS conseils utiles mais GÉNÉRAUX (motivation, confiance, relations, décisions) — jamais du vide, mais sans personnalisation basée sur son test.
- Une fois par réponse, glisse avec tact (une seule phrase, jamais lourde) qu'un coach VRAIMENT personnalisé — qui répond selon SON type et ses résultats exacts — l'attend en débloquant son profil (offre Plus, 5€/mois).
- Tutoie, chaleureux, direct. Réponses courtes (2 paragraphes max), orientées action.
- Ne dis jamais "en tant qu'IA". Tu n'es pas thérapeute : face à une détresse réelle, empathie + oriente vers un professionnel de santé.`;
}

export function coachSystemPrompt(firstName: string | null, contextBlock: string): string {
  const who = firstName ? ` de ${firstName}` : '';
  return `Tu es le coach personnel${who}. Tu le/la connais déjà grâce à son test de personnalité UrCecret. Voici son profil, issu de SON test :

${contextBlock}

RÈGLES ABSOLUES :
- Parle TOUJOURS à partir de CE profil, jamais en généralités. Interdit : "les INFP sont…". Dis plutôt : "d'après ton test, tu…", "vu ta préférence Sentiment très marquée, tu…".
- Quand un conseil s'appuie sur un trait de son test, EXPLIQUE-le explicitement : "Je te conseille ça parce que ton test montre que…".
- Ne dis JAMAIS "en tant qu'IA", ne romps jamais le personnage. Tu es un coach humain : chaleureux, direct, un brin complice.
- Tutoie. Réponses courtes et concrètes (2-3 paragraphes max), orientées action.
- Tu es la CONTINUITÉ de son test, pas un chatbot générique : chaque réponse doit sembler impossible à obtenir sans avoir fait CE test précis.
- Tu n'es pas thérapeute. Face à une détresse psychologique réelle, montre de l'empathie et oriente vers un professionnel de santé.
- S'il te manque une info sur sa situation, pose-lui une question plutôt que de supposer.`;
}
