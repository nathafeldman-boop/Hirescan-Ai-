import type { Metadata } from 'next';
import Link from 'next/link';
import QuizListSection from './QuizListSection';

const BASE = 'https://urcecret.site';

export const metadata: Metadata = {
  title: 'Tous les quizzes — UrCecret',
  description: '15 questionnaires anonymes : infidélité, narcissisme, manipulation, burnout, dépression, amour, amitié et plus. Résultats instantanés, 100% gratuit, zéro compte requis.',
  keywords: ['quiz anonyme', 'questionnaire psychologique', 'test infidélité', 'test amour', 'orientation sexuelle quiz', 'suis-je adopté', 'vrais amis quiz', 'suis-je narcissique', 'suis-je manipulé', 'burnout test', 'UrCecret'],
  openGraph: {
    title: 'Tous les quizzes | UrCecret',
    description: '15 questionnaires anonymes pour découvrir la vérité sur toi-même, ton couple, tes amis et ta famille.',
    url: `${BASE}/quizzes`,
    siteName: 'UrCecret',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'UrCecret — Tous les quizzes' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tous les quizzes | UrCecret',
    description: '15 questionnaires anonymes. 100% gratuit.',
    images: ['/api/og'],
  },
  alternates: { canonical: `${BASE}/quizzes` },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'UrCecret', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Quizzes', item: `${BASE}/quizzes` },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'Tous les quizzes UrCecret',
      description: 'Questionnaires anonymes pour découvrir la vérité sur toi-même, tes relations et ta famille',
      numberOfItems: 15,
      itemListElement: [
        { '@type': 'ListItem', position: 1,  url: `${BASE}/quiz/infidelite`,       name: 'Mon/Ma partenaire me trompe ?' },
        { '@type': 'ListItem', position: 2,  url: `${BASE}/quiz/adopte`,           name: 'Suis-je adopté(e) ?' },
        { '@type': 'ListItem', position: 3,  url: `${BASE}/quiz/amoureux`,         name: 'Suis-je vraiment amoureux/amoureuse ?' },
        { '@type': 'ListItem', position: 4,  url: `${BASE}/quiz/vrais-amis`,       name: 'Sont-ils mes vrais amis ?' },
        { '@type': 'ListItem', position: 5,  url: `${BASE}/quiz/orientation`,      name: 'Quelle est mon orientation ?' },
        { '@type': 'ListItem', position: 6,  url: `${BASE}/quiz/narcissique`,      name: 'Suis-je narcissique ?' },
        { '@type': 'ListItem', position: 7,  url: `${BASE}/quiz/mon-ex`,           name: 'Mon ex veut-il/elle revenir ?' },
        { '@type': 'ListItem', position: 8,  url: `${BASE}/quiz/manipule`,         name: 'Suis-je manipulé(e) ?' },
        { '@type': 'ListItem', position: 9,  url: `${BASE}/quiz/rompre`,           name: 'Dois-je rompre ?' },
        { '@type': 'ListItem', position: 10, url: `${BASE}/quiz/jaloux`,           name: 'Suis-je trop jaloux/jalouse ?' },
        { '@type': 'ListItem', position: 11, url: `${BASE}/quiz/relation-toxique`, name: 'Ma relation est-elle toxique ?' },
        { '@type': 'ListItem', position: 12, url: `${BASE}/quiz/crush`,            name: 'Mon crush ressent-il/elle quelque chose ?' },
        { '@type': 'ListItem', position: 13, url: `${BASE}/quiz/burnout`,          name: 'Suis-je en burnout ?' },
        { '@type': 'ListItem', position: 14, url: `${BASE}/quiz/depression`,       name: 'Ai-je des signes de dépression ?' },
        { '@type': 'ListItem', position: 15, url: `${BASE}/quiz/vrai-amour`,       name: 'Est-ce le vrai amour ?' },
      ],
    },
    {
      '@type': 'WebPage',
      name: 'Tous les quizzes UrCecret',
      url: `${BASE}/quizzes`,
      inLanguage: 'fr',
      isPartOf: { '@id': `${BASE}/#website` },
    },
  ],
};

export default function QuizzesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen flex flex-col" style={{ background: '#faf9f7' }}>

        {/* Subtle animated orbs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.12] bg-violet-300" style={{ animation: 'pulse 7s ease-in-out infinite' }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-stone-200 sticky top-0 backdrop-blur-md" style={{ background: 'rgba(250,249,247,0.9)' }}>
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black">
              <span style={{ background: 'linear-gradient(to right,#a94e18,#d17d52)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Ur
              </span>
              <span className="text-stone-900">Cecret</span>
            </Link>
            <span className="text-xs text-stone-400 uppercase tracking-widest font-semibold">Choisis ton quiz</span>
          </div>
        </header>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-10">
          <div className="w-full max-w-md">

            <div className="text-center mb-10">
              <div className="flex justify-center gap-2 text-3xl mb-4">
                <span>🔍</span><span>✨</span><span>💫</span>
              </div>
              <p className="text-xs text-stone-400 uppercase tracking-[0.2em] font-semibold mb-3">
                30 questions · Résultats instantanés
              </p>
              <h1 className="text-3xl font-black text-stone-900 leading-tight">
                Quelle vérité veux-tu{' '}
                <span style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  découvrir ?
                </span>
              </h1>
            </div>

            {/* Mode Équipe banner */}
            <Link
              href="/duo"
              className="group relative rounded-2xl overflow-hidden mb-4 block transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
              style={{ background: 'white', border: '1px solid rgba(169,78,24,0.2)', boxShadow: '0 2px 12px rgba(169,78,24,0.08)' }}
            >
              <div className="relative p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ background: 'rgba(169,78,24,0.08)', border: '1px solid rgba(169,78,24,0.15)' }}>
                  🧩
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-stone-900 font-black text-base">Mode Équipe</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(209,125,82,0.1)', color: '#d17d52', border: '1px solid rgba(209,125,82,0.2)' }}>
                      Nouveau
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Rejoint avec un code · Chacun répond seul · Comparez vos secrets
                  </p>
                </div>
                <svg className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: '#a94e18' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Personnalité 16 types banner */}
            <Link
              href="/quiz/personnalite"
              className="group relative rounded-2xl overflow-hidden mb-6 block transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
              style={{ background: 'white', border: '1px solid rgba(169,78,24,0.2)', boxShadow: '0 2px 12px rgba(169,78,24,0.08)' }}
            >
              <div className="relative p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ background: 'rgba(169,78,24,0.08)', border: '1px solid rgba(169,78,24,0.15)' }}>
                  🧠
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-stone-900 font-black text-base">Test de Personnalité 16 Types</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(169,78,24,0.1)', color: '#a94e18', border: '1px solid rgba(169,78,24,0.2)' }}>
                      Gratuit
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    70 questions · INFJ, ENFP, INTJ et 13 autres · Résultat instantané
                  </p>
                </div>
                <svg className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: '#a94e18' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <QuizListSection />

            <p className="text-center text-stone-400 text-xs mt-10 tracking-wide">
              🔒 100% anonyme · Zéro compte requis
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
