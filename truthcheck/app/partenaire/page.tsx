'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PartenairePage() {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ slug: string; affiliateLink: string; dashboardUrl: string } | null>(null);
  const [form, setForm] = useState({ name: '', email: '', platform: '', followers: '', content: '' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/partenaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setStep('success');
    } catch {
      alert('Une erreur est survenue, réessaie.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#09090b', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', fontSize: 20, fontWeight: 900 }}>
          <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
          <span style={{ color: '#fff' }}>Cecret</span>
        </Link>
        <span style={{ color: '#52525b', fontSize: 13 }}>Programme affilié</span>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }}>

        {step === 'form' && (
          <>
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'inline-block', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 20, padding: '4px 16px', fontSize: 13, color: '#a78bfa', marginBottom: 16 }}>
                Programme partenaires
              </div>
              <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1 }}>
                Gagne <span style={{ color: '#a78bfa' }}>80%</span> de commission<br />
                sur chaque vente
              </h1>
              <p style={{ color: '#71717a', fontSize: 16, margin: '0 0 12px', lineHeight: 1.6 }}>
                Partage ton lien UrCecret à ton audience. Chaque résultat débloqué te rapporte <strong style={{ color: '#fff' }}>1,59€</strong> automatiquement.
              </p>
              <p style={{ color: '#52525b', fontSize: 13, margin: '0 0 32px', lineHeight: 1.6 }}>
                Commission sur vente uniquement (pas mensuel) · Après 2 mois consécutifs : <strong style={{ color: '#a78bfa' }}>30%</strong>
              </p>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 48 }}>
                {[
                  { v: '80%', l: 'Commission mois 1-2' },
                  { v: '30j', l: 'Durée du cookie' },
                  { v: '0€', l: 'Pour commencer' },
                ].map(({ v, l }) => (
                  <div key={l} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: '20px 16px' }}>
                    <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: '#fff' }}>{v}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#71717a' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: '24px', marginBottom: 40 }}>
              <p style={{ margin: '0 0 20px', fontWeight: 700, fontSize: 15 }}>Comment ça marche</p>
              {[
                { n: '1', t: 'Remplis le formulaire', d: 'On crée ton lien affilié en 30 secondes' },
                { n: '2', t: 'Partage ton lien', d: 'TikTok, Insta, YouTube — n\'importe quel format' },
                { n: '3', t: 'Tu reçois tes €', d: 'Virement mensuel, stats en temps réel' },
              ].map(({ n, t, d }) => (
                <div key={n} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(167,139,250,0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{n}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#fff' }}>{t}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 13, color: '#71717a' }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={submit}>
              <p style={{ margin: '0 0 24px', fontWeight: 700, fontSize: 18 }}>Rejoindre le programme</p>

              <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
                {[
                  { key: 'name', label: 'Ton nom / pseudo *', placeholder: 'Ex : Marie MBTI', type: 'text' },
                  { key: 'email', label: 'Email *', placeholder: 'ton@email.com', type: 'email' },
                  { key: 'platform', label: 'Plateforme principale *', placeholder: 'TikTok, Instagram, YouTube...', type: 'text' },
                  { key: 'followers', label: 'Nombre d\'abonnés', placeholder: 'Ex : 45 000', type: 'text' },
                  { key: 'content', label: 'Type de contenu', placeholder: 'MBTI, astrologie, psychologie, relations...', type: 'text' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 13, color: '#a1a1aa', marginBottom: 6 }}>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      required={['name', 'email', 'platform'].includes(key)}
                      style={{
                        width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff',
                        fontSize: 15, outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '16px', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? '#3f3f46' : 'linear-gradient(135deg,#7c3aed,#ec4899)',
                  color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: 0.3,
                }}
              >
                {loading ? 'Création en cours…' : 'Obtenir mon lien affilié →'}
              </button>

              <p style={{ textAlign: 'center', color: '#52525b', fontSize: 12, marginTop: 12 }}>
                Gratuit · Sans engagement · Ton lien reçu immédiatement par email
              </p>
            </form>
          </>
        )}

        {step === 'success' && result && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>C&apos;est parti !</h1>
            <p style={{ color: '#71717a', marginBottom: 40 }}>
              Ton lien est actif et on t&apos;a envoyé tous les détails par email.
            </p>

            <div style={{ display: 'grid', gap: 16, marginBottom: 40 }}>
              <div style={{ background: '#18181b', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 12, padding: '20px 24px' }}>
                <p style={{ margin: '0 0 6px', color: '#71717a', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Ton lien affilié</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#a78bfa', wordBreak: 'break-all' }}>{result.affiliateLink}</p>
              </div>
              <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, padding: '20px 24px' }}>
                <p style={{ margin: '0 0 6px', color: '#71717a', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Tes stats en temps réel</p>
                <a href={result.dashboardUrl} style={{ color: '#a78bfa', fontSize: 15, textDecoration: 'none' }}>{result.dashboardUrl}</a>
              </div>
            </div>

            <Link href="/" style={{ color: '#52525b', fontSize: 14, textDecoration: 'none' }}>
              ← Retour à l&apos;accueil
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
