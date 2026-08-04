import type { Metadata } from 'next';
import Link from 'next/link';

const BASE = 'https://urcecret.site';

export const metadata: Metadata = {
  title: 'Comment fonctionne UrCecret — méthodologie, Elio, tarifs',
  description:
    "UrCecret en une page : comment le test MBTI est construit, ce qu'Elio (le coach IA) peut et ne peut pas faire, comment fonctionnent le Journal et les parcours, et les tarifs. Transparence complète sur la méthodologie.",
  alternates: { canonical: `${BASE}/a-propos` },
  openGraph: {
    title: 'Comment fonctionne UrCecret',
    description: "Méthodologie du test, rôle d'Elio, tarifs — tout ce qu'il faut savoir avant de commencer.",
    url: `${BASE}/a-propos`,
    siteName: 'UrCecret',
    locale: 'fr_FR',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Sur quoi est basé le test de personnalité UrCecret ?',
    a: "Le test s'appuie sur la théorie des types psychologiques de Carl Jung et sa formalisation en 16 types (le cadre popularisé sous le nom MBTI). Il mesure quatre axes — extraversion/introversion, intuition/sensation, pensée/sentiment, jugement/perception — à partir de tes réponses à des affirmations courtes, pour déterminer tes fonctions cognitives dominantes.",
  },
  {
    q: 'Le test MBTI est-il scientifiquement validé ?',
    a: "Le MBTI est largement utilisé en développement personnel et en entreprise depuis les années 1940, mais la recherche académique reste partagée sur sa validité psychométrique stricte (fiabilité test-retest, indépendance des axes). UrCecret le présente comme un outil de réflexion sur soi et un vocabulaire commun pour parler de sa personnalité — pas comme un diagnostic clinique ou un instrument de mesure scientifique au sens strict.",
  },
  {
    q: "Qu'est-ce qu'Elio, et est-ce un thérapeute ?",
    a: "Elio est un coach conversationnel propulsé par IA (modèles de langage), pas un professionnel de santé. Il connaît ton profil de personnalité, ton objectif personnel déclaré et l'historique de ton Journal, et adapte ses réponses en conséquence. Il ne pose aucun diagnostic médical ou psychologique et ne remplace pas un suivi thérapeutique — en cas de détresse réelle, la priorité est de contacter un professionnel de santé ou une ligne d'écoute.",
  },
  {
    q: 'Comment fonctionne le Journal émotionnel ?',
    a: "Chaque jour, tu notes ton humeur, ton niveau d'énergie, ton stress et une émotion dominante en quelques secondes. Cet historique sert de base à Elio pour repérer des tendances (ex. une baisse d'humeur récurrente un jour de la semaine) et à toi pour visualiser ton évolution dans le temps.",
  },
  {
    q: 'Que sont les parcours ?',
    a: "Ce sont des programmes guidés de 15 niveaux, un par objectif (confiance en soi, stress, émotions, relations, motivation, connaissance de soi), qui s'adaptent aux réponses données en cours de route plutôt que de dérouler un contenu identique pour tout le monde.",
  },
  {
    q: 'Combien coûte UrCecret ?',
    a: "Le test de personnalité est gratuit et accessible sans inscription. Un compte gratuit inclut aussi un accès limité à Elio. L'abonnement Starter (1,99 €/mois) débloque le profil complet et Elio sans limite quotidienne réduite ; des paliers supérieurs (5 €/mois et 9,99 €/mois, ou 29,99 €/an) donnent accès à davantage d'échanges quotidiens avec Elio. Résiliable à tout moment depuis le compte.",
  },
  {
    q: 'Mes données sont-elles utilisées pour autre chose ?',
    a: "Non — le contenu du Journal et les échanges avec Elio servent uniquement à personnaliser ta propre expérience. Voir la politique de confidentialité pour le détail complet.",
  },
];

export default function AProposPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'UrCecret', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Comment ça marche', item: `${BASE}/a-propos` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen text-white" style={{ background: 'var(--ink)' }}>
        <header className="border-b border-white/5 sticky top-0 z-20" style={{ background: 'rgba(21,18,31,0.9)', backdropFilter: 'blur(16px)' }}>
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-black">
              <span style={{ color: 'var(--gold)' }}>Ur</span>
              <span className="text-white">Cecret</span>
            </Link>
            <Link href="/quiz/personnalite" className="text-xs text-stone-500 hover:text-white transition-colors">
              Faire le test →
            </Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <p className="ur-label text-[11px] mb-4" style={{ color: 'var(--gold)' }}>Transparence</p>
            <h1 className="font-display text-3xl font-black text-white leading-tight mb-4">
              Comment fonctionne UrCecret
            </h1>
            <p className="text-stone-400 text-base leading-relaxed">
              Un test de personnalité, un journal émotionnel, un coach IA et des parcours guidés — voici précisément ce que fait chaque partie, sur quoi elle repose, et ce qu&apos;elle ne fait pas.
            </p>
          </div>

          <section className="ur-panel-ink mb-6 px-6 py-6">
            <h2 className="font-display text-lg font-black text-white mb-3">Le test de personnalité</h2>
            <p className="text-sm text-stone-300 leading-relaxed mb-3">
              Basé sur la théorie des types psychologiques de Carl Jung (formalisée en 16 types, le cadre connu sous le nom MBTI), le test mesure quatre axes à partir de réponses courtes : extraversion/introversion, intuition/sensation, pensée/sentiment, jugement/perception. Le résultat détermine tes fonctions cognitives dominantes, pas un simple acronyme à 4 lettres.
            </p>
            <p className="text-sm text-stone-400 leading-relaxed">
              C&apos;est un outil de réflexion sur soi, pas un diagnostic clinique — la recherche académique sur la validité psychométrique stricte du MBTI reste partagée, et UrCecret ne prétend pas le contraire.
            </p>
          </section>

          <section className="ur-panel-ink mb-6 px-6 py-6">
            <h2 className="font-display text-lg font-black text-white mb-3">Elio, le coach IA</h2>
            <p className="text-sm text-stone-300 leading-relaxed mb-3">
              Elio est propulsé par des modèles de langage et connaît ton profil de personnalité, l&apos;objectif que tu as choisi à l&apos;inscription, et l&apos;historique de ton Journal — ses réponses en tiennent compte au lieu de repartir de zéro à chaque conversation.
            </p>
            <p className="text-sm text-stone-400 leading-relaxed">
              Elio n&apos;est pas un professionnel de santé : il ne pose aucun diagnostic et ne remplace pas une thérapie. En cas de détresse réelle, la priorité reste de contacter un professionnel ou une ligne d&apos;écoute.
            </p>
          </section>

          <section className="ur-panel-ink mb-6 px-6 py-6">
            <h2 className="font-display text-lg font-black text-white mb-3">Le Journal et les parcours</h2>
            <p className="text-sm text-stone-300 leading-relaxed mb-3">
              Le Journal se remplit en quelques secondes chaque jour (humeur, énergie, stress, émotion dominante) et sert de matière à Elio pour repérer des tendances dans le temps, pas juste un instantané.
            </p>
            <p className="text-sm text-stone-400 leading-relaxed">
              Les parcours sont des programmes guidés de 15 niveaux, un par objectif — confiance en soi, stress, émotions, relations, motivation, connaissance de soi — qui s&apos;adaptent aux réponses données en cours de route.
            </p>
          </section>

          <section className="mb-10">
            <div className="rounded-2xl px-6 py-8 text-center" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
              <h2 className="font-display text-xl font-black text-white mb-2">Les tarifs, sans détour</h2>
              <p className="text-sm text-stone-400 mb-5 max-w-sm mx-auto leading-relaxed">
                Test gratuit, sans inscription. Starter à 1,99 €/mois pour le profil complet + Elio. Paliers supérieurs à 5 €/mois et 9,99 €/mois (ou 29,99 €/an) pour plus d&apos;échanges quotidiens avec Elio. Résiliable à tout moment.
              </p>
              <Link href="/quiz/personnalite" className="ur-btn-gold inline-flex px-8 py-3.5 text-sm">
                Faire le test gratuit →
              </Link>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-black text-white mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {FAQS.map(({ q, a }, i) => (
                <div key={i} className="ur-panel-ink overflow-hidden">
                  <h3 className="px-5 py-4 text-white font-bold text-sm leading-snug">{q}</h3>
                  <p className="px-5 pb-4 text-stone-400 text-sm leading-relaxed border-t border-white/5 pt-3">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center py-8 border-t border-white/5">
            <Link href="/politique-confidentialite" className="text-xs text-stone-600 hover:text-stone-400 transition-colors">
              Politique de confidentialité →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
