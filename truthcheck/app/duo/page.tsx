import type { Metadata } from 'next';
import Link from 'next/link';
import { duoQuizzes } from '@/lib/duoQuizzes';
import UrSecretAnimatedBg from '@/components/UrSecretAnimatedBg';

const BASE = 'https://ursecret.site';

export const metadata: Metadata = {
  title: 'Mode Duo — Testez votre couple | UrSecret',
  description: 'Faites le quiz chacun de votre côté et comparez vos réponses. Découvrez ce que vous vous cachez vraiment. Anonyme, gratuit, instantané.',
  keywords: ['quiz couple', 'test compatibilité couple', 'quiz relation', 'quiz partenaire', 'test amour couple', 'UrSecret duo'],
  openGraph: {
    title: 'Mode Duo — Testez votre couple | UrSecret',
    description: 'Chacun répond de son côté. L\'IA compare vos réponses. Découvrez ce que vous vous cachez vraiment.',
    url: `${BASE}/duo`,
    siteName: 'UrSecret',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'UrSecret Mode Duo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mode Duo — Testez votre couple | UrSecret',
    description: 'Chacun répond de son côté. L\'IA compare. Découvrez la vérité.',
    images: ['/api/og'],
  },
  alternates: { canonical: `${BASE}/duo` },
};

export default function DuoPage() {
  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col">
      <UrSecretAnimatedBg />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/quizzes" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
          <span className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ur
            </span>
            <span className="text-white">Secret</span>
          </span>
          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">Duo</span>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              <span className="text-pink-400 text-xs font-semibold uppercase tracking-widest">Mode Duo — Nouveau</span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight mb-3">
              Tu penses vraiment
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {' '}le/la connaître ?
              </span>
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Chacun répond seul — sans voir les réponses de l&apos;autre.
              L&apos;IA compare et révèle vos vraies divergences.
              <strong className="text-zinc-200"> Vous serez surpris.</strong>
            </p>
            {/* Viral WhatsApp CTA */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent('🔥 Tu penses me connaître vraiment ?\n\nFais ce quiz et compare tes réponses avec les miennes — sans tricher 👀\n\nhttps://ursecret.site/duo')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all active:scale-[0.98] mb-2"
              style={{ background: '#25D366', boxShadow: '0 4px 16px rgba(37,211,102,0.35)' }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Envoie le défi à ton/ta partenaire 📲
            </a>
            <p className="text-zinc-600 text-xs">ou choisis un quiz ci-dessous pour commencer toi d&apos;abord</p>
          </div>

          {/* How it works */}
          <div className="glass rounded-2xl p-5 mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Comment ça marche</p>
            <div className="space-y-3">
              {[
                { n: '1', icon: '📱', text: 'Tu fais le quiz seul(e) — tes réponses restent cachées' },
                { n: '2', icon: '💬', text: 'Tu envoies le lien sur WhatsApp à ton/ta partenaire' },
                { n: '3', icon: '💥', text: 'Il/Elle répond — les comparaisons s\'affichent. Prépare-toi.' },
              ].map(({ n, icon, text }) => (
                <div key={n} className="flex items-center gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black"
                    style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: 'white' }}
                  >
                    {n}
                  </div>
                  <span className="text-sm text-zinc-300">{icon} {text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz cards */}
          <div className="flex flex-col gap-4">
            {duoQuizzes.map((quiz) => (
              <Link
                key={quiz.slug}
                href={`/duo/${quiz.slug}`}
                className="group relative rounded-2xl border border-white/8 overflow-hidden transition-all duration-300 hover:border-white/20 hover:scale-[1.02] active:scale-[0.99]"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 50%, ${quiz.accentColor}18 0%, transparent 70%)` }}
                />
                <div className="relative p-5 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                    style={{ background: `${quiz.accentColor}20`, border: `1px solid ${quiz.accentColor}30` }}
                  >
                    {quiz.emoji}
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
            🔒 100% anonyme · Vos réponses individuelles restent privées
          </p>
        </div>
      </div>
    </main>
  );
}
