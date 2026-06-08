'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const GROUPS = [
  {
    name: 'Analystes',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.3)',
    role: 'Intuitifs / Penseurs',
    types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    labels: {
      INTJ: 'Architecte',
      INTP: 'Logicien',
      ENTJ: 'Commandant',
      ENTP: 'Innovateur',
    },
  },
  {
    name: 'Diplomates',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.3)',
    role: 'Intuitifs / Sensibles',
    types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    labels: {
      INFJ: 'Avocat',
      INFP: 'Médiateur',
      ENFJ: 'Protagoniste',
      ENFP: 'Ambassadeur',
    },
  },
  {
    name: 'Sentinelles',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.3)',
    role: 'Observateurs / Penseurs',
    types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    labels: {
      ISTJ: 'Logisticien',
      ISFJ: 'Défenseur',
      ESTJ: 'Dirigeant',
      ESFJ: 'Consul',
    },
  },
  {
    name: 'Explorateurs',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)',
    role: 'Observateurs / Prospecteurs',
    types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
    labels: {
      ISTP: 'Virtuose',
      ISFP: 'Aventurier',
      ESTP: 'Entrepreneur',
      ESFP: 'Animateur',
    },
  },
];

const STEPS = [
  {
    n: '1',
    title: 'Réponds aux questions',
    desc: "24 questions pour cerner ta façon de penser, de décider et d'interagir avec le monde.",
  },
  {
    n: '2',
    title: 'Découvre ton type',
    desc: 'Reçois ton type MBTI parmi 16 profils détaillés, avec tes forces, faiblesses et compatibilités.',
  },
  {
    n: '3',
    title: 'Explore ta personnalité',
    desc: 'Plonge dans les descriptions approfondies : carrière, relations, croissance personnelle.',
  },
];

export default function HomeClient() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60,
      }}>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' }}>UrCecret</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/quiz/personnalite" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, padding: '6px 12px' }}>Quiz</Link>
          <Link href="/duo" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, padding: '6px 12px' }}>Mode duo</Link>
          <Link href="/api/auth/signin" style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', borderRadius: 8, padding: '6px 16px', fontSize: 14, textDecoration: 'none',
          }}>Connexion</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 24px 80px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{
          display: 'inline-block', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)',
          borderRadius: 100, padding: '4px 16px', fontSize: 13, color: '#a78bfa', marginBottom: 32,
        }}>
          Test gratuit · 16 types de personnalité · Résultat instantané
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-2px', marginBottom: 24,
          background: 'linear-gradient(135deg, #fff 40%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Quel est ton type<br />de personnalité ?
        </h1>

        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Découvre ton profil MBTI parmi 16 types psychologiques. Comprends comment tu penses,
          ressens et interagis — en seulement 5 minutes.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/quiz/personnalite')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '14px 32px', fontSize: 16, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 0 32px rgba(139,92,246,0.4)',
            }}
          >
            Faire le test gratuit →
          </button>
          <Link href="/quiz" style={{
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', borderRadius: 12, padding: '14px 32px', fontSize: 16, fontWeight: 600,
            textDecoration: 'none',
          }}>
            Voir tous les quiz
          </Link>
        </div>

        <p style={{ marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
          Déjà plus de 10 000 profils analysés · 100% gratuit · Aucune inscription requise
        </p>
      </section>

      {/* 16 Types Grid */}
      <section style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, marginBottom: 12, letterSpacing: '-1px' }}>
          Les 16 types de personnalité
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 56, fontSize: 16 }}>
          Chaque individu appartient à l'un de ces 16 profils. Lequel es-tu ?
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {GROUPS.map((group) => (
            <div key={group.name} style={{
              background: group.bg, border: `1px solid ${group.border}`,
              borderRadius: 16, padding: 24,
            }}>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: group.color, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {group.name}
                </span>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{group.role}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {group.types.map((type) => (
                  <Link key={type} href={`/types/${type.toLowerCase()}`} style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10, padding: '12px', textDecoration: 'none', color: '#fff',
                    transition: 'background 0.15s',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: group.color }}>{type}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                      {(group.labels as unknown as Record<string, string>)[type]}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, marginBottom: 56, letterSpacing: '-1px' }}>
            Comment ça marche ?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {STEPS.map((step) => (
              <div key={step.n} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontWeight: 800, fontSize: 20,
                }}>
                  {step.n}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz cards */}
      <section style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 700, marginBottom: 12, letterSpacing: '-1px' }}>
          Explore tous nos quiz
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 48, fontSize: 15 }}>
          Teste ta personnalité sous tous les angles
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { href: '/quiz/personnalite', emoji: '🧠', title: 'Test MBTI', desc: 'Ton type de personnalité complet' },
            { href: '/quiz/love-language', emoji: '❤️', title: 'Langage d\'amour', desc: 'Comment tu exprimes l\'affection' },
            { href: '/quiz/attachment-style', emoji: '🔗', title: 'Style d\'attachement', desc: 'Anxieux, évitant ou sécure ?' },
            { href: '/quiz/dark-triad', emoji: '🌑', title: 'Côté sombre', desc: 'Narcissisme, machiavélisme...' },
          ].map((q) => (
            <Link key={q.href} href={q.href} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 14, padding: '24px 20px', textDecoration: 'none', color: '#fff',
              display: 'block',
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{q.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{q.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{q.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '80px 24px', textAlign: 'center',
        background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
        borderTop: '1px solid rgba(139,92,246,0.15)',
      }}>
        <h2 style={{ fontSize: 'clamp(26px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 16 }}>
          Prêt à te découvrir ?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, marginBottom: 36, maxWidth: 420, margin: '0 auto 36px' }}>
          Rejoins les milliers de personnes qui ont déjà découvert leur type de personnalité.
        </p>
        <button
          onClick={() => router.push('/quiz/personnalite')}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
            color: '#fff', border: 'none', borderRadius: 12,
            padding: '16px 40px', fontSize: 17, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 0 48px rgba(139,92,246,0.4)',
          }}
        >
          Commencer le test gratuit →
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '32px 24px', textAlign: 'center',
        color: 'rgba(255,255,255,0.3)', fontSize: 13,
      }}>
        <div style={{ marginBottom: 16, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/quiz/personnalite" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Test MBTI</Link>
          <Link href="/quiz" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Tous les quiz</Link>
          <Link href="/partenaire" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Affiliation</Link>
          <Link href="/api/auth/signin" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Connexion</Link>
        </div>
        <p>© 2024 UrCecret · Test de personnalité MBTI gratuit en français</p>
      </footer>
    </div>
  );
}
