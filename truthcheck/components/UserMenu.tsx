'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (status === 'loading') {
    return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="text-xs text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
      >
        Se connecter
      </Link>
    );
  }

  const user = session.user;
  const tier = (user as { tier?: string }).tier ?? 'free';
  const isPremium = tier === 'premium';
  const initials = (user.name?.charAt(0) ?? user.email?.charAt(0) ?? '?').toUpperCase();

  async function openBillingPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing-portal', { method: 'POST' });
      const data = await res.json() as { url?: string };
      if (data.url) window.location.href = data.url;
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white hover:ring-2 hover:ring-violet-500/60 transition-all"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
        aria-label="Menu compte"
      >
        {initials}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-10 w-64 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* User info */}
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-white text-sm font-semibold truncate">{user.name ?? user.email}</p>
              {user.name && <p className="text-zinc-500 text-xs truncate">{user.email}</p>}
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold border ${
                  isPremium
                    ? 'bg-violet-500/15 text-violet-400 border-violet-500/30'
                    : 'bg-white/5 text-zinc-500 border-white/10'
                }`}>
                  {isPremium ? '✦ Premium' : 'Gratuit'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="py-1">
              {isPremium ? (
                <button
                  onClick={openBillingPortal}
                  disabled={portalLoading}
                  className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <span>💳</span>
                  {portalLoading ? 'Chargement…' : 'Gérer mon abonnement'}
                </button>
              ) : (
                <Link
                  href="/quiz/personnalite"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-violet-400 hover:bg-violet-500/10 transition-colors font-semibold"
                >
                  <span>✦</span> Passer à Premium
                </Link>
              )}

              <div className="h-px bg-white/5 mx-4 my-1" />

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full text-left px-4 py-2.5 text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors flex items-center gap-2"
              >
                <span>↩</span> Se déconnecter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
