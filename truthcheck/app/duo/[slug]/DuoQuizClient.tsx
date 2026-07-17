'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { DuoQuiz } from '@/lib/duoQuizzes';
import { encodeDuoAnswers, encodeTeamCode } from '@/lib/duoQuizzes';

interface Props {
  quiz: DuoQuiz;
}

type Phase = 'intro' | 'quiz' | 'share';

export default function DuoQuizClient({ quiz }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const question = quiz.questions[currentIndex];
  const progress = (currentIndex / quiz.questions.length) * 100;
  const isLast = currentIndex === quiz.questions.length - 1;

  function handleSelect(i: number) {
    if (transitioning) return;
    setSelected(i);
  }

  function handleNext() {
    if (selected === null || transitioning) return;
    setTransitioning(true);
    const newAnswers = [...answers, selected];

    setTimeout(() => {
      if (isLast) {
        const encoded = encodeDuoAnswers(newAnswers);
        const link = `${window.location.origin}/duo/${quiz.slug}/compare?a=${encoded}`;
        const code = encodeTeamCode(quiz.slug, newAnswers);
        setShareLink(link);
        setTeamCode(code);
        setPhase('share');
        setTransitioning(false);
      } else {
        setAnswers(newAnswers);
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
        setTransitioning(false);
      }
    }, 300);
  }

  function copyLink() {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  function copyCode() {
    navigator.clipboard.writeText(teamCode).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2200);
    });
  }

  function shareNative() {
    if (navigator.share) {
      void navigator.share({
        title: `UrCecret · ${quiz.title}`,
        text: `🔥 Tu penses me connaître vraiment ?\n\nFais ce quiz et compare tes réponses avec les miennes — sans tricher 👀\n\nRéponds ici :`,
        url: shareLink,
      });
    } else {
      copyLink();
    }
  }

  const whatsappMsg = encodeURIComponent(
    `🔥 Tu penses me connaître vraiment ?\n\n"${quiz.title}" — on fait le même quiz chacun de notre côté et on compare.\n\nFais-le sans regarder mes réponses 😏\n\n→ ${shareLink}`
  );

  /* ── INTRO ── */
  if (phase === 'intro') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: 'var(--ink)' }}>
        <div className="w-full max-w-md text-center">
          <div
            className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl"
            style={{ background: `${quiz.accentColor}20`, border: `1.5px solid ${quiz.accentColor}40` }}
          >
            {quiz.emoji}
          </div>
          <div className="ur-badge mb-4" style={{ border: '1px solid var(--line-ink)', background: 'var(--ink-soft)', color: 'var(--ink-text-muted)' }}>
            <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: quiz.accentColor }} />
            <span className="ur-label">Mode Équipe</span>
          </div>
          <h1 className="font-display text-2xl font-black mb-3 leading-tight" style={{ color: 'var(--ink-text)' }}>{quiz.title}</h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--ink-text-muted)' }}>{quiz.description}</p>

          <div className="ur-panel-ink p-4 mb-8 text-left space-y-3">
            {[
              'Tu réponds seul(e) — tes réponses restent cachées',
              'Tu envoies le lien à ton/ta partenaire',
              'Les comparaisons s\'affichent ensemble',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: `${quiz.accentColor}30`, color: quiz.accentColor }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-zinc-300">{step}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase('quiz')}
            className="w-full py-4 rounded-xl font-black text-white text-base transition-all active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${quiz.accentColor}cc, ${quiz.accentColor})`,
              boxShadow: `0 4px 24px ${quiz.accentColor}40`,
            }}
          >
            Je commence mon quiz →
          </button>

          <Link href="/duo" className="block mt-4 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            ← Retour au Mode Équipe
          </Link>
        </div>
      </main>
    );
  }

  /* ── SHARE ── */
  if (phase === 'share') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: 'var(--ink)' }}>
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">🧩</div>
          <h2 className="font-display text-2xl font-black text-white mb-2">Tes réponses sont prêtes !</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Partage le lien <strong className="text-zinc-200">ou le code</strong> à tes coéquipier(s).
            Quand ils auront répondu, comparez vos secrets ensemble.
          </p>

          {/* Code d'entrée — hero element */}
          <div
            className="rounded-2xl p-5 mb-4 border text-center"
            style={{ background: 'var(--gold-soft)', borderColor: 'var(--gold-line)' }}
          >
            <p className="ur-label text-xs mb-3" style={{ color: 'var(--ink-text-muted)' }}>Code d&apos;entrée équipe</p>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span
                className="text-3xl font-black tracking-[0.25em] font-mono"
                style={{ color: 'var(--gold)' }}
              >
                {teamCode}
              </span>
              <button
                onClick={copyCode}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                style={{ borderColor: 'var(--gold-line)', color: codeCopied ? 'var(--gold)' : 'var(--ink-text-muted)', background: 'var(--ink-soft)' }}
              >
                {codeCopied ? '✓ Copié' : 'Copier'}
              </button>
            </div>
            <p className="text-xs text-zinc-600">Ils entrent ce code sur la page Mode Équipe</p>
          </div>

          <div className="space-y-3 mb-6">
            <a
              href={`https://wa.me/?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-white text-base transition-all active:scale-[0.98]"
              style={{ background: '#25D366', boxShadow: '0 4px 24px rgba(37,211,102,0.4)' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              📲 Envoyer sur WhatsApp
            </a>
            <button
              onClick={shareNative}
              className="w-full py-3 rounded-xl font-semibold text-sm text-zinc-200 bg-white/[0.06] hover:bg-white/10 border border-white/10 transition-all"
            >
              📤 Partager le lien direct
            </button>
            <button
              onClick={copyLink}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-zinc-500 hover:text-zinc-300 transition-all"
            >
              {copied ? '✅ Lien copié !' : '📋 Copier le lien'}
            </button>
          </div>

          <Link href="/duo" className="block mt-4 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            ← Retour au Mode Équipe
          </Link>
        </div>
      </main>
    );
  }

  /* ── QUIZ ── */
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--ink)' }}>
      {/* Header */}
      <header
        className="sticky top-0 backdrop-blur-md border-b z-20"
        style={{ background: 'rgba(21,18,31,0.85)', borderColor: 'var(--line-ink)' }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => { setPhase('intro'); setCurrentIndex(0); setAnswers([]); setSelected(null); }}
            className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-zinc-300">{quiz.emoji} {quiz.title}</span>
          </div>
          <span className="text-sm text-zinc-500 tabular-nums">
            {currentIndex + 1}/{quiz.questions.length}
          </span>
        </div>
        <div className="h-1 bg-white/5">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${quiz.accentColor}88, ${quiz.accentColor})`,
            }}
          />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div
          className={`w-full max-w-2xl transition-all duration-300 ${
            transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="ur-panel-ink p-6 sm:p-8 mb-6">
            <div className="ur-label text-xs mb-4" style={{ color: 'var(--gold)' }}>
              Question {currentIndex + 1}
            </div>
            <p className="font-display text-xl sm:text-2xl font-semibold text-white leading-relaxed">{question.text}</p>
          </div>

          <div className="space-y-3 mb-8">
            {question.options.map((option, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="w-full text-left px-5 py-3.5 rounded-2xl border transition-all duration-150 text-sm font-semibold flex items-center gap-3"
                  style={isSelected
                    ? { borderColor: 'var(--gold)', backgroundColor: 'var(--gold-soft)', color: 'var(--gold)' }
                    : { borderColor: 'var(--line-ink)', backgroundColor: 'var(--ink-soft)', color: 'var(--ink-text)' }}
                >
                  <span
                    className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200"
                    style={
                      isSelected
                        ? { borderColor: 'var(--gold)', backgroundColor: 'var(--gold)' }
                        : { borderColor: 'var(--line-ink)' }
                    }
                  >
                    {isSelected && (
                      <svg className="w-3 h-3" style={{ color: 'var(--ink)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={selected === null || transitioning}
            className="w-full py-4 rounded-xl font-bold text-base transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={
              selected !== null
                ? {
                    background: `linear-gradient(135deg, ${quiz.accentColor}cc, ${quiz.accentColor})`,
                    boxShadow: `0 4px 24px ${quiz.accentColor}40`,
                  }
                : { background: 'rgba(255,255,255,0.05)', color: '#71717a' }
            }
          >
            {isLast ? 'Générer mon lien de partage →' : 'Question suivante →'}
          </button>
        </div>
      </div>
    </main>
  );
}
