'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface OnlineVisitor {
  userId: string | null;
  label: string;
  page: string;
}

interface TodayStats {
  visitsToday: number;
  landingToday: number;
  newToday: number;
  paidToday: number;
  onlineNow: number;
  onlineVisitors: OnlineVisitor[];
  visitsSpark: number[];
  landingSpark: number[];
  signupsSpark: number[];
  paidSpark: number[];
  updatedAt: string;
}

const POLL_MS = 20_000;

const C = {
  surface: '#ffffff',
  border: '#d2d2d7',
  text: '#1d1d1f',
  muted: '#6e6e73',
  faint: '#98989d',
  primary: '#0071e3',
  good: '#1a9e46',
  warn: '#c26a00',
  violet: '#af52de',
};

function euros(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 100, h = 28;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => {
    const x = values.length > 1 ? (i / (values.length - 1)) * w : w / 2;
    const y = h - (v / max) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = 'M' + pts.join(' L');
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: 'block', marginTop: 10 }}>
      <path d={area} fill={color} opacity={0.14} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeltaBadge({ today, yesterday }: { today: number; yesterday: number }) {
  if (yesterday === 0) return null;
  const diff = Math.round(((today - yesterday) / yesterday) * 100);
  const positive = diff >= 0;
  return (
    <span style={{ fontSize: 12.5, fontWeight: 700, color: positive ? '#1a9e46' : '#d70015', marginLeft: 8 }}>
      {positive ? '▲' : '▼'} {Math.abs(diff)}%
    </span>
  );
}

const block: React.CSSProperties = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px' };
const label: React.CSSProperties = { color: C.muted, fontSize: 13, fontWeight: 500, margin: 0 };
const bigNum: React.CSSProperties = { color: C.text, fontSize: 27, fontWeight: 700, margin: '8px 0 0', lineHeight: 1.1, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' };
const sub: React.CSSProperties = { color: C.muted, fontSize: 12.5, margin: '4px 0 0' };

// Rafraîchit les 4 cases "Aujourd'hui" du dashboard toutes les 20s, sans
// jamais recharger la page — voir /api/natha-admin/today pour la requête
// (volontairement limitée aux compteurs du jour + 7 derniers jours, jamais
// les grosses requêtes all-time du reste de la page). Se met en pause quand
// l'onglet est masqué (écran éteint, changement d'appli) pour ne pas
// consommer de requêtes/batterie pour rien.
export default function TodayStatsLive({ initial }: { initial: TodayStats }) {
  const [stats, setStats] = useState<TodayStats>(initial);
  const [live, setLive] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch('/api/natha-admin/today', { cache: 'no-store' });
        if (!res.ok) { setLive(false); return; }
        const data: TodayStats = await res.json();
        setStats(data);
        setLive(true);
      } catch {
        setLive(false);
      }
    }

    function start() {
      if (timerRef.current) return;
      poll(); // rafraîchit immédiatement au retour sur l'onglet, pas d'attente de 20s
      timerRef.current = setInterval(poll, POLL_MS);
    }
    function stop() {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }

    if (document.visibilityState === 'visible') start();
    const onVisibility = () => (document.visibilityState === 'visible' ? start() : stop());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const yesterdayOf = (spark: number[]) => spark[spark.length - 2] ?? 0;
  const updatedLabel = new Date(stats.updatedAt).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, marginTop: -6 }}>
        <span
          style={{
            width: 7, height: 7, borderRadius: '50%',
            background: live ? C.good : C.faint,
            animation: live ? 'natha-live-pulse 1.6s ease-in-out infinite' : 'none',
          }}
        />
        <span style={{ color: C.faint, fontSize: 11 }}>
          {live ? `En direct · mis à jour à ${updatedLabel}` : 'Connexion perdue — nouvelle tentative…'}
        </span>
      </div>
      <style>{`
        @keyframes natha-live-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(26,158,70,0.5); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(26,158,70,0); }
        }
      `}</style>

      {/* "En ligne maintenant" — pas juste combien, mais QUI : visiteurs
          distincts (compte si connecté, sinon "Visiteur anonyme") ayant
          chargé une page dans les 5 dernières minutes (voir
          /api/natha-admin/today::getOnlineNow). Sert justement à voir si
          quelqu'un est en train de repartir puis de revenir sur l'appli,
          pas juste le total du jour. */}
      <div style={{ ...block, marginBottom: 10, background: stats.onlineNow > 0 ? 'rgba(26,158,70,0.06)' : C.surface, border: `1px solid ${stats.onlineNow > 0 ? 'rgba(26,158,70,0.25)' : C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
              background: stats.onlineNow > 0 ? C.good : C.faint,
              animation: stats.onlineNow > 0 ? 'natha-live-pulse 1.6s ease-in-out infinite' : 'none',
            }}
          />
          <div>
            <p style={{ ...bigNum, margin: 0, fontSize: 22, color: stats.onlineNow > 0 ? C.good : C.text }}>
              {stats.onlineNow} {stats.onlineNow > 1 ? 'personnes en ligne' : 'personne en ligne'}
            </p>
            <p style={sub}>actives dans les 5 dernières minutes</p>
          </div>
        </div>

        {stats.onlineVisitors.length > 0 && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(26,158,70,0.2)' }}>
            {stats.onlineVisitors.map((v, i) => {
              const row = (
                <>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{v.label}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>{v.page}</span>
                </>
              );
              const rowStyle: React.CSSProperties = {
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                padding: '5px 0',
              };
              return v.userId ? (
                <Link key={i} href={`/natha-admin/user/${v.userId}`} style={{ ...rowStyle, textDecoration: 'none' }}>{row}</Link>
              ) : (
                <div key={i} style={rowStyle}>{row}</div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 8 }}>
        <div style={block}>
          <p style={label}>Personnes venues</p>
          <p style={bigNum}>{stats.visitsToday}<DeltaBadge today={stats.visitsToday} yesterday={yesterdayOf(stats.visitsSpark)} /></p>
          <p style={sub}>ont ouvert le site</p>
          <Sparkline values={stats.visitsSpark} color={C.primary} />
        </div>

        <div style={block}>
          <p style={label}>Sur la page d&apos;accueil</p>
          <p style={bigNum}>{stats.landingToday}<DeltaBadge today={stats.landingToday} yesterday={yesterdayOf(stats.landingSpark)} /></p>
          <p style={sub}>ont vu la landing</p>
          <Sparkline values={stats.landingSpark} color={C.violet} />
        </div>

        <div style={block}>
          <p style={label}>Nouveaux inscrits</p>
          <p style={bigNum}>{stats.newToday}<DeltaBadge today={stats.newToday} yesterday={yesterdayOf(stats.signupsSpark)} /></p>
          <p style={sub}>ont créé un compte</p>
          <Sparkline values={stats.signupsSpark} color={C.warn} />
        </div>

        <div style={block}>
          <p style={label}>Achats payants</p>
          <p style={bigNum}>{stats.paidToday}<DeltaBadge today={stats.paidToday} yesterday={yesterdayOf(stats.paidSpark)} /></p>
          <p style={{ ...sub, color: stats.paidToday > 0 ? C.good : C.muted }}>{stats.paidToday > 0 ? `${euros(stats.paidToday * 199)} encaissés` : 'aucun encore'}</p>
          <Sparkline values={stats.paidSpark} color={C.good} />
        </div>
      </div>
      <p style={{ color: C.faint, fontSize: 11, marginBottom: 28 }}>Courbe = 7 derniers jours</p>
    </>
  );
}
