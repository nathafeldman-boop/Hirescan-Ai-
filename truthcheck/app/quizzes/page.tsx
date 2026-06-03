import type { Metadata } from 'next';
import Link from 'next/link';
import { quizzes } from '@/lib/quizzes';
import { duoQuizzes } from '@/lib/duoQuizzes';
import UrSecretAnimatedBg from '@/components/UrSecretAnimatedBg';
import QuizIcon from '@/components/QuizIcon';

const BASE = 'https://ursecret.vercel.app';

export const metadata: Metadata = {
  title: 'Tous les quizzes — UrSecret',
  description: '15 questionnaires anonymes : infidélité, narcissisme, manipulation, burnout, dépression, amour, amitié et plus. Résultats instantanés, 100% gratuit, zéro compte requis.',
  keywords: ['quiz anonyme', 'questionnaire psychologique', 'test infidélité', 'test amour', 'orientation sexuelle quiz', 'suis-je adopté', 'vrais amis quiz', 'suis-je narcissique', 'suis-je manipulé', 'burnout test', 'UrSecret'],
  openGraph: {
    title: 'Tous les quizzes | UrSecret',
    description: '15 questionnaires anonymes pour découvrir la vérité sur toi-même, ton couple, tes amis et ta famille.',
    url: `${BASE}/quizzes`,
    siteName: 'UrSecret',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'UrSecret — Tous les quizzes' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tous les quizzes | UrSecret',
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
        { '@type': 'ListItem', position: 1, name: 'UrSecret', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Quizzes', item: `${BASE}/quizzes` },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'Tous les quizzes UrSecret',
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
      name: 'Tous les quizzes UrSecret',
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
      <main className="min-h-screen bg-[#09090b] flex flex-col">
        <UrSecretAnimatedBg />

        {/* Header */}
        <header className="relative z-10 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <span className="text-xl font-black">
              <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Ur
              </span>
              <span className="text-white">Secret</span>
            </span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Choisis ton quiz</span>
          </div>
        </header>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-10">
          <div className="w-full max-w-md">

            <div className="text-center mb-10">
              <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-semibold mb-3">
                30 questions · Résultats instantanés
              </p>
              <h1 className="text-3xl font-black text-white leading-tight">
                Quelle vérité veux-tu
                <span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {' '}découvrir ?
                </span>
              </h1>
            </div>

            {/* Mode Duo banner */}
            <Link
              href="/duo"
              className="group relative rounded-2xl overflow-hidden mb-6 block transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.15))', border: '1px solid rgba(139,92,246,0.35)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />
              <div className="relative p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)' }}>
                  👫
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-black text-base">Mode Duo</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(236,72,153,0.25)', color: '#f472b6', border: '1px solid rgba(236,72,153,0.4)' }}>
                      Nouveau
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Chacun répond de son côté · L&apos;IA compare vos réponses · 5 quiz couple
                  </p>
                </div>
                <svg className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: '#a78bfa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)' }} />
            </Link>

            {/* Personnalité 16 types banner */}
            <Link
              href="/quiz/personnalite"
              className="group relative rounded-2xl overflow-hidden mb-6 block transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(167,139,250,0.15))', border: '1px solid rgba(99,102,241,0.35)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
              <div className="relative p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)' }}>
                  🧠
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-black text-base">Test de Personnalité 16 Types</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(99,102,241,0.25)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.4)' }}>
                      Gratuit
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    24 questions · INFJ, ENFP, INTJ et 13 autres · Résultat instantané
                  </p>
                </div>
                <svg className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: '#a78bfa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)' }} />
            </Link>

            <div className="flex flex-col gap-4">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.slug}
                  href={`/quiz/${quiz.slug}`}
                  className="group relative rounded-2xl border border-white/8 overflow-hidden transition-all duration-300 hover:border-white/20 hover:scale-[1.02] active:scale-[0.99]"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 20% 50%, ${quiz.accentColor}18 0%, transparent 70%)` }}
                  />

                  <div className="relative p-5 flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${quiz.accentColor}20`, border: `1px solid ${quiz.accentColor}30` }}
                    >
                      <QuizIcon slug={quiz.slug} size={32} color={quiz.accentColor} className="mx-auto" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-base leading-snug mb-1">{quiz.title}</p>
                      <p className="text-zinc-500 text-xs leading-relaxed">{quiz.subtitle}</p>
                    </div>

                    <svg
                      className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                      style={{ color: quiz.accentColor }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  <div
                    className="h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${quiz.accentColor}60, transparent)` }}
                  />
                </Link>
              ))}
            </div>

            <p className="text-center text-zinc-600 text-xs mt-10 tracking-wide">
              🔒 100% anonyme · Zéro compte requis
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
