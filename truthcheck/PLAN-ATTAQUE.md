# 🎯 PLAN D'ATTAQUE — Premier abonné ce soir (objectif 30€ MRR)

> Date : 03/06/2026 · Site : https://urcecret.site · Modèle : Truity → UrSecret

---

## ✅ Ce qui vient d'être mis en place (code poussé)

Le tunnel de conversion façon **Truity** est branché sur UrSecret :

1. **Porte d'entrée = test de personnalité 16 types** (`/quiz/personnalite`)
   La page d'accueil mène directement au test. C'est le hook qui ramène les clients.
2. **Teaser gratuit** : l'utilisateur passe les 24 questions, découvre son type (INFJ, ENFP…) + un aperçu gratuit.
3. **Paywall (façon Truity)** : pour voir le rapport complet, il faut **créer un compte puis s'abonner**.
4. **L'abonnement débloque TOUT** : le rapport complet **+ les 15 tests UrSecret** (couple, manipulation, burnout…).
   → *Avant de payer = Truity. Après avoir payé = UrSecret.* Exactement le plan.
5. **Prix affichés** : **4,99 €/mois** (principal) ou **29,99 €/an** (−50 %).

---

## ⚠️ AVANT DE LANCER — checklist technique (5 min)

Le code est prêt, mais le paiement réel a besoin de ces variables sur **Vercel → Settings → Environment Variables** :

| Variable | À quoi ça sert | Statut à vérifier |
|----------|----------------|-------------------|
| `STRIPE_SECRET_KEY` | Clé Stripe **LIVE** (commence par `sk_live_`) | ⬜ |
| `STRIPE_WEBHOOK_SECRET` | Webhook `checkout.session.completed` | ⬜ |
| `STRIPE_PRICE_ID` | Prix mensuel 4,99 € (sinon fallback 9,99 €) | ⬜ |
| `STRIPE_ANNUAL_PRICE_ID` | Prix annuel 29,99 € | ⬜ |
| `NEXTAUTH_SECRET` + `NEXTAUTH_URL` | Comptes utilisateurs | ⬜ |
| `EMAIL_SERVER` + `EMAIL_FROM` | Lien magique de connexion par email | ⬜ |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` | Connexion Google | ⬜ |
| `DATABASE_URL` | Base de données (comptes + paiements) | ⬜ |

**Test grandeur nature (obligatoire) :**
1. Va sur https://urcecret.site → passe le test.
2. Clique « Débloquer 4,99 €/mois » → crée un compte → paie avec **ta vraie carte**.
3. Vérifie que tu atterris sur `/success` et que `/quizzes` est débloqué.
4. Rembourse-toi depuis Stripe si tu veux. Si ça marche pour toi → ça marche pour tout le monde.

> Si une carte test (`4242…`) est demandée, c'est que Stripe est en mode **TEST** → bascule en **LIVE**.

---

## 🚀 CE SOIR — décrocher le 1er abonné (le plus dur, puis ça roule)

Le premier euro est psychologique. Vise **6 abonnés à 4,99 €** OU **1 abonnement annuel à 29,99 €** = objectif atteint.

### Vague 1 — Cercle proche (maintenant, 0 € de pub)
- Envoie le lien à **10 potes** en DM : *« J'ai sorti mon test de perso, dis-moi sur quel type tu tombes 👀 urcecret.site »*
- Le but n'est PAS de leur demander de payer : c'est de **tester le tunnel en conditions réelles** et créer du bouche-à-oreille.
- 2-3 d'entre eux paieront par curiosité s'ils accrochent au teaser.

### Vague 2 — Story Instagram / Snap (ce soir)
- Capture ton propre résultat (ex : « INFJ – 1,5 % de la population »).
- Poste-le en story : *« Test le plus fiable que j'ai trouvé, je suis [TYPE]. Toi ? »* + sticker lien.
- L'effet « moi vs toi » génère des partages → trafic gratuit.

### Vague 3 — Communautés (ce soir / demain)
- **TikTok** : 1 vidéo simple = toi qui scrolles ton rapport + texte « POV : tu découvres que t'es le type le plus rare ». Lien en bio.
- **Reddit FR** : r/france, r/quizz, r/DevenirMeilleur — partage le test comme un outil, pas comme une pub.
- **Discord** : balance le lien dans 2-3 serveurs où tu es déjà actif.

---

## 📈 La règle des 100k MRR (cap long terme)

- **MRR = abonnés × prix.** 100k €/mois = ~20 000 abonnés à 4,99 € (ou moins en annuel).
- Le seul levier qui compte au début : **le taux de conversion du test → abonnement.** Optimise CE chiffre avant de scaler la pub.
- Boucle gagnante : **contenu TikTok gratuit → test → paywall → abonné → il fait les 15 tests → il partage son résultat → nouveau trafic.**

---

## 🎬 Côté vidéo/montage

Je ne peux pas faire de montage vidéo (hors de mes capacités). Pour les vidéos TikTok :
utilise **CapCut** (gratuit, templates « personality test » tout faits). Tu films ton écran, tu colles le texte, tu exportes. 30 min/vidéo max au début.

---

## ▶️ Prochaine étape immédiate

1. Coche la checklist Stripe ci-dessus.
2. Fais UN vrai paiement test sur ton propre site.
3. Lance la Vague 1 (10 DM).

**Le tunnel est prêt. Il ne manque que le trafic. Go.** 🚀
