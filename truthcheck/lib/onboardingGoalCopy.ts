// ── Personnalisation par objectif d'onboarding ──────────────────────────────
// L'objectif choisi à l'inscription (voir lib/onboardingFunnel.ts::ONBOARDING_GOALS)
// est capturé très tôt puis quasi jamais réutilisé ensuite — la donnée est là,
// juste pas exploitée. Ce fichier centralise TOUTE la copie dérivée de cet
// objectif (Elio, Journal, Quêtes, paywall MBTI, Pricing) pour qu'un même
// objectif produise un discours cohérent partout, à un seul endroit à changer.
//
// Volontairement des textes fixes, pas générés à la volée : la variété perçue
// vient de LA PLACE de cette personnalisation dans le funnel (elle apparaît à
// des moments différents avec un angle différent — test, journal, paywall,
// pricing), pas d'un générateur aléatoire qui ajouterait de la latence/coût
// pour un gain marginal sur du texte statique.

export type OnboardingGoal =
  | 'Mieux me comprendre'
  | 'Reprendre confiance en moi'
  | 'Gérer mon stress'
  | 'Mieux comprendre mes émotions'
  | 'Améliorer mes relations'
  | 'Retrouver de la motivation'
  | 'Apprendre à mieux me connaître';

// Formulation à l'infinitif ("reprendre confiance en toi") — réutilisable dans
// n'importe quelle phrase-cadre ("tu es venu pour ___", "t'accompagner à ___").
const GOAL_PHRASE: Record<string, string> = {
  'Mieux me comprendre': 'mieux te comprendre',
  'Reprendre confiance en moi': 'reprendre confiance en toi',
  'Gérer mon stress': 'gérer ton stress',
  'Mieux comprendre mes émotions': 'mieux comprendre tes émotions',
  'Améliorer mes relations': 'améliorer tes relations',
  'Retrouver de la motivation': 'retrouver ta motivation',
  'Apprendre à mieux me connaître': 'apprendre à mieux te connaître',
};

export function goalPhrase(goal: string | null | undefined): string | null {
  if (!goal) return null;
  return GOAL_PHRASE[goal] ?? null;
}

// /quetes — pourquoi LE TEST aide précisément à CET objectif, pas juste "voir
// apparaître ton type" : le test doit se sentir utile POUR le problème, pas
// comme une curiosité à côté du problème.
const GOAL_TEST_PITCH: Record<string, string> = {
  'Mieux me comprendre': 'Découvre ce que ton type révèle sur ta manière profonde de fonctionner.',
  'Reprendre confiance en moi': 'Découvre pourquoi la confiance est plus dure à installer pour ton type que pour d\'autres — et ce qui peut vraiment t\'aider.',
  'Gérer mon stress': 'Découvre comment ton type réagit au stress, et ce qui l\'apaise vraiment.',
  'Mieux comprendre mes émotions': 'Découvre comment ton type vit ses émotions en profondeur, souvent différemment de ce qu\'il montre.',
  'Améliorer mes relations': 'Découvre comment ton type fonctionne dans ses relations, en amour comme en amitié.',
  'Retrouver de la motivation': 'Découvre ce qui motive vraiment ton type, et pourquoi le reste ne marche pas longtemps.',
  'Apprendre à mieux me connaître': 'Fais le premier pas concret pour apprendre qui tu es vraiment.',
};

export function goalTestPitch(goal: string | null | undefined): string | null {
  if (!goal) return null;
  return GOAL_TEST_PITCH[goal] ?? null;
}

// Paywall MBTI (ResultTeaser) — 4e ligne d'aperçu, spécifique à l'objectif.
// Jamais le code à 4 lettres ni le nom du type (même règle que teaserLines
// dans lib/mbtiTeaser.ts) : uniquement une promesse liée au problème déclaré.
const GOAL_PAYWALL_LINE: Record<string, string> = {
  'Mieux me comprendre': 'Ton profil complet va bien plus loin que ces 3 lignes : le vrai fonctionnement derrière tes choix.',
  'Reprendre confiance en moi': 'Ton profil explique aussi pourquoi ta confiance vacille dans certaines situations précises — et comment la stabiliser.',
  'Gérer mon stress': 'Ton profil montre aussi ce qui déclenche vraiment ton stress, et ce qui l\'apaise, selon ton fonctionnement.',
  'Mieux comprendre mes émotions': 'Ton profil révèle aussi comment tu vis tes émotions en profondeur, même celles que tu ne montres pas.',
  'Améliorer mes relations': 'Ton profil montre aussi le schéma qui revient dans tes relations, et comment en sortir.',
  'Retrouver de la motivation': 'Ton profil révèle aussi ce qui t\'a vraiment motivé par le passé, et comment le retrouver.',
  'Apprendre à mieux me connaître': 'Ton profil complet est le point de départ concret pour vraiment apprendre qui tu es.',
};

export function goalPaywallLine(goal: string | null | undefined): string | null {
  if (!goal) return null;
  return GOAL_PAYWALL_LINE[goal] ?? null;
}

// Paywall MBTI — priorité des 8 chapitres (clé = glyph dans ResultTeaser),
// pour que le chapitre qui répond au problème déclaré apparaisse EN PREMIER
// plutôt que dans l'ordre fixe habituel (amour, carrière, forces...).
export const GOAL_CHAPTER_PRIORITY: Record<string, [string, string]> = {
  'Mieux me comprendre': ['mirror', 'eye'],
  'Reprendre confiance en moi': ['spark', 'eye'],
  'Gérer mon stress': ['moon', 'eye'],
  'Mieux comprendre mes émotions': ['moon', 'mirror'],
  'Améliorer mes relations': ['heart', 'key'],
  'Retrouver de la motivation': ['compass', 'spark'],
  'Apprendre à mieux me connaître': ['mirror', 'moon'],
};

// Vend la TRANSFORMATION, pas la fonctionnalité — demande explicite : passer
// de "profil MBTI + coach IA" à "voilà ce que ça va changer pour toi".
const GOAL_TRANSFORMATION_PITCH: Record<string, string> = {
  'Mieux me comprendre': 'Comprends enfin comment tu fonctionnes vraiment, avec un profil complet et un coach qui s\'en souvient.',
  'Reprendre confiance en moi': 'Retrouve confiance en toi grâce à un profil qui explique tes blocages, et un coach qui t\'accompagne chaque jour.',
  'Gérer mon stress': 'Réduis ton stress grâce à un accompagnement quotidien qui connaît vraiment ton fonctionnement.',
  'Mieux comprendre mes émotions': 'Comprends enfin tes émotions grâce à un profil complet et un coach présent chaque jour.',
  'Améliorer mes relations': 'Améliore tes relations grâce à un profil qui révèle tes schémas, et un coach qui t\'aide à les changer.',
  'Retrouver de la motivation': 'Retrouve la motivation avec un accompagnement adapté à ton profil, jour après jour.',
  'Apprendre à mieux me connaître': 'Apprends à te connaître vraiment, avec un profil complet et un coach qui t\'accompagne dans la durée.',
};

export function goalTransformationPitch(goal: string | null | undefined): string | null {
  if (!goal) return null;
  return GOAL_TRANSFORMATION_PITCH[goal] ?? null;
}

// Version courte (3-4 mots) de la même idée, pour les emplacements où l'espace
// est compté (ex. l'eyebrow au-dessus du prix) — remplace un label de
// fonctionnalité ("Ton profil + ton coach") par le résultat visé.
const GOAL_HERO_LABEL: Record<string, string> = {
  'Mieux me comprendre': 'Comprends qui tu es',
  'Reprendre confiance en moi': 'Retrouve confiance en toi',
  'Gérer mon stress': 'Réduis ton stress',
  'Mieux comprendre mes émotions': 'Comprends tes émotions',
  'Améliorer mes relations': 'Améliore tes relations',
  'Retrouver de la motivation': 'Retrouve ta motivation',
  'Apprendre à mieux me connaître': 'Apprends à te connaître',
};

export function goalHeroLabel(goal: string | null | undefined): string | null {
  if (!goal) return null;
  return GOAL_HERO_LABEL[goal] ?? null;
}

// Pricing — une ligne, gabarit donné explicitement par le produit : "tu es
// venu pour ___, Elio peut t'accompagner chaque jour jusqu'à y arriver."
export function goalPricingLine(goal: string | null | undefined): string | null {
  const phrase = goalPhrase(goal);
  if (!phrase) return null;
  return `Tu es venu pour ${phrase}. Elio peut t'accompagner chaque jour jusqu'à atteindre cet objectif.`;
}

// Première réponse d'Elio après le tout premier Journal (voir
// lib/journalReflection.ts::firstEntryReply) — LE moment charnière du funnel.
// Relie l'émotion du jour à l'objectif déclaré, avec un angle différent selon
// que la journée est plutôt bonne, neutre, ou difficile (le lien à faire n'est
// pas le même dans les deux cas).
type JournalMoodTier = 'positive' | 'neutral' | 'negative';

const GOAL_JOURNAL_CLAUSE: Record<string, Record<JournalMoodTier, string>> = {
  'Mieux me comprendre': {
    positive: "Chaque jour comme celui-ci m'aide à comprendre ce qui te fait vraiment du bien.",
    neutral: "Même un jour ordinaire m'en dit long sur qui tu es — c'est comme ça qu'on avance.",
    negative: "Les jours difficiles révèlent souvent le plus sur qui on est — je le garde avec toi.",
  },
  'Reprendre confiance en moi': {
    positive: 'Un jour comme ça, garde-le en tête : c\'est une preuve concrète que ta confiance peut tenir.',
    neutral: 'C\'est exactement ce genre de journée ordinaire qu\'on va apprendre à décoder ensemble, pour reprendre confiance pas à pas.',
    negative: 'C\'est aussi pour des journées comme celle-ci que tu es venu reprendre confiance en toi — on va y travailler, un jour à la fois.',
  },
  'Gérer mon stress': {
    positive: 'Retiens ce que tu as fait aujourd\'hui qui a gardé ton stress bas — ça va nous servir.',
    neutral: 'Une journée sans pic de stress, c\'est déjà une donnée utile pour comprendre ce qui t\'apaise.',
    negative: 'C\'est justement pour apprendre à gérer ce genre de tension que tu es là — on va identifier ce qui la déclenche.',
  },
  'Mieux comprendre mes émotions': {
    positive: 'Ce que tu ressens aujourd\'hui compte aussi — comprendre les bons jours fait partie du chemin.',
    neutral: 'Même une émotion neutre mérite d\'être comprise — c\'est le genre de nuance qu\'on va apprendre à repérer ensemble.',
    negative: "C'est exactement ce genre d'émotion qu'on va apprendre à décoder ensemble, pas juste la traverser.",
  },
  'Améliorer mes relations': {
    positive: 'Si quelqu\'un a compté dans cette journée, c\'est déjà un indice sur ce qui te fait du bien dans tes relations.',
    neutral: 'Même une journée calme en dit long sur comment tu vis tes relations au quotidien — on va apprendre à le voir.',
    negative: 'Les journées difficiles en disent souvent beaucoup sur nos relations — on regardera ça ensemble.',
  },
  'Retrouver de la motivation': {
    positive: 'Ce sursaut d\'énergie, on va apprendre à le provoquer plus souvent, pas juste le constater.',
    neutral: 'Une journée sans élan particulier, c\'est justement ce qu\'on va apprendre à transformer, petit à petit.',
    negative: 'Les jours sans motivation sont ceux où on apprend le plus sur ce qui t\'en redonne — j\'observe avec toi.',
  },
  'Apprendre à mieux me connaître': {
    positive: 'Ce genre de journée est une vraie pièce du puzzle pour apprendre qui tu es.',
    neutral: 'Même sans rien de marquant, cette journée m\'apprend déjà quelque chose sur toi.',
    negative: 'Ce sont souvent les jours les plus durs qui en disent le plus sur qui on est vraiment — je le garde avec toi.',
  },
};

export function goalJournalClause(goal: string | null | undefined, mood: number): string | null {
  if (!goal) return null;
  const tier: JournalMoodTier = mood >= 4 ? 'positive' : mood === 3 ? 'neutral' : 'negative';
  return GOAL_JOURNAL_CLAUSE[goal]?.[tier] ?? null;
}
