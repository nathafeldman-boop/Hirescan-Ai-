// ── Mise en forme des réponses d'Elio ────────────────────────────────────────
// Une réponse d'Elio doit se lire comme une réflexion personnelle, pas comme
// un bloc de texte plat. Trois niveaux, dans l'ordre de priorité :
//
//  1. Un PARAGRAPHE entièrement entouré d'astérisques (*comme ça*) devient un
//     encart mis en valeur — le "point clé" de la réponse.
//  2. Un paragraphe entièrement entre parenthèses devient une aparté en style
//     secondaire (plus petit, plus doux) — une nuance, pas l'idée principale.
//  3. À l'intérieur d'un paragraphe normal : les liens restent cliquables, et
//     un petit lexique de mots à charge émotionnelle est coloré selon sa
//     famille (violet = vulnérabilité/introspection, bleu = clarté/calme,
//     vert = progrès/stabilité, cuivre = intensité/énergie) — les mêmes 4
//     teintes déjà utilisées pour les familles MBTI ailleurs dans l'app.
//
// Tout ça reste 100% déterministe (aucun appel IA) : on ne fait qu'habiller
// le texte que le modèle a déjà produit.

const URL_RE = /(https?:\/\/[^\s]+)/g;

type KeywordFamily = 'violet' | 'blue' | 'green' | 'copper';

const KEYWORD_COLOR: Record<KeywordFamily, string> = {
  violet: 'var(--fam-nf)',
  blue: 'var(--fam-nt)',
  green: 'var(--fam-sj)',
  copper: 'var(--fam-sp)',
};

// Liste volontairement courte et lisible plutôt qu'exhaustive — l'objectif
// est une touche d'intention visuelle, pas une analyse sémantique complète.
const KEYWORDS: { family: KeywordFamily; words: string[] }[] = [
  { family: 'violet', words: ['fatigue émotionnelle', 'vulnérabilité', 'vulnérable', 'peur', 'anxiété', 'anxieux', 'anxieuse', 'tristesse', 'solitude', 'culpabilité', 'honte', 'insécurité'] },
  { family: 'blue', words: ['clarté', 'logique', 'réflexion', 'compréhension', 'calme', 'paix', 'équilibre', 'lucidité'] },
  { family: 'green', words: ['croissance', 'progrès', 'stabilité', 'confiance', 'sécurité', 'guérison', 'apaisement'] },
  { family: 'copper', words: ['colère', 'passion', 'énergie', 'frustration', 'excitation', 'impatience', 'épuisement'] },
];

// Construit un seul motif "mot1|mot2|..." trié par longueur décroissante pour
// que "fatigue émotionnelle" matche avant "fatigue" seul, s'il existait.
const KEYWORD_RE = new RegExp(
  '\\b(' +
    KEYWORDS.flatMap((g) => g.words).sort((a, b) => b.length - a.length).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') +
  ')\\b',
  'gi'
);

function familyOf(word: string): KeywordFamily {
  const lower = word.toLowerCase();
  return KEYWORDS.find((g) => g.words.some((w) => w.toLowerCase() === lower))?.family ?? 'blue';
}

// Texte + liens + mots-clés colorés — le rendu "inline" d'un paragraphe normal.
function renderInline(text: string, keyPrefix: string) {
  const urlParts = text.split(URL_RE);
  const nodes: React.ReactNode[] = [];

  urlParts.forEach((part, i) => {
    if (i % 2 === 1) {
      nodes.push(
        <a key={`${keyPrefix}-url-${i}`} href={part} target="_blank" rel="noopener noreferrer" className="underline break-all" style={{ color: 'var(--gold)' }} onClick={(e) => e.stopPropagation()}>
          {part}
        </a>
      );
      return;
    }
    const kwParts = part.split(KEYWORD_RE);
    kwParts.forEach((seg, j) => {
      if (!seg) return;
      const isKeyword = j % 2 === 1;
      if (isKeyword) {
        nodes.push(
          <span key={`${keyPrefix}-kw-${i}-${j}`} style={{ color: KEYWORD_COLOR[familyOf(seg)], fontWeight: 600 }}>
            {seg}
          </span>
        );
      } else {
        nodes.push(<span key={`${keyPrefix}-t-${i}-${j}`}>{seg}</span>);
      }
    });
  });

  return nodes;
}

export default function ElioMessage({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <div className="flex flex-col gap-2.5">
      {paragraphs.map((raw, i) => {
        const p = raw.trim();

        // 1. Encart mis en valeur — paragraphe entier entre astérisques.
        const asteriskMatch = p.match(/^\*(.+)\*$/s);
        if (asteriskMatch) {
          return (
            <div
              key={i}
              className="rounded-xl px-3.5 py-3"
              style={{ background: 'var(--fam-nf-soft, rgba(107,63,82,0.08))', borderLeft: '3px solid var(--fam-nf)' }}
            >
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--fam-nf)', fontWeight: 700 }}>
                {renderInline(asteriskMatch[1].trim(), `p${i}`)}
              </p>
            </div>
          );
        }

        // 2. Aparté secondaire — paragraphe entier entre parenthèses.
        const parenMatch = p.match(/^\((.+)\)$/s);
        if (parenMatch) {
          return (
            <p key={i} className="text-[12.5px] leading-relaxed italic" style={{ color: '#8a8272' }}>
              {renderInline(parenMatch[1].trim(), `p${i}`)}
            </p>
          );
        }

        // 3. Paragraphe normal — préserve les retours à la ligne simples.
        const lines = p.split('\n');
        return (
          <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
            {lines.map((line, li) => (
              <span key={li}>
                {renderInline(line, `p${i}l${li}`)}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
