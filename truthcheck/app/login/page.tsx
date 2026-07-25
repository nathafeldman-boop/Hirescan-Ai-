'use client';

import { signIn } from 'next-auth/react';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { detectInAppBrowser } from '@/lib/inAppBrowser';

function LoginContent() {
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get('callbackUrl') ?? '/quiz/personnalite';
  const prefillEmail = searchParams.get('email') ?? '';

  const [email, setEmail] = useState(prefillEmail);
  const [loading, setLoading] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState(rawCallbackUrl);

  // "Par email" — deux étapes : saisir l'email → recevoir un code à 6 chiffres → le saisir.
  const [emailStep, setEmailStep] = useState<'enter' | 'otp'>('enter');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // "J'ai un code" state — codes d'accès affiliés (fonctionnalité distincte, inchangée)
  const [mode, setMode] = useState<'email' | 'code'>('email');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [isInApp] = useState(() => detectInAppBrowser());

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  // If returning to quiz, re-attach pending MBTI type from localStorage so quiz state survives login
  useEffect(() => {
    if (!rawCallbackUrl.includes('/quiz/personnalite')) return;
    try {
      const pending = localStorage.getItem('_mbti_pending');
      if (pending && /^[A-Z]{4}$/.test(pending)) {
        setCallbackUrl(`/quiz/personnalite?pending=${pending}`);
      }
    } catch {}
  }, [rawCallbackUrl]);

  async function sendCode() {
    if (!email.trim()) return;
    setLoading(true);
    setOtpError('');
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOtpError(data.error ?? 'Erreur d\'envoi, réessaie.');
        setLoading(false);
        return;
      }
      setEmailStep('otp');
      setResendCooldown(30);
    } catch {
      setOtpError('Erreur réseau, réessaie.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    await sendCode();
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = otp.trim();
    if (!trimmed) return;
    setOtpError('');
    setOtpLoading(true);
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: trimmed, callbackUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOtpError(data.error ?? 'Code invalide.');
        setOtpLoading(false);
        return;
      }
      // Navigation complète (PAS router.push) : la session vient d'être posée
      // via un cookie Set-Cookie sur cette réponse fetch. Certains navigateurs
      // in-app (webview TikTok notamment) ne garantissent ce cookie qu'à la
      // prochaine vraie navigation — un router.push (transition client, sans
      // rechargement) partait parfois AVANT que le cookie soit disponible,
      // la page suivante ne voyait alors aucune session et repartait vers
      // /login → boucle de connexion infinie, sans façon de s'en sortir en
      // in-app browser (pas de bouton "recharger" comme sur un vrai navigateur).
      window.location.href = data.loginUrl;
    } catch {
      setOtpError('Erreur réseau, réessaie.');
      setOtpLoading(false);
    }
  }

  async function handleCode(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    setCodeError('');
    setCodeLoading(true);
    try {
      const res = await fetch('/api/auth/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, callbackUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCodeError(data.error ?? 'Erreur inconnue');
        setCodeLoading(false);
        return;
      }
      // Même raison que dans handleOtp() ci-dessus : navigation complète pour
      // garantir que le cookie de session vient d'être reconnu (in-app
      // browsers), pas un router.push qui boucle sur /login.
      window.location.href = data.loginUrl;
    } catch {
      setCodeError('Erreur réseau, réessaie.');
      setCodeLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f7f3ec' }}>
      <div className="w-full max-w-sm">
        {/* Logo + header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-black mb-1">
            <span className="text-stone-900">Ur</span><span style={{ color: '#c2611f' }}>Cecret</span>
          </h1>
          <p className="text-stone-500 text-sm">Tes résultats t&apos;attendent 🔓</p>
        </div>

        {/* Rappel garanti ici, indépendant du bandeau global (peut avoir été
            fermé plus tôt dans la session sur une autre page) — c'est
            précisément à cette étape que Google échoue dans ces navigateurs. */}
        {isInApp && (
          <div className="rounded-xl px-4 py-3 mb-5 text-left" style={{ background: '#131110' }}>
            <p className="text-[12px] leading-snug" style={{ color: '#FAF6EC' }}>
              📱 Pour te connecter sans souci : appuie sur <strong>⋯</strong> en haut à droite → <strong>&quot;Ouvrir dans le navigateur&quot;</strong>.
            </p>
          </div>
        )}

        <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid #e7e5e0', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          {mode === 'email' && emailStep === 'otp' ? (
            /* Saisie du code de connexion reçu par email */
            <div>
              <div className="text-center mb-5">
                <div className="text-4xl mb-3">📬</div>
                <h2 className="text-stone-900 font-black text-lg mb-1">Ton code est arrivé</h2>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Envoyé à <span style={{ color: '#a94e18' }} className="font-semibold">{email}</span> — valable 10 minutes.
                </p>
              </div>
              <form onSubmit={handleOtp} className="space-y-3">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError(''); }}
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                  className="w-full rounded-xl px-4 py-3.5 text-stone-900 text-2xl placeholder-stone-300 outline-none transition-all tracking-[0.4em] font-mono text-center"
                  style={{ background: '#f5f4f2', border: `2px solid ${otpError ? '#ef4444' : '#e7e5e0'}` }}
                  onFocus={e => { e.currentTarget.style.borderColor = otpError ? '#ef4444' : '#a94e18'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = otpError ? '#ef4444' : '#e7e5e0'; }}
                />
                {otpError && (
                  <p className="text-red-500 text-xs text-center font-medium">{otpError}</p>
                )}
                <button
                  type="submit"
                  disabled={otpLoading || otp.length < 6}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 4px 16px rgba(169,78,24,0.3)' }}
                >
                  {otpLoading ? '⏳ Vérification...' : '🔓 Me connecter →'}
                </button>
              </form>
              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  onClick={() => { setEmailStep('enter'); setOtp(''); setOtpError(''); }}
                  className="text-xs text-stone-400 hover:text-stone-600"
                >
                  ← Changer d&apos;email
                </button>
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={resendCooldown > 0 || loading}
                  className="text-xs font-semibold disabled:opacity-50"
                  style={{ color: '#a94e18' }}
                >
                  {resendCooldown > 0 ? `Renvoyer (${resendCooldown}s)` : 'Renvoyer le code'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Google bloque l'OAuth dans les navigateurs intégrés (TikTok,
                  Instagram...) — inutile de montrer un bouton qui n'aboutira
                  jamais, voir lib/inAppBrowser.ts */}
              {!isInApp ? (
                <>
                  <button
                    onClick={() => signIn('google', { callbackUrl })}
                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm transition-all hover:shadow-md mb-4"
                    style={{ background: 'white', border: '2px solid #e7e5e0', color: '#1c1917', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continuer avec Google
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-stone-200" />
                    <span className="text-stone-400 text-xs">ou</span>
                    <div className="flex-1 h-px bg-stone-200" />
                  </div>
                </>
              ) : null}

              {/* Mode toggle */}
              <div className="flex rounded-xl overflow-hidden mb-4" style={{ border: '2px solid #e7e5e0' }}>
                <button
                  type="button"
                  onClick={() => { setMode('email'); setCodeError(''); }}
                  className="flex-1 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: mode === 'email' ? 'linear-gradient(135deg,#a94e18,#d17d52)' : 'transparent',
                    color: mode === 'email' ? '#fff' : '#78716c',
                  }}
                >
                  ✉️ Par email
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('code'); }}
                  className="flex-1 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: mode === 'code' ? 'linear-gradient(135deg,#a94e18,#d17d52)' : 'transparent',
                    color: mode === 'code' ? '#fff' : '#78716c',
                  }}
                >
                  🎟️ J&apos;ai un code
                </button>
              </div>

              {mode === 'email' ? (
                /* Email → code de connexion à 6 chiffres */
                <form onSubmit={handleEmail} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    required
                    className="w-full rounded-xl px-4 py-3.5 text-stone-900 text-sm placeholder-stone-400 outline-none transition-all"
                    style={{ background: '#f5f4f2', border: '2px solid #e7e5e0' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#a94e18'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#e7e5e0'; }}
                  />
                  {otpError && (
                    <p className="text-red-500 text-xs text-center font-medium">{otpError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 4px 16px rgba(169,78,24,0.3)' }}
                  >
                    {loading ? '⏳ Envoi...' : '✉️ Recevoir mon code de connexion →'}
                  </button>
                </form>
              ) : (
                /* Code d'accès affilié */
                <form onSubmit={handleCode} className="space-y-3">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeError(''); }}
                    placeholder="Ex: ABC12345"
                    maxLength={12}
                    required
                    autoFocus
                    className="w-full rounded-xl px-4 py-3.5 text-stone-900 text-sm placeholder-stone-400 outline-none transition-all tracking-widest font-mono text-center uppercase"
                    style={{ background: '#f5f4f2', border: `2px solid ${codeError ? '#ef4444' : '#e7e5e0'}` }}
                    onFocus={e => { e.currentTarget.style.borderColor = codeError ? '#ef4444' : '#a94e18'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = codeError ? '#ef4444' : '#e7e5e0'; }}
                  />
                  {codeError && (
                    <p className="text-red-500 text-xs text-center font-medium">{codeError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={codeLoading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#a94e18,#d17d52)', boxShadow: '0 4px 16px rgba(169,78,24,0.3)' }}
                  >
                    {codeLoading ? '⏳ Vérification...' : '🎟️ Accéder avec mon code →'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <p className="text-center text-stone-400 text-xs mt-4">
          En continuant, tu acceptes nos conditions d&apos;utilisation.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
