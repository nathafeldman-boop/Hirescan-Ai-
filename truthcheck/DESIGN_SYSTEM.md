# UrCecret — Direction artistique « L'Oracle »

## 1. Pourquoi cette direction

### Ce qui inspire confiance vs ce qui fait "arnaque", dans l'astro/spiritualité premium

| Marque | Ce qu'elle fait bien | Le risque si on la copie telle quelle |
|---|---|---|
| **Co-Star** | Noir/blanc strict, typographie franche, ton direct, zéro image mystique clichée. Prouve qu'on peut être "spirituel" sans être kitsch — la confiance vient de la *retenue*, pas de la démonstration. | Copié à l'identique, ça devient froid/clinique — on perd toute la promesse "révélation intime" de UrCecret (le concept dossier scellé a besoin d'un peu de chaleur et de cérémonie). |
| **The Pattern** | Palette sombre sérieuse (bleu/teal), aucune animation cosmique gratuite, traite le profil comme une vraie séance de thérapie. | Certains utilisateurs la trouvent "clinique et ennuyeuse" — le mystique a totalement disparu, il ne reste que l'app utilitaire. |
| **Chani** | Chaleur, hand-touched, motifs (constellations, plantes) utilisés avec parcimonie et alignés sur une grille stricte — pas juste posés en décor. Palette douce (écru, blush, lavande). | Le style "collage/zine" peut vite glisser vers le "carte de vœux ésotérique" si la typographie et la grille ne sont pas rigoureuses. |
| **Sanctuary** | Positionnement "premium mystique" assumé (violet profond + or), avec de vrais experts humains derrière — le visuel doit être à la hauteur de la promesse. | Sans la discipline typographique de Co-Star, "violet + or + étoiles" est *exactement* le générique astro-kitsch qu'on veut éviter. |

**Le fil commun des marques crédibles : la confiance vient de ce qui n'est PAS fait.** Pas de dégradés violets partout, pas de glow qui pulse en continu, pas d'étoiles semées au hasard, pas de glassmorphism (le langage visuel générique de n'importe quel SaaS Tailwind par défaut). Le mystique vient de la *matière* (encre, or en aplat, papier) et de la *cérémonie* (une révélation qui se dévoile, pas un dashboard qui s'affiche).

### La position de UrCecret : "L'Oracle"

Ni le blanc clinique de Co-Star, ni le violet-néon générique de l'astro premium bas de gamme. **UrCecret est un cabinet de curiosités, pas un temple new-age** : encre indigo profonde (jamais noir pur — un noir pur est un noir d'écran, l'indigo a une chaleur), un seul accent — l'or antique, toujours en aplat, jamais en dégradé ni en glow animé — et un motif signature dessiné à la main plutôt qu'un stock d'étoiles : **le sceau**, un astrolabe à 8 graduations (les 8 fonctions cognitives de Jung), qui tourne lentement comme un cadran, pas comme un logo qui vibre.

Le concept "dossier scellé" se lit littéralement dans le système : le papier crème (`--paper`) pour les zones "publiques/gratuites" du dossier, l'encre profonde (`--ink`) pour les zones "confidentielles/premium" — la bascule visuelle papier → encre EST la métaphore du déverrouillage, sans avoir besoin d'un cadenas clipart.

## 2. Palette

3 couleurs + neutres, jamais plus :

| Rôle | Token | Valeur | Usage |
|---|---|---|---|
| Encre (surface sombre) | `--ink` | `#15121F` | Fond des écrans "révélation" : hero, quiz, paywall, résultat débloqué |
| Encre douce | `--ink-soft` | `#1F1B2E` | Cartes/panneaux sur fond `--ink` |
| Papier (surface claire) | `--paper` | `#F2ECDE` | Fond des écrans "publics/éditoriaux" : landing (contenu), pages SEO type/[code] |
| Papier clair | `--paper-panel` | `#FAF6EC` | Cartes/panneaux sur fond `--paper`, et texte sur `--ink` |
| **Or antique — seul accent** | `--gold` | `#C9A227` | CTA principal, motif sceau, labels. Toujours en aplat — jamais de `linear-gradient(gold, gold-light)` |
| Or, fond | `--gold-soft` | `rgba(201,162,39,.10)` | Fond de badge/pill discret |
| Or, filet | `--gold-line` | `rgba(201,162,39,.35)` | Bordures sur fond `--ink` |
| Filet clair | `--line` | `rgba(21,18,31,.14)` | Séparateurs sur `--paper` |
| Filet sombre | `--line-ink` | `rgba(250,246,236,.14)` | Séparateurs sur `--ink` |
| Familles (4 groupes MBTI) | `--fam-nt/nf/sj/sp` | saphir/améthyste/émeraude/cuivre, sourds | Étiquette de classification uniquement — jamais comme accent principal d'un écran |

**Règle absolue : pas de dégradés de couleur, pas de glow animé, pas de glassmorphism (`backdrop-filter: blur` + fond translucide superposé).** Ce sont les 3 marqueurs visuels du "SaaS Tailwind par défaut" / de l'astro-kitsch — les deux pièges nommés dans le brief.

## 3. Typographie

- **Playfair Display** (`--font-display`) — didone à fort contraste, dramatique. Titres, chiffres mis en avant, citations, l'italique pour l'emphase (jamais le gras + italique ensemble). C'est la voix "carte de tarot / manuscrit".
- **Instrument Sans** (`--font-sans`) — sans-serif neutre. Corps de texte, UI, boutons, labels. C'est la voix "lisible, honnête".
- **`.ur-label`** — Instrument Sans, `font-weight:700`, `letter-spacing:0.16em`, majuscules. Le seul usage de majuscules dans tout le système (eyebrows, tags, étiquettes de statut) — jamais un titre entier en majuscules.

## 4. Espacement & forme

- Rayons : `rounded-full` (boutons, pills, badges) / `rounded-2xl` = 1rem (cartes, panneaux) / `rounded-xl` (petits éléments). Jamais d'angles droits sur un élément interactif.
- Largeurs de contenu : `max-w-xl` (lecture single-column, quiz/résultat) / `max-w-lg` / `max-w-2xl` / `max-w-5xl` (grilles, landing). Mobile-first : padding horizontal `px-4`–`px-6`, jamais de contenu collé au bord.
- Un seul filet 1px (`--line`/`--line-ink`) pour séparer, jamais d'ombre portée décorative en dehors des boutons dorés (qui ont un léger `hover:opacity-92` + `active:scale-98`, pas de `box-shadow` de glow).

## 5. Le motif signature — le Sceau

`components/Seal.tsx` : un cercle gravé à la main façon astrolabe — 2 cercles concentriques, 8 graduations (les 8 fonctions cognitives de Jung), un point central. Trait fin (`stroke-width: 1.2`), jamais rempli. Utilisé avec parcimonie :
- Hero de la landing et de l'écran de révélation (grand, `spin` lent en option — 90s par tour, `.ur-seal-turn`)
- Loader / écran d'analyse (rotation lente = l'idée d'un instrument qui calcule, pas un spinner générique)
- Jamais répété plusieurs fois sur un même écran, jamais utilisé comme motif de fond en pattern.

## 6. Micro-animations

- `.ur-reveal` / `.ur-fade-1/2/3` — un seul mouvement, fade + translateY(10px), décalé de 80ms entre éléments. Pas de bounce, pas d'élastique.
- `.ur-cut` — pour un texte "verrouillé" : masque en dégradé qui coupe la phrase à 55-96%, comme si l'encre s'évaporait en fin de ligne. Remplace tout usage de `filter: blur()` sur du texte à protéger (un flou CSS reste lisible dans l'inspecteur — voir l'audit sécurité — et visuellement `.ur-cut` est plus élégant qu'un flou générique).
- `prefers-reduced-motion: reduce` désactive tout, systématiquement.

## 7. Composants clés (`app/globals.css`)

| Classe | Usage |
|---|---|
| `.ur-btn-gold` | CTA principal — pilule or, texte encre |
| `.ur-btn-ink` | CTA secondaire sur fond `--paper` — pilule encre, texte papier |
| `.ur-btn-outline` | CTA tertiaire sur fond `--ink` — contour or, transparent |
| `.ur-panel` | Carte sur fond `--paper` |
| `.ur-panel-ink` | Carte sur fond `--ink` |
| `.ur-badge` | Étiquette pilule (rareté, statut, tag de famille) |
| `.ur-label` | Eyebrow / petites capitales tracées |
| `.ur-rule` / `.ur-rule-ink` | Filet 1px |
| `.ur-cut` | Texte "verrouillé", coupé en fin de ligne |
| `.ur-reveal` / `.ur-fade-1/2/3` | Entrée en fondu, décalée |
| `.ur-seal-turn` | Rotation lente du sceau (90s/tour) |

Alias Tailwind (`tailwind.config.ts`) : `bg-ink`, `bg-ink-soft`, `bg-paper`, `bg-paper-panel`, `bg-gold` / `bg-gold-soft` / `border-gold-line`, `text-fam-nt/nf/sj/sp` — pointent vers les mêmes variables CSS, pour écrire directement en classes Tailwind plutôt qu'en `style={{...}}` inline dans le nouveau code.

## 8. État de la migration (voir aussi le rapport de fin de tâche)

Écrans déjà 100% sur ce système avant cette passe : la landing (`components/LandingPage.tsx`), l'écran de quiz + l'écran d'analyse + le paywall post-quiz (`app/quiz/personnalite/PersonnaliteClient.tsx`), la révélation de type + son paywall (`app/types/[type]/page.tsx` + `TypeClient.tsx`). Ce sont les écrans les plus visités du funnel — la base était donc déjà solide.

Migrés dans cette passe : le hero SEO du quiz (`app/quiz/personnalite/page.tsx`), l'écran de bascule navigateur in-app (`InAppBrowserOverlay` dans `PersonnaliteClient.tsx`), la révélation post-paiement (`app/success/page.tsx` + son email transactionnel), toute la compatibilité (`app/duo/*`, `app/compatibilite/[pair]/page.tsx`, `app/suis-je/[type]/page.tsx` + `SuisJePremiumSections.tsx`) et toute la fusion (`app/fusion/*`). `tailwind.config.ts` et `app/layout.tsx` nettoyés en même temps (tokens morts retirés, conflit de nom `ink` résolu).

Volontairement laissés tels quels (hors du périmètre des 7 écrans demandés — landing, quiz, question, paywall, résultat, compatibilité, fusion) : `app/onboarding/`, le moteur des 6 quiz annexes (`app/quiz/[slug]/QuizClient.tsx`), `app/analyze/`, `app/share/[id]/`, `app/dashboard/`, `app/login/`. Ces écrans utilisent encore les anciennes classes CSS (`.quiz-opt`, `.glass`, `.ob-pill`, `.dxt-btn`, `.gradient-btn`) — volontairement **conservées** dans `globals.css` pour ne pas les casser. À migrer dans une prochaine passe si tu veux étendre la cohérence à l'app entière.
