import { mbtiTypes, ALL_MBTI_TYPES } from './mbti';

export interface CompatibilityResult {
  score: number;
  label: string;
  emoji: string;
  color: string;
  summary: string;
  dimensions: { dim: string; labelA: string; labelB: string; aligned: boolean; analysis: string }[];
}

const DIM_LABELS: Record<string, string> = {
  E: 'Extraverti', I: 'Introverti',
  S: 'Sensitif', N: 'Intuitif',
  T: 'Pensée (T)', F: 'Sentiment (F)',
  J: 'Jugement (J)', P: 'Perception (P)',
};

const DIM_ANALYSIS: Record<string, (a: string, b: string) => string> = {
  EI: (a, b) => a === b
    ? (a === 'E' ? "Deux extravertis — vous adorez les sorties et les soirées ensemble. Veillez à vous ménager des moments plus calmes." : "Deux introvertis — vous vous comprenez dans votre besoin de silence. Attention à l'isolement progressif à deux.")
    : "Extraverti + Introverti — un duo classique qui fonctionne si chacun respecte le rythme de l'autre. L'un recharge en sortant, l'autre en restant. C'est complémentaire, pas incompatible.",
  SN: (a, b) => a === b
    ? (a === 'S' ? "Deux sensitifs — vous êtes ancrés dans le concret, les projets réels, le quotidien tangible. Peu de rêves abstraits, beaucoup d'action." : "Deux intuitifs — vous adorez les grandes idées, le futur et les possibilités infinies. Pensez à atterrir parfois.")
    : "Sensitif + Intuitif — vos façons de percevoir le monde sont différentes. L'un veut des faits, l'autre voit des patterns. Ça crée des frictions mais aussi une richesse que ni l'un ni l'autre n'aurait seul.",
  TF: (a, b) => a === b
    ? (a === 'T' ? "Deux penseurs logiques — vos désaccords sont tranchés par la raison. Efficace, mais pensez à valider les émotions de l'autre." : "Deux types Sentiment — vous priorisez l'harmonie et l'empathie. Évitez de vous perdre dans des non-dits pour préserver la paix.")
    : "Logique + Émotionnel — vos prises de décision sont aux antipodes. L'un analyse, l'autre ressent. Ça peut créer des malentendus profonds ou une complémentarité remarquable selon comment vous le gérez.",
  JP: (a, b) => a === b
    ? (a === 'J' ? "Deux organisés — votre vie à deux est structurée, planifiée, efficace. Parfois un peu rigide face aux imprévus." : "Deux flexibles — vous improvisez bien ensemble, mais les projets longs peuvent traîner. Mettez un minimum de structure.")
    : "Organisé + Flexible — l'un veut un plan, l'autre préfère improviser. Source de conflits sur le quotidien (voyages, finances, organisation). Mais l'un apporte de la structure là où l'autre apporte de la spontanéité.",
};

export function getMbtiCompatibility(typeA: string, typeB: string): CompatibilityResult {
  const dims4 = ['EI', 'SN', 'TF', 'JP'] as const;
  const pairs = dims4.map((dim, i) => ({ dim, a: typeA[i], b: typeB[i] }));
  const diffCount = pairs.filter(p => p.a !== p.b).length;

  // Bonus if each is in the other's compatible list
  const tA = mbtiTypes[typeA];
  const tB = mbtiTypes[typeB];
  const compatBonus =
    (tA?.compatibleWith?.includes(typeB) ? 7 : 0) +
    (tB?.compatibleWith?.includes(typeA) ? 7 : 0);

  const baseScores: Record<number, number> = { 0: 94, 1: 83, 2: 70, 3: 57, 4: 44 };
  const score = Math.min(97, (baseScores[diffCount] ?? 50) + compatBonus);

  let label: string, emoji: string, color: string, summary: string;

  if (typeA === typeB) {
    label = 'Miroirs parfaits'; emoji = '🪞'; color = '#7c3aed';
    summary = `Deux ${typeA} — vous vous comprenez instinctivement, vous avez les mêmes forces et les mêmes angles morts. La complicité est immédiate. Le risque : créer une bulle hermétique sans confrontation constructive. Votre plus grand défi sera de vous pousser mutuellement à grandir plutôt que de vous conforter dans vos zones de confort communes.`;
  } else if (score >= 88) {
    label = 'Alchimie rare'; emoji = '💫'; color = '#7c3aed';
    summary = `${typeA} + ${typeB} — une combinaison que peu de gens trouvent. Vous vous comprenez sans effort, vos différences se complètent et vos forces s'amplifient mutuellement. Ce niveau de compatibilité ne se fabrique pas — il se reconnaît.`;
  } else if (score >= 75) {
    label = 'Très compatibles'; emoji = '💜'; color = '#8b5cf6';
    summary = `${typeA} + ${typeB} — vos personnalités s'assemblent bien. Vous partagez assez pour vous comprendre, vous différez assez pour vous intéresser. Les tensions que vous rencontrerez sont constructives, pas destructives.`;
  } else if (score >= 62) {
    label = 'Bonne alchimie'; emoji = '✨'; color = '#6366f1';
    summary = `${typeA} + ${typeB} — vous vous attirez précisément parce que vous êtes différents. Ce que l'un n'a pas, l'autre l'apporte. Ça demande une communication active, mais le résultat en vaut la peine.`;
  } else if (score >= 50) {
    label = 'Complémentaires'; emoji = '🔮'; color = '#f59e0b';
    summary = `${typeA} + ${typeB} — vos visions du monde divergent sur plusieurs points importants. Ce n'est pas un obstacle — c'est une invitation à grandir. Les meilleures relations ne sont pas celles où tout coule de source, mais celles où chacun devient meilleur grâce à l'autre.`;
  } else {
    label = 'Opposés attirés'; emoji = '⚡'; color = '#ef4444';
    summary = `${typeA} + ${typeB} — vous êtes très différents. Ce type de relation peut être épuisant ou transformateur — souvent les deux. L'attirance initiale est forte, mais la longévité demande une volonté consciente de se comprendre malgré des perceptions du monde radicalement opposées.`;
  }

  const dimensions = pairs.map(({ dim, a, b }) => ({
    dim,
    labelA: DIM_LABELS[a] ?? a,
    labelB: DIM_LABELS[b] ?? b,
    aligned: a === b,
    analysis: DIM_ANALYSIS[dim]?.(a, b) ?? '',
  }));

  return { score, label, emoji, color, summary, dimensions };
}

export { ALL_MBTI_TYPES };
