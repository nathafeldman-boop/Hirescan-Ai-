export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { describeVisit, describeAppEvent, describeOrigin, groupSessions, type VisitEvent } from '@/lib/userActivity';

export const metadata: Metadata = {
  title: 'Fiche utilisateur',
  robots: { index: false, follow: false },
};

const TZ = 'Europe/Paris';

const C = {
  bg: '#f5f5f7', surface: '#ffffff', border: '#d2d2d7', borderSoft: '#e8e8ed',
  text: '#1d1d1f', muted: '#6e6e73', faint: '#98989d',
  primary: '#0071e3', good: '#1a9e46', warn: '#c26a00', critical: '#d70015', violet: '#af52de',
};
const block = (bg: string, border: string): React.CSSProperties => ({ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '18px 20px' });
const label: React.CSSProperties = { color: C.muted, fontSize: 13, fontWeight: 500, margin: 0 };
const bigNum: React.CSSProperties = { color: C.text, fontSize: 27, fontWeight: 700, margin: '8px 0 0', lineHeight: 1.1, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' };
const sub: React.CSSProperties = { color: C.muted, fontSize: 12.5, margin: '4px 0 0' };
const sectionHeading: React.CSSProperties = { color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 12, marginTop: 0 };

function fmtDate(d: Date) {
  return d.toLocaleDateString('fr-FR', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtTime(d: Date) {
  return d.toLocaleTimeString('fr-FR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
}
function fmtDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

export default async function UserActivityPage({ params }: { params: { id: string } }) {
  const uid = params.id;

  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { id: true, name: true, email: true, tier: true, mbtiType: true, mbtiTestCount: true, createdAt: true, lastActiveAt: true },
  });

  if (!user) {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', padding: 40, fontFamily: 'var(--font-sans), sans-serif' }}>
        <p style={{ color: C.text }}>Compte introuvable.</p>
        <Link href="/natha-admin" style={{ color: C.primary }}>← Retour au tableau de bord</Link>
      </div>
    );
  }

  const [pageViews, appEvents, journalEntries, quizResults, compatChecks, customQuizzes, convAnalyses, mbtiHistory, advancedAnalysis, chatUsageRows] = await Promise.all([
    prisma.pageView.findMany({ where: { userId: uid }, select: { path: true, createdAt: true, source: true }, orderBy: { createdAt: 'asc' } }),
    prisma.appEvent.findMany({ where: { userId: uid }, select: { event: true, createdAt: true, properties: true }, orderBy: { createdAt: 'asc' } }),
    prisma.journalEntry.findMany({ where: { userId: uid }, select: { day: true }, orderBy: { day: 'desc' } }),
    prisma.quizResult.findMany({ where: { userId: uid }, select: { quizSlug: true, score: true, paid: true, createdAt: true }, orderBy: { createdAt: 'desc' } }),
    prisma.compatibilityCheck.count({ where: { userId: uid } }).catch(() => 0),
    prisma.customQuiz.count({ where: { creatorId: uid } }).catch(() => 0),
    prisma.conversationAnalysis.count({ where: { userId: uid } }).catch(() => 0),
    prisma.mbtiTestHistory.findMany({ where: { userId: uid }, select: { type: true, createdAt: true }, orderBy: { createdAt: 'desc' } }),
    prisma.advancedAnalysis.findUnique({ where: { userId: uid }, select: { updatedAt: true } }),
    prisma.chatUsage.findMany({ where: { userId: uid }, select: { day: true, count: true }, orderBy: { day: 'desc' } }),
  ]);

  // ── Timeline unifiée — pages/quiz/funnel (PageView, maintenant lié à ce
  // compte) + jalons produit (AppEvent) — jamais le CONTENU d'une action,
  // seulement laquelle et à quel moment.
  const visitEvents: VisitEvent[] = pageViews.map((p) => describeVisit(p.path, p.createdAt));
  const appVisitEvents: VisitEvent[] = appEvents.map((e) => describeAppEvent(e.event, e.createdAt, e.properties));
  const timeline = [...visitEvents, ...appVisitEvents]
    .filter((e) => e.kind !== 'diag')
    .sort((a, b) => b.at.getTime() - a.at.getTime());

  const sessions = groupSessions([...visitEvents, ...appVisitEvents].filter((e) => e.kind !== 'diag'));
  const totalMinutes = sessions.reduce((s, sess) => s + sess.durationMin, 0);

  const novaMessageCount = appEvents.filter((e) => e.event === 'nova_message_sent').length;
  const novaMessagesTotal = Math.max(novaMessageCount, chatUsageRows.reduce((s, r) => s + r.count, 0));

  // ── Origine (affilié vs extérieur) — la toute première visite connue de ce
  // compte, avant même son inscription. Non disponible pour les comptes créés
  // avant que PageView ne sache lier une visite à un utilisateur.
  const firstSourced = pageViews.find((p) => p.source);
  const origin = describeOrigin(firstSourced?.source ?? null);

  // ── Statut du test : terminé (avec le type), abandonné à une question
  // précise (dernier /__quiz/drop/qN connu), ou jamais commencé.
  const lastDrop = visitEvents.filter((e) => e.kind === 'quiz-drop').slice(-1)[0];
  const testStatus = user.mbtiType
    ? { label: `Terminé — type ${user.mbtiType}`, color: C.good }
    : lastDrop
      ? { label: lastDrop.label.replace('A quitté', 'Abandonné'), color: C.warn }
      : appEvents.some((e) => e.event === 'test_completed')
        ? { label: 'Terminé', color: C.good }
        : { label: 'Jamais commencé (ou pas encore de trace)', color: C.faint };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'var(--font-sans), -apple-system, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px 80px' }}>

        <Link href="/natha-admin" style={{ color: C.muted, fontSize: 13, textDecoration: 'none' }}>← Tableau de bord</Link>

        <div style={{ margin: '16px 0 28px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
            {user.name ?? user.email ?? 'Anonyme'}
          </h1>
          <p style={{ color: C.muted, fontSize: 13, margin: '6px 0 0' }}>
            {user.email} · inscrit le {fmtDate(user.createdAt)} ·{' '}
            <span style={{
              padding: '2px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
              background: user.tier !== 'free' ? 'rgba(0,113,227,0.08)' : '#f0f0f2',
              color: user.tier !== 'free' ? C.primary : C.muted,
            }}>
              {user.tier !== 'free' ? user.tier : 'Gratuit'}
            </span>
          </p>
        </div>

        <p style={{ ...sub, marginBottom: 20, fontSize: 12, color: C.faint, maxWidth: 560 }}>
          Tout ce qui suit vient de la navigation réellement enregistrée (aucun contenu de message ou de note n&apos;est jamais lu ici — juste quelle action, où, et quand).
          {' '}Le suivi par compte a démarré avec cette page : les visites antérieures à sa mise en ligne n&apos;apparaissent pas.
        </p>

        {/* ── KPIs ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 28 }}>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Origine</p>
            <p style={{
              ...bigNum, fontSize: 15,
              color: origin.kind === 'affiliate' ? C.violet : origin.kind === 'external' ? C.primary : C.faint,
            }}>
              {origin.label}
            </p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Dernière activité</p>
            <p style={{ ...bigNum, fontSize: 18 }}>{user.lastActiveAt ? fmtDate(user.lastActiveAt) : '—'}</p>
            <p style={sub}>{user.lastActiveAt ? fmtTime(user.lastActiveAt) : 'jamais revenu(e)'}</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Sessions détectées</p>
            <p style={bigNum}>{sessions.length}</p>
            <p style={sub}>≈ {fmtDuration(totalMinutes)} au total</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Test de personnalité</p>
            <p style={{ ...bigNum, fontSize: 15, color: testStatus.color }}>{testStatus.label}</p>
            <p style={sub}>{user.mbtiTestCount} test(s) passé(s)</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Messages à Elio</p>
            <p style={bigNum}>{novaMessagesTotal}</p>
            <p style={sub}>jamais le contenu, juste le nombre</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Entrées de Journal</p>
            <p style={bigNum}>{journalEntries.length}</p>
            <p style={sub}>{journalEntries[0] ? `dernière le ${journalEntries[0].day}` : 'aucune'}</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Quiz complétés</p>
            <p style={bigNum}>{quizResults.length}</p>
            <p style={sub}>{quizResults.filter((q) => q.paid).length} payé(s)</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Compatibilités lancées</p>
            <p style={bigNum}>{compatChecks}</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Conversations analysées</p>
            <p style={bigNum}>{convAnalyses}</p>
          </div>
          <div style={block(C.surface, C.border)}>
            <p style={label}>Quiz créés</p>
            <p style={bigNum}>{customQuizzes}</p>
          </div>
        </div>

        {mbtiHistory.length > 1 && (
          <>
            <p style={sectionHeading}>Évolution du type dans le temps</p>
            <div style={{ ...block(C.surface, C.border), marginBottom: 28 }}>
              {mbtiHistory.map((h, i) => (
                <div key={h.createdAt.toISOString()} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < mbtiHistory.length - 1 ? `1px solid ${C.borderSoft}` : 'none' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{h.type}</span>
                  <span style={{ color: C.muted, fontSize: 12.5 }}>{fmtDate(h.createdAt)} à {fmtTime(h.createdAt)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Sessions ── */}
        <p style={sectionHeading}>Sessions (regroupées, 30 min de silence = nouvelle session)</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 28 }}>
          {sessions.length === 0 && <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Aucune session enregistrée pour l&apos;instant.</p>}
          {sessions.slice(0, 25).map((s, i) => (
            <div key={s.start.toISOString()} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < Math.min(sessions.length, 25) - 1 ? `1px solid ${C.borderSoft}` : 'none', flexWrap: 'wrap' }}>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{fmtDate(s.start)}</span>
              <span style={{ color: C.muted, fontSize: 12.5 }}>{fmtTime(s.start)} → {fmtTime(s.end)}</span>
              <span style={{ color: C.primary, fontSize: 13, fontWeight: 700, minWidth: 56, textAlign: 'right' }}>{fmtDuration(s.durationMin)}</span>
              <span style={{ color: C.faint, fontSize: 11.5, width: 70, textAlign: 'right' }}>{s.events.length} action{s.events.length > 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>

        {/* ── Timeline détaillée ── */}
        <p style={sectionHeading}>Historique complet ({timeline.length} actions)</p>
        <div style={{ ...block(C.surface, C.border), marginBottom: 28, maxHeight: 520, overflowY: 'auto' }}>
          {timeline.length === 0 && <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Rien d&apos;enregistré pour l&apos;instant.</p>}
          {timeline.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '7px 0', borderBottom: i < timeline.length - 1 ? `1px solid ${C.borderSoft}` : 'none' }}>
              <span style={{ color: C.faint, fontSize: 11.5, fontVariantNumeric: 'tabular-nums', width: 118, flexShrink: 0 }}>
                {fmtDate(e.at)} · {fmtTime(e.at)}
              </span>
              <span style={{
                fontSize: 13,
                color: e.kind === 'quiz-drop' ? C.critical : e.kind === 'event' ? C.violet : C.text,
                fontWeight: e.kind === 'event' || e.kind === 'quiz-drop' ? 600 : 400,
              }}>
                {e.label}
              </span>
            </div>
          ))}
        </div>

        {quizResults.length > 0 && (
          <>
            <p style={sectionHeading}>Quiz passés</p>
            <div style={{ ...block(C.surface, C.border), marginBottom: 28 }}>
              {quizResults.map((q, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < quizResults.length - 1 ? `1px solid ${C.borderSoft}` : 'none' }}>
                  <span style={{ fontSize: 13.5 }}>{q.quizSlug} {q.paid && <span style={{ color: C.good, fontWeight: 700 }}>· payé</span>}</span>
                  <span style={{ color: C.muted, fontSize: 12.5 }}>{q.score}% · {fmtDate(q.createdAt)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {advancedAnalysis && (
          <p style={{ color: C.muted, fontSize: 12.5 }}>Profil avancé généré le {fmtDate(advancedAnalysis.updatedAt)}.</p>
        )}
      </div>
    </div>
  );
}
