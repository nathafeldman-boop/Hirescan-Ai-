'use client';

import Link from 'next/link';
import ElioAvatar from '@/components/ElioAvatar';

export default function QueteClient({ firstName, hasJournalEntry, hasCompat }: {
  firstName: string | null;
  hasJournalEntry: boolean;
  hasCompat: boolean;
}) {
  return (
    <main className="min-h-screen px-5 py-8" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <div className="max-w-sm mx-auto">
        <Link href="/decouverte" className="text-xs inline-flex items-center gap-1.5 mb-6" style={{ color: '#a8a29e' }}>
          <span>←</span> Retour au hub
        </Link>

        <div className="flex flex-col items-center text-center mb-8">
          <ElioAvatar size={56} glow />
          <p className="ur-label text-[10px] mt-4 mb-2" style={{ color: 'var(--gold)' }}>Ta quête</p>
          <h1 className="font-display text-2xl font-black mb-2">Apprends à mieux te connaître</h1>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: '#78716c' }}>
            {firstName ? `${firstName}, ton` : 'Ton'} profil n&apos;est pas encore complet — une exploration suffit pour changer ça.
          </p>
        </div>

        {/* Quête principale — le test, seule action qui complète vraiment le profil. */}
        <Link
          href="/quiz/personnalite"
          className="quete-card group relative block rounded-[24px] p-5 mb-4 overflow-hidden"
          style={{ background: 'var(--ink)', border: '1px solid var(--gold-line)' }}
        >
          <style>{`
            .quete-card { transition: transform .25s cubic-bezier(.22,1,.36,1); }
            .quete-card:hover, .quete-card:active { transform: translateY(-2px) scale(1.01); }
          `}</style>
          <p className="ur-label text-[10px] mb-2" style={{ color: 'var(--gold)' }}>Quête principale</p>
          <h2 className="font-display text-lg font-bold mb-1.5" style={{ color: '#FAF6EC' }}>Ton test de personnalité</h2>
          <p className="text-[13px] mb-4" style={{ color: 'rgba(250,246,236,0.65)', lineHeight: 1.5 }}>
            3 minutes, 24 questions. C&apos;est ce qui permet à Elio de te parler vraiment à toi, pas en généralités.
          </p>
          <span className="ur-btn-gold inline-flex px-6 py-3 text-sm">Faire le test →</span>
        </Link>

        <p className="ur-label text-[10px] mt-8 mb-3" style={{ color: '#a8a29e' }}>En attendant, tu peux aussi</p>

        <div className="flex flex-col gap-2.5">
          {!hasJournalEntry && (
            <Link href="/journal" className="quete-card flex items-center gap-3.5 rounded-2xl px-4 py-3.5" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
              <span className="text-xl flex-shrink-0">📅</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">Noter comment tu te sens aujourd&apos;hui</p>
                <p className="text-[12px]" style={{ color: '#8a7d5c' }}>Journal émotionnel</p>
              </div>
            </Link>
          )}
          {!hasCompat && (
            <Link href="/compat" className="quete-card flex items-center gap-3.5 rounded-2xl px-4 py-3.5" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
              <span className="text-xl flex-shrink-0">💬</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">Analyser une relation</p>
                <p className="text-[12px]" style={{ color: '#8a7d5c' }}>Compatibilité</p>
              </div>
            </Link>
          )}
          <Link href="/quizzes" className="quete-card flex items-center gap-3.5 rounded-2xl px-4 py-3.5" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
            <span className="text-xl flex-shrink-0">🎯</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">Un quiz rapide sur toi</p>
              <p className="text-[12px]" style={{ color: '#8a7d5c' }}>Découvertes</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
