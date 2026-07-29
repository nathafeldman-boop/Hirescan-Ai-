'use client';

import ElioAvatar from './ElioAvatar';

export interface QuestCelebrationItem {
  key: string;
  title: string;
  emoji: string;
  rewardLabel: string;
}

// Réaction émotionnelle affichée juste après qu'une quête vient d'être
// complétée (voir lib/quests.ts::checkAndRecordQuestCompletions, appelée
// depuis /api/journal et /api/chat) — jamais une simple notification
// discrète : "Bravo, tu viens de faire un pas important", pas "+1 badge".
export default function QuestCelebration({ quests, onClose }: { quests: QuestCelebrationItem[]; onClose: () => void }) {
  if (quests.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(21,18,31,0.55)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-[28px] p-6 text-center"
        style={{ background: 'var(--paper)', border: '1px solid var(--gold-line)', animation: 'questCelebrateIn .4s cubic-bezier(.22,1,.36,1)' }}
      >
        <style>{`@keyframes questCelebrateIn{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>

        <div className="flex justify-center mb-4"><ElioAvatar size={56} glow speaking /></div>
        <p className="ur-label text-[10px] mb-2" style={{ color: 'var(--gold)' }}>Bravo 🎉</p>
        <h2 className="font-display text-lg font-black mb-2" style={{ color: 'var(--ink)' }}>
          Tu viens de faire une étape importante pour mieux comprendre ton fonctionnement.
        </h2>

        <div className="flex flex-col gap-2 my-5">
          {quests.map((q) => (
            <div key={q.key} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-line)' }}>
              <span className="text-2xl flex-shrink-0">{q.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{q.title}</p>
                <p className="text-[11.5px]" style={{ color: 'var(--gold)' }}>{q.rewardLabel}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="ur-btn-gold w-full py-3 text-sm">Continuer →</button>
      </div>
    </div>
  );
}
