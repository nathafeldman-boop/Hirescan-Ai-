export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { QUEST_CATALOG } from '@/lib/quests';

export const metadata: Metadata = {
  title: 'Quêtes — UrCecret',
  robots: { index: false, follow: false },
};

const C = {
  bg: '#f5f5f7', surface: '#ffffff', border: '#d2d2d7', borderSoft: '#e8e8ed',
  text: '#1d1d1f', muted: '#6e6e73', faint: '#98989d',
  primary: '#0071e3', good: '#1a9e46', warn: '#c26a00',
};
const block = (bg: string, border: string): React.CSSProperties => ({ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '18px 20px' });
const label: React.CSSProperties = { color: C.muted, fontSize: 13, fontWeight: 500, margin: 0 };
const bigNum: React.CSSProperties = { color: C.text, fontSize: 27, fontWeight: 700, margin: '8px 0 0', lineHeight: 1.1, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' };
const sub: React.CSSProperties = { color: C.muted, fontSize: 12.5, margin: '4px 0 0' };
const sectionHeading: React.CSSProperties = { color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 12, marginTop: 0 };

function pct(a: number, b: number) {
  if (b === 0) return '—';
  return ((a / b) * 100).toFixed(1) + '%';
}

const QUEST_TITLE: Record<string, string> = Object.fromEntries(QUEST_CATALOG.map((q) => [q.key, q.title]));
const CATEGORY_LABEL: Record<string, string> = { discovery: 'Découverte', habit: 'Habitude', premium: 'Premium' };

export default async function AdminQuetesPage() {
  const [totalUsers, premiumUsers, allCompletions, generatedCompletedCount, byQuestKey, firstCompletionPerUser, paywallViewerIds, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: { in: ['starter', 'plus', 'premium'] } } }),
    prisma.questCompletion.count(),
    prisma.generatedQuest.count({ where: { completedAt: { not: null } } }),
    prisma.questCompletion.groupBy({ by: ['questKey'], _count: { questKey: true } }),
    // Une ligne par utilisateur : sa toute PREMIÈRE quête complétée (pour le
    // "temps moyen avant la première quête" et la conversion Premium par quête).
    prisma.questCompletion.findMany({ orderBy: { completedAt: 'asc' }, select: { userId: true, questKey: true, completedAt: true } }),
    prisma.pageView.findMany({ where: { path: { startsWith: '/__evt/paywall_view' }, userId: { not: null } }, select: { userId: true }, distinct: ['userId'] }),
    prisma.user.findMany({
      where: { questCompletions: { some: {} } },
      select: {
        id: true, name: true, email: true, tier: true, createdAt: true,
        questCompletions: { orderBy: { completedAt: 'desc' }, select: { questKey: true, completedAt: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ]);

  const usersWithAtLeastOne = new Set(firstCompletionPerUser.map((c) => c.userId)).size;
  const avgPerUser = usersWithAtLeastOne > 0 ? (allCompletions / usersWithAtLeastOne) : 0;

  const byKeySorted = [...byQuestKey].sort((a, b) => b._count.questKey - a._count.questKey);
  const mostCompleted = byKeySorted.slice(0, 5);
  const leastCompleted = [...byKeySorted].sort((a, b) => a._count.questKey - b._count.questKey).slice(0, 5);

  // Première quête jamais complétée par compte → délai depuis l'inscription.
  const firstByUser = new Map<string, { questKey: string; completedAt: Date }>();
  for (const c of firstCompletionPerUser) {
    if (!firstByUser.has(c.userId)) firstByUser.set(c.userId, { questKey: c.questKey, completedAt: c.completedAt });
  }
  const userCreatedAt = new Map(users.map((u) => [u.id, u.createdAt]));
  // Pour les comptes hors des 100 premiers (take:100), on retombe sur une
  // requête ciblée seulement si nécessaire — ici on se contente des 100 pour
  // rester rapide (l'admin reste un espace de lecture, pas un rapport exhaustif).
  const delaysHours: number[] = [];
  for (const [uid, first] of firstByUser) {
    const createdAt = userCreatedAt.get(uid);
    if (createdAt) delaysHours.push((first.completedAt.getTime() - createdAt.getTime()) / 3_600_000);
  }
  const avgDelayHours = delaysHours.length > 0 ? delaysHours.reduce((s, v) => s + v, 0) / delaysHours.length : null;

  // Conversion Premium par quête — parmi les comptes ayant complété CETTE
  // quête, quelle proportion est payante aujourd'hui.
  const userTier = new Map(users.map((u) => [u.id, u.tier]));
  const conversionByQuest = QUEST_CATALOG.map((q) => {
    const completers = firstCompletionPerUser.filter((c) => c.questKey === q.key).map((c) => c.userId);
    const uniqueCompleters = [...new Set(completers)];
    const premiumCount = uniqueCompleters.filter((uid) => userTier.get(uid) && userTier.get(uid) !== 'free').length;
    return { key: q.key, title: q.title, completers: uniqueCompleters.length, premiumCount };
  }).filter((c) => c.completers > 0).sort((a, b) => (b.premiumCount / b.completers) - (a.premiumCount / a.completers));

  // Funnel de découverte — la séquence naturelle des 6 quêtes gratuites.
  const discoveryKeys = QUEST_CATALOG.filter((q) => q.category === 'discovery').map((q) => q.key);
  const discoveryFunnel = discoveryKeys.map((key) => ({
    key, title: QUEST_TITLE[key],
    count: new Set(firstCompletionPerUser.filter((c) => c.questKey === key).map((c) => c.userId)).size,
  }));

  const paywallViewers = paywallViewerIds.length;

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'var(--font-sans), -apple-system, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px 80px' }}>
        <Link href="/natha-admin" style={{ color: C.muted, fontSize: 13, textDecoration: 'none' }}>← Tableau de bord</Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '16px 0 24px', letterSpacing: '-0.01em' }}>Quêtes</h1>

        {/* ── KPIs ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10, marginBottom: 28 }}>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Quêtes terminées (total)</p>
            <p style={bigNum}>{allCompletions + generatedCompletedCount}</p>
            <p style={sub}>dont {generatedCompletedCount} générées par Elio</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Moyenne par utilisateur actif</p>
            <p style={bigNum}>{avgPerUser.toFixed(1)}</p>
            <p style={sub}>{usersWithAtLeastOne} compte(s) avec ≥ 1 quête</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Temps avant la 1ère quête</p>
            <p style={bigNum}>{avgDelayHours === null ? '—' : avgDelayHours < 24 ? `${avgDelayHours.toFixed(1)}h` : `${(avgDelayHours / 24).toFixed(1)}j`}</p>
            <p style={sub}>depuis l&apos;inscription, en moyenne</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Vu le paywall</p>
            <p style={bigNum}>{paywallViewers}</p>
            <p style={sub}>visiteurs uniques identifiés</p>
          </div>
        </div>

        {/* ── Quêtes les plus / moins complétées ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 28 }}>
          <div>
            <p style={sectionHeading}>Les plus complétées</p>
            <div style={block(C.surface, C.border)}>
              {mostCompleted.map((c, i) => (
                <div key={c.questKey} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < mostCompleted.length - 1 ? `1px solid ${C.borderSoft}` : 'none' }}>
                  <span style={{ fontSize: 13.5 }}>{QUEST_TITLE[c.questKey] ?? c.questKey}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: C.good }}>{c._count.questKey}</span>
                </div>
              ))}
              {mostCompleted.length === 0 && <p style={{ color: C.muted, fontSize: 13 }}>Aucune donnée pour l&apos;instant.</p>}
            </div>
          </div>
          <div>
            <p style={sectionHeading}>Les plus abandonnées (moins complétées)</p>
            <div style={block(C.surface, C.border)}>
              {leastCompleted.map((c, i) => (
                <div key={c.questKey} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < leastCompleted.length - 1 ? `1px solid ${C.borderSoft}` : 'none' }}>
                  <span style={{ fontSize: 13.5 }}>{QUEST_TITLE[c.questKey] ?? c.questKey}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: C.warn }}>{c._count.questKey}</span>
                </div>
              ))}
              {leastCompleted.length === 0 && <p style={{ color: C.muted, fontSize: 13 }}>Aucune donnée pour l&apos;instant.</p>}
            </div>
          </div>
        </div>

        {/* ── Funnel de découverte ── */}
        <p style={sectionHeading}>Funnel de découverte — où les comptes s&apos;arrêtent</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 28 }}>
          {discoveryFunnel.map((step, i) => (
            <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < discoveryFunnel.length - 1 ? `1px solid ${C.borderSoft}` : 'none' }}>
              <span style={{ color: C.faint, fontSize: 12, width: 18 }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 13.5 }}>{step.title}</span>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>{step.count}</span>
              <span style={{ fontSize: 12, color: C.muted, width: 60, textAlign: 'right' }}>{pct(step.count, totalUsers)}</span>
            </div>
          ))}
        </div>

        {/* ── Conversion Premium par quête ── */}
        <p style={sectionHeading}>Conversion Premium selon la quête effectuée</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 28 }}>
          {conversionByQuest.slice(0, 8).map((c, i) => (
            <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < Math.min(conversionByQuest.length, 8) - 1 ? `1px solid ${C.borderSoft}` : 'none' }}>
              <span style={{ flex: 1, fontSize: 13.5 }}>{c.title}</span>
              <span style={{ fontSize: 12, color: C.muted }}>{c.premiumCount}/{c.completers}</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.primary, width: 55, textAlign: 'right' }}>{pct(c.premiumCount, c.completers)}</span>
            </div>
          ))}
          {conversionByQuest.length === 0 && <p style={{ color: C.muted, fontSize: 13 }}>Aucune donnée pour l&apos;instant.</p>}
        </div>
        <p style={{ ...sub, marginTop: -20, marginBottom: 28, fontSize: 11.5, color: C.faint }}>
          Ensemble des utilisateurs premium/free tous paliers confondus — {premiumUsers} compte(s) payant(s) sur {totalUsers} au total.
        </p>

        {/* ── Table utilisateurs ── */}
        <p style={sectionHeading}>Utilisateurs actifs — progression</p>
        <div style={{ ...block(C.surface, C.border), padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.borderSoft}`, textAlign: 'left' }}>
                  <th style={{ padding: '10px 16px', color: C.muted, fontWeight: 600 }}>Utilisateur</th>
                  <th style={{ padding: '10px 16px', color: C.muted, fontWeight: 600 }}>Quêtes</th>
                  <th style={{ padding: '10px 16px', color: C.muted, fontWeight: 600 }}>Dernière quête</th>
                  <th style={{ padding: '10px 16px', color: C.muted, fontWeight: 600 }}>Progression</th>
                  <th style={{ padding: '10px 16px', color: C.muted, fontWeight: 600 }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const total = u.questCompletions.length;
                  const catalogSize = QUEST_CATALOG.filter((q) => !q.requiresPremium || u.tier !== 'free').length;
                  const last = u.questCompletions[0];
                  return (
                    <tr key={u.id} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                      <td style={{ padding: '10px 16px' }}>
                        <Link href={`/natha-admin/user/${u.id}`} style={{ color: C.text, textDecoration: 'none', fontWeight: 600 }}>
                          {u.name ?? u.email ?? 'Anonyme'}
                        </Link>
                      </td>
                      <td style={{ padding: '10px 16px', fontWeight: 700 }}>{total}</td>
                      <td style={{ padding: '10px 16px', color: C.muted }}>
                        {last ? `${QUEST_TITLE[last.questKey] ?? last.questKey}` : '—'}
                      </td>
                      <td style={{ padding: '10px 16px', color: C.muted }}>{pct(total, catalogSize)}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{
                          padding: '2px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                          background: u.tier !== 'free' ? 'rgba(0,113,227,0.08)' : '#f0f0f2',
                          color: u.tier !== 'free' ? C.primary : C.muted,
                        }}>
                          {u.tier !== 'free' ? u.tier : 'Gratuit'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '16px', color: C.muted, textAlign: 'center' }}>Aucun utilisateur avec une quête complétée pour l&apos;instant.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p style={{ ...sub, marginTop: 10, fontSize: 11.5, color: C.faint }}>Limité aux 100 comptes les plus récents ayant au moins une quête complétée.</p>
      </div>
    </div>
  );
}
