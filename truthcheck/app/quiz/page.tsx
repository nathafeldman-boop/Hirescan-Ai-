import Link from 'next/link';
import { quizzes } from '@/lib/quizzes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tous les Quiz — UrCecret',
  description: 'Infidélité, amour, amis, burn-out… 18 quiz vérité anonymes pour voir les choses telles qu\'elles sont.',
};

export default function QuizIndexPage() {
  const featured = { slug: 'personnalite', title: 'Test MBTI — Quel est ton type de personnalité ?', emoji: '🧠', subtitle: '24 questions · 16 profils psychologiques' };

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fff', fontFamily: 'system-ui, sans-serif', padding: '40px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Back */}
        <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: 32 }}>
          ← Accueil
        </Link>

        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 8 }}>
          Tous les quiz
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 48, fontSize: 16 }}>
          {quizzes.length + 1} quiz anonymes — résultats instantanés, sans inscription
        </p>

        {/* MBTI featured */}
        <Link href={`/quiz/${featured.slug}`} style={{ textDecoration: 'none', color: '#fff', display: 'block', marginBottom: 48 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))',
            border: '1px solid rgba(139,92,246,0.4)',
            borderRadius: 16, padding: '28px 32px',
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{ fontSize: 48 }}>{featured.emoji}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#a78bfa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Test vedette</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{featured.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{featured.subtitle}</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 22, color: 'rgba(255,255,255,0.3)' }}>→</div>
          </div>
        </Link>

        {/* All quizzes grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {quizzes.map((quiz) => (
            <Link key={quiz.slug} href={`/quiz/${quiz.slug}`} style={{ textDecoration: 'none', color: '#fff', display: 'block' }}>
              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 14, padding: '20px', height: '100%',
                transition: 'background 0.15s',
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{quiz.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.4, marginBottom: 6 }}>{quiz.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{quiz.subtitle}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
