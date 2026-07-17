# Audit UrCecret — Paywall & Tracking (Partie A)

Aucun changement de design ni de copywriting (hors le strict nécessaire pour supprimer une fuite de données). Uniquement fonctionnel + tracking.

---

## 1. AUDIT DU PAYWALL

### Failles trouvées, puis corrigées

| # | Faille | Où | Gravité | Statut |
|---|--------|-----|---------|--------|
| 1 | Le dataset complet des 16 types MBTI (y compris contenu payant : `fullDesc`, `inLove`, `atWork`, `strengths`, `weaknesses`, `growth`, `famousExamples`, `compatibleWith`) était importé dans **5 composants client** (`TypeClient.tsx`, `DuoMbtiClient.tsx`, `DashboardClient.tsx`, `LandingPage.tsx`, `PersonnaliteClient.tsx`), donc bundlé en clair dans le JS envoyé à **tous les visiteurs**, payant ou non. | `lib/mbti.ts` (fichier monolithique) | 🔴 Critique | ✅ Corrigé |
| 2 | Même faille, en anglais : `lib/i18n/mbtiTypesEn.ts` contenait les traductions complètes (payantes incluses) et était importé par `TypeClient.tsx`. | `lib/i18n/mbtiTypesEn.ts` | 🔴 Critique | ✅ Corrigé (fichier supprimé, remplacé) |
| 3 | La page `/types/[code]` (SEO public) affichait le contenu payant **en clair dans le HTML server-rendered** : FAQ visible + JSON-LD (`amour`, `carrière`, `célébrités`) — visible par n'importe qui, y compris les moteurs de recherche, sans paiement. | `app/types/[type]/page.tsx` | 🔴 Critique (déjà en prod) | ✅ Corrigé |
| 4 | La même page passait l'objet type **complet** (payant inclus) en prop au composant client `<TypeClient>` — même si le composant n'affichait pas tout, le contenu payant était présent dans le payload HTML/RSC envoyé au navigateur. | `app/types/[type]/page.tsx` | 🔴 Critique | ✅ Corrigé |
| 5 | La page `/types/[code]/celebrites` était **entièrement construite sur le champ payant `famousExamples`** : grille de célébrités, JSON-LD, FAQ, CTA — tout en clair, publiquement, sans aucune vérification de paiement. Fuyait aussi `compatibleWith`. | `app/types/[type]/celebrites/page.tsx` | 🔴 Critique (déjà en prod) | ✅ Corrigé |
| 6 | La page `/suis-je/[code]` était la pire : elle affichait **tout le profil payant sans exception** — `inLove`, `atWork`, `famousExamples`, `compatibleWith`, et utilisait même `strengths` (payant) pour compléter les "8 signes" à chaque fois que les traits gratuits étaient < 8 (systématique). | `app/suis-je/[type]/page.tsx` | 🔴 Critique (déjà en prod) | ✅ Corrigé |
| 7 | `/compatibilite/[paire]` lisait directement `compatibleWith` (payant) pour afficher "Autres compatibilités" — publiquement. | `app/compatibilite/[pair]/page.tsx` | 🟠 Élevé | ✅ Corrigé |
| 8 | `lib/mbtiCompatibility.ts` (utilisé par `DuoMbtiClient.tsx`, composant client) lisait `compatibleWith` pour un bonus de score — fuite du champ payant dans le bundle JS public. | `lib/mbtiCompatibility.ts` | 🟠 Élevé | ✅ Corrigé |
| 9 | `app/api/results/[id]/route.ts` : accès direct par ID sans vérification `paid`. Audité : le schéma `QuizResult` ne stocke que `score`/`paid`/`quizSlug` (pas de contenu interprétatif), donc pas de fuite exploitable — mais confirmé comme point à surveiller si le modèle évolue. | `app/api/results/[id]/route.ts` | 🟡 Faible | ℹ️ Vérifié, pas de fuite actuelle |
| 10 | Sur `/success`, le texte "Profil {code} débloqué !" et "est débloqué — fais défiler..." s'affichait dès qu'un `typeCode` était présent dans l'URL, **même si le paiement Stripe n'était pas vérifié** (`paid=false`). Pas une fuite de contenu (tout le contenu réel était déjà bien gated), mais un message trompeur. | `app/success/page.tsx` | 🟡 Faible | ✅ Corrigé |
| 11 | Sur les 6 quiz secondaires (infidélité, amoureux, manipulé·e, vrais amis, relation toxique, burnout), l'aperçu "flouté" de l'analyse (3 lignes) était **flouté en CSS uniquement** — le texte réel restait présent en clair dans le DOM, lisible via l'inspecteur ou "voir le code source", flou non protecteur. | `app/quiz/[slug]/results/ResultsClient.tsx` | 🟠 Élevé | ✅ Corrigé (le flou affiche un texte générique, plus le vrai texte) |

### Point non corrigé — décision produit nécessaire

Sur ces mêmes 6 quiz secondaires, la fonction `buildAnalysis()` qui génère "l'analyse complète" (10 lignes par score) est **entièrement calculée côté client** et livrée dans le bundle JS à tout le monde. N'importe quel visiteur peut donc, via la console du navigateur, appeler cette fonction avec son score (déjà révélé gratuitement en %) et obtenir tout le contenu "payant" sans payer. Ce n'est pas une fuite de données personnelles (le texte est généré par gabarits, pas unique par utilisateur), mais c'est structurellement la même faille que le bug MBTI d'origine. La corriger proprement demande de déplacer cette génération côté serveur (nouvelle route API gated, comme `/api/profile/[code]`) — un changement plus large que "blinder l'existant", donc je ne l'ai pas fait sans validation. À traiter si tu veux fermer complètement ce vecteur.

### Vérifié sans faille trouvée

- **Webhook Stripe** (`app/api/webhook/route.ts`) : signature vérifiée avant toute écriture DB, tier ne passe à `premium` que sur événement Stripe authentique. Solide.
- **Page `/success`** : re-vérifie le paiement indépendamment via `stripe.checkout.sessions.retrieve()`, jamais de confiance dans les paramètres d'URL seuls.
- **`session.user.tier`** : NextAuth en mode `session: { strategy: 'database' }` → toujours lu en base à chaque requête, non falsifiable côté client (pas de JWT).
- **localStorage / variables client** : aucun chemin trouvé où le tier ou le contenu payant serait stocké/lu côté client en dehors de la session serveur.
- **`app/api/user/save-mbti/route.ts`** : POST uniquement, requiert session serveur, ne renvoie rien de sensible.

### Comment c'est structurellement blindé maintenant

Le dataset MBTI est désormais **scindé en 3 fichiers** :
- `lib/mbti-free.ts` — champs gratuits uniquement (nom, tagline, rareté, description courte, traits). Importable partout, y compris client.
- `lib/mbti-premium.ts` — champs payants uniquement (`fullDesc`, `inLove`, `atWork`, `strengths`, `weaknesses`, `growth`, `famousExamples`, `compatibleWith`). **Jamais importé par un composant `'use client'`.**
- `lib/mbti-server.ts` — fusionne les deux, réservé aux composants serveur.

Le contenu payant n'est livré au navigateur que via **une seule route** : `app/api/profile/[code]/route.ts`, qui vérifie `getServerSession()` et le `tier === 'premium'` avant de répondre. Comme les fichiers `-free` et `-premium` ont des types TypeScript distincts, **toute réintroduction accidentelle d'un champ payant dans un composant client fait échouer la compilation** (`tsc --noEmit`) — j'ai vérifié : build et type-check passent sans erreur après tous les correctifs.

---

## 2. TRACKING FIABLE

### Failles trouvées, puis corrigées

| # | Faille | Où | Gravité | Statut |
|---|--------|-----|---------|--------|
| 1 | **`payment_success` (pixel "achat" TikTok/GA4) se déclenchait sur `/success` sans vérifier que le paiement Stripe était réellement confirmé.** N'importe qui atterrissant sur `/success` sans session Stripe valide envoyait un faux signal d'achat à TikTok/GA4 — ça peut fausser l'optimisation des campagnes publicitaires (le pixel apprend sur de fausses conversions). Le montant envoyé était aussi codé en dur à 1,99 € quel que soit le vrai montant (abonnement 9,99€/29,99€ inclus). | `app/success/SuccessTracker.tsx` | 🔴 Critique | ✅ Corrigé — ne se déclenche que si `paid=true` (revérifié serveur), montant réel utilisé |
| 2 | Étape fantôme dans le funnel admin : le dashboard interrogeait `/__quiz/q10`, mais aucun code ne l'écrit jamais (le tracker de paliers n'écrit que q25/q50/q75). Cette étape affichait donc **toujours 0**, créant un faux "100% d'abandon" visible dans le dashboard. | `app/natha-admin/page.tsx` | 🟠 Élevé | ✅ Corrigé (étape fantôme retirée) |
| 3 | **Incohérence de casse d'email entre Stripe et NextAuth.** NextAuth (magic link) stocke les emails en minuscules. Stripe renvoie l'email tel que tapé au checkout (casse libre). Le webhook faisait `user.upsert({where:{email}})` avec l'email brut de Stripe : si la casse diffère, ça crée un **second compte "premium" fantôme** au lieu de mettre à niveau le vrai compte — le client paie mais son compte réel (celui où il se connecte) reste "free". C'est à la fois un bug de tracking (ventes mal reliées aux utilisateurs) et un bug d'accès. | `app/api/webhook/route.ts`, `app/success/page.tsx` | 🔴 Critique | ✅ Corrigé — email normalisé en minuscules partout où le webhook touche la base |
| 4 | Aucun identifiant visiteur persistant n'existait dans le système de tracking (`PageView` n'a que `path` + date). Impossible de compter les étapes du funnel en **visiteurs uniques** — seulement en événements bruts. Un simple refresh de page peut gonfler une étape indépendamment des autres, créant potentiellement l'inversion que tu décris ("une étape avancée qui compte plus d'events qu'une étape antérieure"). | `prisma/schema.prisma`, `lib/analytics.ts` | 🟠 Structurel | ✅ Fondation posée (voir ci-dessous) |
| 5 | Aperçu flouté des quiz secondaires : voir point 11 de la partie paywall — même défaut technique (CSS non protecteur), impact tracking nul mais mentionné ici car corrigé dans le même passage. | — | — | ✅ Corrigé |

### Ce que j'ai posé pour le point 4 (funnel en visiteurs uniques)

- Nouveau champ `PageView.visitorId` (nullable, migration additive sans risque — s'applique automatiquement au prochain déploiement via `prisma db push`, déjà dans ton script de build).
- `lib/visitorId.ts` : identifiant anonyme généré une fois par navigateur, stocké en `localStorage`, envoyé avec chaque événement (`track()`, tracking de paliers du quiz, clic affilié).
- **Je n'ai pas basculé les compteurs du dashboard sur "visiteurs uniques" tout de suite** : comme les anciennes lignes n'ont pas de `visitorId` (champ nullable, rétrocompatible), basculer immédiatement aurait fait chuter tous les compteurs historiques à 0 dans le dashboard le temps que les nouvelles données s'accumulent — ça aurait eu l'air d'une régression. Une fois quelques jours de données avec `visitorId` accumulées, je peux basculer les requêtes du funnel sur des comptages `distinct(visitorId)` pour un vrai chiffre "visiteurs uniques". Dis-moi quand tu veux que je fasse ce basculement.

### Vérifié sans faille trouvée

- **Attribution affilié (`?ref=`)** : cookie `httpOnly` 30 jours posé par le middleware, avec un mécanisme de "self-healing" spécifique pour le cas TikTok in-app → navigateur réel (le cookie ne survit pas au changement d'app, donc l'URL est ré-enrichie avec `?ref=` automatiquement). Fallback `localStorage` côté client. Le checkout lit le cookie en priorité, `localStorage` en secours. Solide, rien à corriger.
- **Rattachement vente Stripe → affilié** : le webhook (signature vérifiée) ne crée une `AffiliateConversion` que si `affiliateSlug` correspond à un `Affiliate` réellement existant en base (`findUnique`), et utilise `upsert` sur `stripeSessionId` (idempotent — pas de doublon si Stripe renvoie l'event deux fois). Solide.
- **Rattachement vente Stripe → utilisateur** : `Conversion` et le tier utilisateur sont mis à jour uniquement depuis des events Stripe vérifiés par signature. Le seul bug trouvé est la casse d'email (point 3 ci-dessus), maintenant corrigé.
- **Guards anti-duplication** : `quiz_start`, `paywall_view`, les paliers de progression (25/50/75%) sont chacun dans un `useEffect` à déclenchement unique par montage de composant (pas de re-déclenchement en boucle).

---

## 3. Checklist — à exécuter toi-même en navigation privée

### A. Paywall bloque bien

1. Ouvre une fenêtre de navigation privée (pas connecté).
2. Va sur `/quiz/personnalite`, termine le quiz → tu dois voir **uniquement** les 4 lettres du type + un teaser (traits, aperçu flouté) + le bouton de paiement. Aucun texte "amour", "carrière", "célébrités" ne doit apparaître en clair.
3. Ouvre l'outil dev (`Cmd+Opt+I` / `F12`) → onglet **Réseau** → recharge la page de résultat → vérifie qu'aucune réponse JSON ne contient `inLove`, `atWork`, `famousExamples`, `strengths`, `weaknesses`, `growth`, `fullDesc`, `compatibleWith`.
4. Va sur `/types/intj` (ou n'importe quel type) sans payer → même vérification : rien de payant visible, y compris via "Afficher le code source" (`Ctrl+U`) — cherche `inLove`/`famousExamples` dans le HTML brut, ça ne doit rien retourner.
5. Va sur `/types/intj/celebrites` → les noms de célébrités doivent être **verrouillés** (cases "?" + bouton débloquer), pas affichés.
6. Va sur `/suis-je/intj` → section amour/travail/célébrités/compatibilité doit être un bandeau verrouillé, pas le contenu réel.
7. Va sur `/compatibilite/intj-enfp` → la section "Autres compatibilités" doit s'afficher (calculée par algorithme), mais rien d'autre de payant.
8. Paye réellement (1,99 €, carte de test si tu as les clés Stripe en mode test) → vérifie que `/types/intj` affiche bien maintenant tout le contenu débloqué, et que `/api/profile/INTJ` (visité en étant connecté) renvoie le JSON complet **seulement après** paiement confirmé.
9. Essaie d'appeler `/api/profile/INTJ` directement dans le navigateur **sans être connecté** → doit renvoyer `{"error":"Paiement requis"}` avec un statut 403.

### B. Tracking enregistre correctement

1. En navigation privée, va sur `urcecret.site/?ref=test-checklist`.
2. Ouvre les devtools → onglet Application/Stockage → cookies → vérifie la présence d'un cookie `urs_ref = test-checklist`.
3. Fais le quiz jusqu'au bout, arrive sur le paywall, clique "Payer" (tu peux annuler ensuite si tu ne veux pas payer pour de vrai).
4. Va sur `/natha-admin` (avec tes accès) → section funnel "Démarré le quiz" → "Quiz terminé" → "Paywall vu" → "Paiement cliqué" doit refléter ton passage (les chiffres montent, dans l'ordre logique).
5. Si tu vas jusqu'au paiement réel : vérifie dans `/natha-admin` (section affiliés) que le clic `test-checklist` a bien un montant de vente rattaché, une fois le paiement confirmé par Stripe (peut prendre quelques secondes, le temps que le webhook arrive).
6. Vérifie dans Stripe Dashboard → Webhooks → que l'event `checkout.session.completed` a bien un statut "Réussi" (200) pour ce paiement.

---

## Fichiers touchés

**Sécurité paywall** : `lib/mbti.ts`, `lib/mbti-free.ts` (nouveau), `lib/mbti-premium.ts` (nouveau), `lib/mbti-server.ts` (nouveau), `lib/i18n/mbtiTypesEnFree.ts` (nouveau), `lib/i18n/mbtiTypesEnPremium.ts` (nouveau), `lib/i18n/mbtiTypesEn.ts` (supprimé), `app/api/profile/[code]/route.ts` (nouveau), `app/types/[type]/page.tsx`, `app/types/[type]/TypeClient.tsx`, `app/types/[type]/celebrites/page.tsx`, `app/types/[type]/celebrites/CelebritesClient.tsx` (nouveau), `app/suis-je/[type]/page.tsx`, `app/suis-je/[type]/SuisJePremiumSections.tsx` (nouveau), `app/compatibilite/[pair]/page.tsx`, `lib/compatibility.ts`, `lib/mbtiCompatibility.ts`, `app/types/page.tsx`, `app/duo/DuoMbtiClient.tsx`, `app/dashboard/DashboardClient.tsx`, `components/LandingPage.tsx`, `app/quiz/personnalite/PersonnaliteClient.tsx`, `app/api/og/route.tsx`, `app/success/page.tsx`, `app/quiz/[slug]/results/ResultsClient.tsx`.

**Tracking** : `app/success/SuccessTracker.tsx`, `app/api/webhook/route.ts`, `app/natha-admin/page.tsx`, `prisma/schema.prisma`, `lib/visitorId.ts` (nouveau), `lib/analytics.ts`, `app/api/track/route.ts`, `app/api/affiliate-click/route.ts`, `components/AffiliateTracker.tsx`.

**Autres** : `tsconfig.json` (target ES5 → ES2020, dépréciation TypeScript, aucun impact sur le build de prod Next.js/SWC).

Build de production (`next build`) et vérification de types (`tsc --noEmit`) passent sans erreur.
