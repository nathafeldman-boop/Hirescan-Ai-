'use client';

import { useState } from 'react';
import Link from 'next/link';
import ElioAvatar from '@/components/ElioAvatar';
import QuestCelebration, { type QuestCelebrationItem } from '@/components/QuestCelebration';

interface Quest {
  key: string;
  category: 'discovery' | 'habit' | 'premium';
  title: string;
  description: string;
  emoji: string;
  rewardLabel: string;
  requiresPremium: boolean;
  completed: boolean;
  completedAt: string | null;
}

interface GeneratedQuestItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  completed: boolean;
}

const CATEGORY_META: Record<Quest['category'], { title: string; subtitle: string }> = {
  discovery: { title: 'Découverte', subtitle: 'Apprends à connaître UrCecret' },
  habit: { title: 'Habitudes', subtitle: 'Construis un vrai rituel quotidien' },
  premium: { title: 'Premium', subtitle: 'Le parcours complet, jamais fini' },
};

function QuestCard({ q, isPremium }: { q: Quest; isPremium: boolean }) {
  const locked = q.requiresPremium && !isPremium && !q.completed;
  return (
    <div
      className="flex items-start gap-3.5 rounded-2xl px-4 py-3.5"
      style={{
        background: q.completed ? 'var(--gold-soft)' : locked ? 'var(--paper)' : 'var(--paper-panel)',
        border: `1px ${locked ? 'dashed' : 'solid'} ${q.completed ? 'var(--gold-line)' : 'var(--line)'}`,
        opacity: locked ? 0.7 : 1,
      }}
    >
      <span className="text-2xl flex-shrink-0">{q.completed ? '✅' : locked ? '🔒' : q.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{q.title}</p>
        <p className="text-[12px] mt-0.5" style={{ color: '#8a7d5c', lineHeight: 1.4 }}>{q.description}</p>
        <p className="text-[11px] font-semibold mt-1.5" style={{ color: q.completed ? '#1f7a4d' : locked ? '#a8a29e' : 'var(--gold)' }}>
          {q.completed ? 'Terminée' : locked ? 'Réservée aux abonnés' : q.rewardLabel}
        </p>
      </div>
    </div>
  );
}

export default function QuetesClient({
  firstName, isPremium, quests, totalCompleted, generatedQuests, canGenerate,
}: {
  firstName: string | null;
  isPremium: boolean;
  quests: Quest[];
  totalCompleted: number;
  generatedQuests: GeneratedQuestItem[];
  canGenerate: boolean;
}) {
  const [generated, setGenerated] = useState(generatedQuests);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<QuestCelebrationItem[]>([]);

  const level = 1 + Math.floor(totalCompleted / 3);
  const progressInLevel = totalCompleted % 3;

  async function generateMore() {
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch('/api/quests/generate', { method: 'POST' });
      if (res.status === 503) { setGenerateError('Il faut d\'abord un peu plus de matière (objectif, test, ou quelques notes de Journal) pour qu\'Elio personnalise tes prochaines quêtes.'); return; }
      if (!res.ok) { setGenerateError('La génération a échoué, réessaie dans un instant.'); return; }
      const data = await res.json();
      setGenerated((prev) => [...data.quests, ...prev]);
    } catch {
      setGenerateError('Erreur réseau, réessaie.');
    } finally {
      setGenerating(false);
    }
  }

  async function completeGenerated(g: GeneratedQuestItem) {
    setCompleting(g.id);
    try {
      const res = await fetch('/api/quests/complete-generated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: g.id }),
      });
      if (!res.ok) return;
      setGenerated((prev) => prev.map((q) => (q.id === g.id ? { ...q, completed: true } : q)));
      setCelebration([{ key: g.id, title: g.title, emoji: g.emoji, rewardLabel: 'Quête personnalisée terminée' }]);
    } finally {
      setCompleting(null);
    }
  }

  const categories: Quest['category'][] = ['discovery', 'habit', 'premium'];
  const pendingGenerated = generated.filter((g) => !g.completed);
  const doneGenerated = generated.filter((g) => g.completed);

  return (
    <main className="min-h-screen px-5 py-8 pb-28" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <div className="max-w-sm mx-auto">
        <Link href="/decouverte" className="text-xs inline-flex items-center gap-1.5 mb-6" style={{ color: '#a8a29e' }}>
          <span>←</span> Retour au hub
        </Link>

        <div className="flex flex-col items-center text-center mb-6">
          <ElioAvatar size={56} glow />
          <p className="ur-label text-[10px] mt-4 mb-2" style={{ color: 'var(--gold)' }}>Tes quêtes</p>
          <h1 className="font-display text-2xl font-black mb-2">
            {firstName ? `${firstName}, ton parcours` : 'Ton parcours'}
          </h1>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: '#78716c' }}>
            Chaque quête est une étape pour mieux te comprendre — jamais une simple tâche à cocher.
          </p>
        </div>

        {/* Niveau + progression — dérivé du nombre total de quêtes terminées,
            jamais stocké séparément (une seule source de vérité : QuestCompletion). */}
        <div className="rounded-2xl px-5 py-4 mb-7" style={{ background: 'var(--ink)', border: '1px solid var(--gold-line)' }}>
          <div className="flex items-center justify-between mb-2.5">
            <p className="font-display text-lg font-bold" style={{ color: '#FAF6EC' }}>Niveau {level}</p>
            <p className="text-[12px]" style={{ color: 'rgba(250,246,236,0.6)' }}>{totalCompleted} quête{totalCompleted > 1 ? 's' : ''} terminée{totalCompleted > 1 ? 's' : ''}</p>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${(progressInLevel / 3) * 100}%`, background: 'var(--gold)' }} />
          </div>
          <p className="text-[11px] mt-2" style={{ color: 'rgba(250,246,236,0.45)' }}>
            {3 - progressInLevel === 3 ? 'Encore 3 quêtes' : `Encore ${3 - progressInLevel}`} pour le niveau {level + 1}
          </p>
        </div>

        {categories.map((cat) => {
          const inCat = quests.filter((q) => q.category === cat);
          if (inCat.length === 0) return null;
          const meta = CATEGORY_META[cat];
          const doneCount = inCat.filter((q) => q.completed).length;
          return (
            <div key={cat} className="mb-7">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <p className="ur-label text-[10px]" style={{ color: 'var(--gold)' }}>{meta.title}</p>
                  <p className="text-[12px]" style={{ color: '#a8a29e' }}>{meta.subtitle}</p>
                </div>
                <p className="text-[11px] font-semibold" style={{ color: '#a8a29e' }}>{doneCount}/{inCat.length}</p>
              </div>
              <div className="flex flex-col gap-2">
                {inCat.map((q) => <QuestCard key={q.key} q={q} isPremium={isPremium} />)}
              </div>
              {cat === 'premium' && !isPremium && (
                <Link href="/pricing" className="elio-hover-lift block w-full mt-2.5 py-2.5 rounded-full text-center text-xs font-bold" style={{ background: 'var(--gold-soft)', border: '1px dashed var(--gold-line)', color: 'var(--gold)' }}>
                  🔒 Débloquer le parcours Premium →
                </Link>
              )}
            </div>
          );
        })}

        {/* Quêtes générées par Elio — apparaissent une fois le catalogue
            terminé (voir canGenerate). Jamais automatiques : l'utilisateur les
            demande, et les marque lui-même comme faites (aucun signal
            détectable pour "écrire une qualité que tu oublies"). */}
        <div className="mb-4">
          <p className="ur-label text-[10px] mb-1" style={{ color: 'var(--gold)' }}>Quêtes personnalisées</p>
          <p className="text-[12px] mb-3" style={{ color: '#a8a29e' }}>Écrites par Elio, juste pour toi</p>

          {pendingGenerated.length > 0 && (
            <div className="flex flex-col gap-2 mb-3">
              {pendingGenerated.map((g) => (
                <div key={g.id} className="flex items-start gap-3.5 rounded-2xl px-4 py-3.5" style={{ background: 'var(--paper-panel)', border: '1px solid var(--line)' }}>
                  <span className="text-2xl flex-shrink-0">{g.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{g.title}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: '#8a7d5c', lineHeight: 1.4 }}>{g.description}</p>
                    <button
                      onClick={() => completeGenerated(g)}
                      disabled={completing === g.id}
                      className="elio-hover-lift text-[11.5px] font-bold mt-2 px-3 py-1.5 rounded-full disabled:opacity-50"
                      style={{ background: 'var(--gold)', color: 'var(--ink)' }}
                    >
                      {completing === g.id ? 'Un instant…' : 'Je l\'ai fait →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {doneGenerated.length > 0 && (
            <div className="flex flex-col gap-2 mb-3">
              {doneGenerated.map((g) => <QuestCard key={g.id} q={{ key: g.id, category: 'discovery', title: g.title, description: g.description, emoji: g.emoji, rewardLabel: '', requiresPremium: false, completed: true, completedAt: null }} isPremium={isPremium} />)}
            </div>
          )}

          {pendingGenerated.length === 0 && (
            canGenerate ? (
              <button onClick={generateMore} disabled={generating} className="ur-btn-gold w-full py-3 text-sm disabled:opacity-50">
                {generating ? 'Elio y réfléchit…' : '✨ Demander mes prochaines quêtes à Elio'}
              </button>
            ) : (
              <p className="text-[12px] text-center" style={{ color: '#a8a29e' }}>
                Termine les quêtes ci-dessus pour débloquer des quêtes personnalisées.
              </p>
            )
          )}
          {generateError && <p className="text-[11.5px] text-center mt-2" style={{ color: '#dc2626' }}>{generateError}</p>}
        </div>
      </div>

      <QuestCelebration quests={celebration} onClose={() => setCelebration([])} />
    </main>
  );
}
