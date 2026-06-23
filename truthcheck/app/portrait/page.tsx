'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

/* ════════════════════════════════════════════════════════════════════════════
   UrCecret — Génère ton portrait viral · Concours 1 000 €
   ════════════════════════════════════════════════════════════════════════════ */

interface PortraitData {
  hook: string;
  archetype: string;
  description: string;
  caption: string;
  hashtags: string;
}

const QUIZ_NAMES: Record<string, string> = {
  infidelite: 'Infidélité', amoureux: 'Suis-je amoureux ?', 'vrais-amis': 'Vrais amis',
  orientation: 'Orientation', narcissique: 'Narcissique', 'mon-ex': 'Mon ex',
  manipule: 'Manipulé(e) ?', rompre: 'Dois-je rompre ?', jaloux: 'Jaloux/jalouse ?',
  'relation-toxique': 'Relation toxique', crush: 'Mon crush', burnout: 'Burnout',
  depression: 'Dépression', 'vrai-amour': 'Vrai amour', personnalite: 'Test MBTI',
};

export default function PortraitPage() {
  const [quizSlug, setQuizSlug] = useState('personnalite');
  const [score, setScore]       = useState(75);
  const [typeCode, setTypeCode] = useState('');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQuizSlug(p.get('quiz') ?? 'personnalite');
    setScore(Number(p.get('score') ?? 75));
    setTypeCode(p.get('type') ?? '');
  }, []);

  const [portrait, setPortrait]   = useState<PortraitData | null>(null);
  const [loading, setLoading]     = useState(false);
  const [copied, setCopied]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [step, setStep]           = useState<'idle' | 'generating' | 'done'>('idle');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageUrl = portrait
    ? `/api/portrait-og?quiz=${quizSlug}&type=${encodeURIComponent(typeCode)}&score=${score}&hook=${encodeURIComponent(portrait.hook)}&arch=${encodeURIComponent(portrait.archetype)}${photoDataUrl ? `&photo=${encodeURIComponent(photoDataUrl)}` : ''}`
    : null;

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      ctx.beginPath();
      ctx.arc(100, 100, 100, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 200, 200);
      URL.revokeObjectURL(objectUrl);
      setPhotoDataUrl(canvas.toDataURL('image/jpeg', 0.65));
    };
    img.src = objectUrl;
  }

  async function generate() {
    setLoading(true);
    setStep('generating');
    setError(null);
    try {
      const res = await fetch('/api/generate-portrait', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizSlug, score, typeCode: typeCode || undefined }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json() as PortraitData;
      setPortrait(data);
      setStep('done');
    } catch {
      setStep('idle');
      setError('Erreur lors de la génération — réessaie dans quelques secondes.');
    } finally {
      setLoading(false);
    }
  }

  async function copyCaption() {
    if (!portrait) return;
    const text = `${portrait.caption}\n\n${portrait.hashtags}\n\nurcecret.site`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Impossible de copier — fais-le manuellement.');
    }
  }

  const quizName = QUIZ_NAMES[quizSlug] ?? quizSlug;
  const headline = typeCode && quizSlug === 'personnalite' ? typeCode : `${score}%`;

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 600, margin: '0 auto' }}>
        <Link href={`/quiz/${quizSlug}`} style={{ textDecoration: 'none', color: '#71717a', fontSize: 13 }}>
          ← retour
        </Link>
        <span style={{ fontSize: 14, fontWeight: 700 }}>
          <span style={{ color: '#d17d52' }}>Ur</span>Cecret · Portrait viral
        </span>
        <div />
      </header>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* Hero contest banner */}
        <div style={{
          borderRadius: 24, padding: '28px 24px',
          background: 'linear-gradient(135deg, rgba(251,191,36,0.10), rgba(194,97,31,0.10))',
          border: '1px solid rgba(251,191,36,0.3)',
          marginBottom: 28, textAlign: 'center',
        }}>
          <p style={{ fontSize: 32, margin: '0 0 6px' }}>🏆</p>
          <p style={{ fontSize: 28, fontWeight: 900, color: '#fbbf24', margin: '0 0 6px' }}>1 000 €</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>au portrait le plus viral</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>
            Génère ton portrait · Poste sur TikTok ou Instagram · Le portrait avec le plus de vues remporte 1 000 €
          </p>
        </div>

        {/* Context */}
        <div style={{
          borderRadius: 16, padding: '18px 20px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <p style={{ fontSize: 36, fontWeight: 900, color: '#d17d52', margin: 0, lineHeight: 1 }}>{headline}</p>
            {typeCode && <p style={{ fontSize: 10, color: '#71717a', margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>type mbti</p>}
          </div>
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.08)' }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#d4d4d8', margin: 0 }}>{quizName}</p>
            <p style={{ fontSize: 12, color: '#71717a', margin: '3px 0 0' }}>Score : {score}% · Portrait personnalisé par IA</p>
          </div>
        </div>

        {/* Photo upload */}
        <div style={{
          borderRadius: 16, padding: '16px 18px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 16,
        }}>
          <p style={{ fontSize: 12, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
            📸 Ta photo de profil TikTok (optionnel)
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Preview circle */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                background: photoDataUrl ? 'transparent' : 'rgba(194,97,31,0.12)',
                border: `2px ${photoDataUrl ? 'solid rgba(209,125,82,0.5)' : 'dashed rgba(194,97,31,0.35)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden', position: 'relative',
              }}
            >
              {photoDataUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={photoDataUrl} alt="photo" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '50%' }} />
                : <span style={{ fontSize: 26 }}>🤳</span>
              }
            </div>
            <div style={{ flex: 1 }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'rgba(194,97,31,0.12)', border: '1px solid rgba(194,97,31,0.3)',
                  color: '#d17d52', borderRadius: 10, padding: '8px 16px',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'block',
                  marginBottom: 6,
                }}
              >
                {photoDataUrl ? '✓ Photo ajoutée — changer' : '+ Ajouter ma photo'}
              </button>
              <p style={{ fontSize: 11, color: '#52525b', margin: 0 }}>
                Apparaîtra dans le cercle du portrait · JPG / PNG
              </p>
            </div>
            {photoDataUrl && (
              <button
                onClick={() => { setPhotoDataUrl(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                style={{ background: 'none', border: 'none', color: '#52525b', fontSize: 18, cursor: 'pointer', padding: 4 }}
              >
                ✕
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Error message */}
        {error && (
          <div style={{ borderRadius: 12, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#f87171', margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {/* Generate CTA */}
        {step === 'idle' && (
          <button
            onClick={generate}
            disabled={loading}
            style={{
              width: '100%', padding: '18px 24px', borderRadius: 18, border: 'none',
              background: 'linear-gradient(135deg, #a94e18, #d17d52)',
              color: '#fff', fontSize: 17, fontWeight: 900, cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(194,97,31,0.45)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              marginBottom: 16,
            }}
          >
            ✨ Générer mon portrait viral
          </button>
        )}

        {/* Generating state */}
        {step === 'generating' && (
          <div style={{
            width: '100%', padding: '22px 24px', borderRadius: 18,
            background: 'rgba(194,97,31,0.10)', border: '1px solid rgba(194,97,31,0.25)',
            textAlign: 'center', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                border: '2px solid rgba(209,125,82,0.25)', borderTopColor: '#d17d52',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ fontSize: 14, color: '#d17d52', fontWeight: 600, margin: 0 }}>
                Mistral génère ton portrait…
              </p>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {/* Result */}
        {step === 'done' && portrait && imageUrl && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Card preview */}
            <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Ton portrait UrCecret"
                style={{ width: '100%', display: 'block' }}
              />
              <div style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(0,0,0,0.7)', borderRadius: 8, padding: '4px 10px', backdropFilter: 'blur(6px)',
              }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  9:16 · TikTok / Instagram
                </p>
              </div>
            </div>

            {/* Description */}
            <div style={{ borderRadius: 16, padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 8px', fontStyle: 'italic' }}>
                &ldquo;{portrait.hook}&rdquo;
              </p>
              <p style={{ fontSize: 13, color: '#71717a', margin: 0, lineHeight: 1.6 }}>{portrait.description}</p>
            </div>

            {/* Caption to copy */}
            <div style={{ borderRadius: 16, padding: '16px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontSize: 10, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>
                Légende prête à coller
              </p>
              <p style={{ fontSize: 14, color: '#d4d4d8', margin: '0 0 6px', lineHeight: 1.5 }}>{portrait.caption}</p>
              <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>{portrait.hashtags}</p>
            </div>

            {/* Action buttons */}
            <button
              onClick={copyCaption}
              style={{
                width: '100%', padding: '14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)',
                background: copied ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.04)',
                color: copied ? '#34d399' : '#d4d4d8',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Légende copiée !' : '📋 Copier la légende + hashtags'}
            </button>

            <a
              href={imageUrl}
              download={`portrait-urcecret-${typeCode || quizSlug}.png`}
              style={{
                width: '100%', padding: '14px', borderRadius: 14,
                background: 'linear-gradient(135deg, #a94e18, #d17d52)',
                color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none',
                textAlign: 'center', display: 'block',
                boxShadow: '0 4px 20px rgba(194,97,31,0.35)',
              }}
            >
              ⬇️ Télécharger mon portrait (PNG)
            </a>

            <button
              onClick={() => { setStep('idle'); setPortrait(null); }}
              style={{
                width: '100%', padding: '10px', borderRadius: 12, border: 'none',
                background: 'transparent', color: '#52525b', fontSize: 13, cursor: 'pointer',
              }}
            >
              Regénérer un autre portrait
            </button>
            {!photoDataUrl && (
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%', padding: '10px', borderRadius: 12,
                  background: 'rgba(194,97,31,0.08)', border: '1px solid rgba(194,97,31,0.2)',
                  color: '#d17d52', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                📸 Ajouter ta photo et regénérer
              </button>
            )}
          </div>
        )}

        {/* How it works */}
        <div style={{ marginTop: 32, borderRadius: 20, padding: '24px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 18px' }}>Comment participer au concours</p>
          {[
            ['1', 'Génère ton portrait', 'L\'IA crée une image personnalisée à ton profil'],
            ['2', 'Poste sur TikTok ou Instagram', 'En stories, reels ou post — tous formats acceptés'],
            ['3', 'Tague @urcecret + #urcecret', 'Obligatoire pour valider ta participation'],
            ['4', 'Le plus de vues gagne', 'On annonce le gagnant chaque mois · 1 000 € par tirage'],
          ].map(([num, title, sub]) => (
            <div key={num} style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(194,97,31,0.2)', border: '1px solid rgba(194,97,31,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 900, color: '#d17d52' }}>
                {num}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#d4d4d8', margin: 0 }}>{title}</p>
                <p style={{ fontSize: 12, color: '#71717a', margin: '2px 0 0' }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rules fine print */}
        <p style={{ fontSize: 11, color: '#3f3f46', textAlign: 'center', marginTop: 20, lineHeight: 1.5 }}>
          Concours mensuel · 1 000 € versés par virement · Gagnant sélectionné parmi les portraits les plus vus taggués #urcecret · UrCecret se réserve le droit de modifier les règles · Participation ouverte à tous les utilisateurs ayant un résultat débloqué
        </p>
      </div>
    </main>
  );
}
