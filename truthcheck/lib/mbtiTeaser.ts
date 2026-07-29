// ── Aperçu "frustrant" du paywall MBTI ───────────────────────────────────────
// Trois phrases qui donnent l'impression d'être déjà lu(e) — sans jamais
// révéler le code à 4 lettres (voir ResultTeaser dans PersonnaliteClient.tsx,
// qui garde ce principe strict). Dérivées des 3 premières lettres du type
// (E/I, S/N, T/F — la 4e, J/P, n'est volontairement pas utilisée pour rester
// à 3 lignes courtes, percutantes). typeCode reste en mémoire côté client de
// toute façon (c'est le prop de ResultTeaser) : lire ses lettres pour choisir
// une phrase ne "révèle" rien de plus que ce qui est déjà là.

const LINES_FR: Record<string, string> = {
  E: 'Tu tires ton énergie du contact avec les autres, même quand tu ne le montres pas.',
  I: 'Tu caches beaucoup plus que tu ne montres.',
  S: 'Tu fais confiance à ce qui est concret, prouvé, réel.',
  N: 'Tu sembles être quelqu\'un de très intuitif — tu sens les choses avant de les comprendre.',
  T: 'Tu analyses avant de ressentir, même si ça ne se voit pas de l\'extérieur.',
  F: 'Tu comprends rapidement ce que ressentent les autres, parfois avant eux-mêmes.',
};

const LINES_EN: Record<string, string> = {
  E: 'You draw your energy from other people, even when it doesn\'t show.',
  I: 'You hide far more than you let on.',
  S: 'You trust what\'s concrete, proven, real.',
  N: 'You seem like a deeply intuitive person — you sense things before you understand them.',
  T: 'You analyze before you feel, even if it doesn\'t look that way from outside.',
  F: 'You pick up on what others feel faster than most, sometimes before they do.',
};

export function teaserLines(typeCode: string, lang: 'fr' | 'en' = 'fr'): string[] {
  const letters = typeCode.toUpperCase().split('');
  const pool = lang === 'en' ? LINES_EN : LINES_FR;
  return [letters[0], letters[1], letters[2]]
    .map((l) => pool[l])
    .filter((l): l is string => !!l);
}
