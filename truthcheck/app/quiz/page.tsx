import Link from 'next/link';
import { quizzes } from '@/lib/quizzes';
import QuizIcon from '@/components/QuizIcon';
import UserMenu from '@/components/UserMenu';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tous les Quiz — UrCecret',
  description: 'Infidélité, amour, burn-out, narcissisme… 19 quiz anonymes pour voir les choses telles qu\'elles sont. Résultats instantanés.',
};

function BrainIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.6A3 3 0 0 1 4.5 9.5a3 3 0 0 1 3.09-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.6A3 3 0 0 0 19.5 9.5a3 3 0 0 0-3.09-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

export default function QuizIndexPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(9,9,11,0.9)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60,
      }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px', color: '#fff', textDecoration: 'none' }}>
          UrCecret
        </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <UserMenu />
        </div>
      </nav>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 52 }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Accueil
          </Link>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-2px', marginBottom: 10, lineHeight: 1 }}>
            Tous les quiz
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>
            {quizzes.length + 1} quiz · résultats immédiats · analyse IA
          </p>
        </div>

        {/* MBTI featured */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            Test vedette
          </p>
          <Link href="/quiz/personnalite" style={{ textDecoration: 'none', color: '#fff', display: 'block' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(194,97,31,0.14) 0%, rgba(194,97,31,0.04) 100%)',
              border: '1px solid rgba(194,97,31,0.28)',
              borderRadius: 20, padding: '28px 32px',
              display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', bottom: -60, right: -60,
                width: 260, height: 260,
                background: 'radial-gradient(circle, rgba(194,97,31,0.12) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
              }} />

              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: 'rgba(194,97,31,0.15)', border: '1px solid rgba(194,97,31,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: '0 0 32px rgba(194,97,31,0.2)',
              }}>
                <div style={{ width: 38, height: 38 }}><BrainIcon color="#d17d52" /></div>
              </div>

              <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#d17d52', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                  Test de personnalité · MBTI
                </div>
                <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, letterSpacing: '-0.5px' }}>
                  Quel est ton type parmi les 16 profils ?
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
                  24 questions · Résultat instantané · INFJ, ENFP, INTJ et 13 autres
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #a94e18, #c2611f)',
                borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700,
                boxShadow: '0 0 28px rgba(194,97,31,0.35)',
                flexShrink: 0, position: 'relative',
              }}>
                Commencer →
              </div>
            </div>
          </Link>
        </div>

        {/* All quizzes grid */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
            Quiz vérité — {quizzes.length} tests
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {quizzes.map((quiz) => (
            <Link key={quiz.slug} href={`/quiz/${quiz.slug}`} style={{ textDecoration: 'none', color: '#fff', display: 'block' }}>
              <div style={{
                background: `linear-gradient(135deg, ${quiz.accentColor}11 0%, ${quiz.accentColor}03 100%)`,
                border: `1px solid ${quiz.accentColor}22`,
                borderRadius: 16, padding: '20px',
                position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.15s',
              }}>
                <div style={{
                  position: 'absolute', top: -30, right: -30,
                  width: 110, height: 110,
                  background: `radial-gradient(circle, ${quiz.accentColor}14 0%, transparent 70%)`,
                  borderRadius: '50%', pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
                  <QuizIcon slug={quiz.slug} size={46} color={quiz.accentColor} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.4, marginBottom: 5 }}>
                      {quiz.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>
                      {quiz.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
