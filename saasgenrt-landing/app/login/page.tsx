'use client'
import { Suspense, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 11,
  background: 'var(--bg)', border: '1px solid var(--border-strong)',
  color: 'var(--ink)', fontSize: 14.5, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/builder'
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push(next)
    router.refresh()
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback?next=${next}` },
    })
  }

  return (
    <div style={{ minHeight: '100svh', background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginBottom: 28, justifyContent: 'center' }}>
          <img src="/logo.png" alt="SaaSGenrt" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          <span className="font-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>SaaSGenrt</span>
        </Link>

        <div style={{ borderRadius: 22, padding: 32, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 6, letterSpacing: '-0.025em' }}>Content de te revoir</h1>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 24 }}>Reprends là où tu t'étais arrêté.</p>

          <button onClick={handleGoogle}
            style={{ width: '100%', padding: 12, borderRadius: 11, background: 'var(--bg)', border: '1px solid var(--border-strong)', color: 'var(--ink)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 20 }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuer avec Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>ou</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="toi@exemple.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={inputStyle} />
            </div>

            {error && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'oklch(0.575 0.20 32 / 0.1)', border: '1px solid oklch(0.575 0.20 32 / 0.3)', color: 'var(--signal-ink)', fontSize: 13 }}>{error}</div>}

            <button type="submit" disabled={loading}
              style={{ padding: 14, borderRadius: 12, background: 'var(--signal)', color: 'white', fontSize: 14.5, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', border: 'none', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, boxShadow: 'var(--shadow-md)', marginTop: 2 }}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 13.5, color: 'var(--muted)' }}>
            Pas encore de compte ?{' '}
            <Link href={`/signup?next=${next}`} style={{ color: 'var(--signal-ink)', textDecoration: 'none', fontWeight: 700 }}>Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100svh', background: 'var(--bg-2)' }} />}>
      <LoginForm />
    </Suspense>
  )
}
