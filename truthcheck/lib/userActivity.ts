// ── Fiche d'activité utilisateur (/natha-admin/user/[id]) ───────────────────
// Transforme les lignes brutes de PageView (maintenant liées à userId — voir
// prisma/schema.prisma) en une histoire lisible : quelle page, quel événement
// caché derrière un chemin synthétique (/__quiz/…, /__evt/…), quelle session.
// Rien de nouveau n'est collecté ici — tout vient de ce que /api/track et
// lib/analytics.ts écrivent déjà à chaque navigation.

const PAGE_LABELS: Record<string, string> = {
  '/': 'Page d\'accueil',
  '/decouverte': 'Hub de découverte',
  '/quiz/personnalite': 'Test de personnalité MBTI',
  '/quizzes': 'Liste des quiz',
  '/chat': 'Nova (coach IA)',
  '/journal': 'Journal émotionnel',
  '/dashboard': 'Mon profil',
  '/compat': 'Compatibilité amoureuse',
  '/profil-avance': 'Profil avancé',
  '/profil-avance/rapport': 'Rapport de personnalité (PDF)',
  '/pricing': 'Page tarifs',
  '/login': 'Page de connexion',
  '/success': 'Confirmation de paiement',
  '/types': 'Liste des 16 types MBTI',
  '/tests': 'Guides relationnels',
};

export interface VisitEvent {
  at: Date;
  kind: 'page' | 'quiz-progress' | 'quiz-drop' | 'event' | 'diag';
  label: string;
}

// Un seul chemin brut → un événement lisible, jamais l'inverse (pas de contenu
// exposé — juste "quoi" et "quand", jamais le détail d'un message Nova, etc.)
export function describeVisit(path: string, at: Date): VisitEvent {
  const dropMatch = path.match(/^\/__quiz\/drop\/q(\d+)$/);
  if (dropMatch) {
    return { at, kind: 'quiz-drop', label: `A quitté le test à la question ${dropMatch[1]}` };
  }
  const milestoneMatch = path.match(/^\/__quiz\/q(\d+)$/);
  if (milestoneMatch) {
    return { at, kind: 'quiz-progress', label: `A atteint ${milestoneMatch[1]}% du test` };
  }
  const evtMatch = path.match(/^\/__evt\/([a-z_]+)(?:\/(.+))?$/);
  if (evtMatch) {
    const [, event, quiz] = evtMatch;
    const EVT_LABELS: Record<string, string> = {
      quiz_start: 'A démarré un test',
      quiz_complete: 'A terminé un test',
      paywall_view: 'A vu le paywall',
      checkout_click: 'A cliqué pour payer',
      payment_success: 'A payé',
      affiliate_click: 'Venu via un lien affilié',
    };
    const base = EVT_LABELS[event] ?? event;
    return { at, kind: 'event', label: quiz ? `${base} (${quiz})` : base };
  }
  if (path.startsWith('/__diag/') || path.startsWith('/__aff/')) {
    return { at, kind: 'diag', label: path };
  }
  const typeMatch = path.match(/^\/types\/([a-z]{4})$/i);
  if (typeMatch) return { at, kind: 'page', label: `A consulté le type ${typeMatch[1].toUpperCase()}` };
  const quizSlugMatch = path.match(/^\/quiz\/([a-z-]+)$/);
  if (quizSlugMatch && quizSlugMatch[1] !== 'personnalite') {
    return { at, kind: 'page', label: `A ouvert le quiz "${quizSlugMatch[1]}"` };
  }
  return { at, kind: 'page', label: PAGE_LABELS[path] ?? `A visité ${path}` };
}

// Les 9 jalons du registre fermé (lib/trackEvent.ts) → une phrase lisible.
// Jamais le contenu (ex. le texte échangé avec Nova) — juste l'action et le
// moment, exactement ce qui a été demandé ("pas quelle question, c'est trop indiscret").
const APP_EVENT_LABELS: Record<string, string> = {
  signed_in: 'S\'est connecté(e)',
  nova_message_sent: 'A envoyé un message à Nova',
  journal_entry_saved: 'A rempli son Journal du jour',
  journal_started: 'A commencé son Journal (1ère fois)',
  conversation_analyzed: 'A fait analyser une conversation',
  test_completed: 'A terminé le test de personnalité',
  compat_created: 'A lancé une analyse de compatibilité',
  profil_avance_generated: 'A généré son profil avancé',
  quiz_created: 'A créé un quiz personnalisé',
};

export function describeAppEvent(event: string, at: Date, properties?: unknown): VisitEvent {
  let label = APP_EVENT_LABELS[event] ?? event;
  if (event === 'test_completed' && properties && typeof properties === 'object' && 'mbtiType' in properties) {
    label += ` (${(properties as { mbtiType?: string }).mbtiType})`;
  }
  return { at, kind: 'event', label };
}

export interface Session {
  start: Date;
  end: Date;
  durationMin: number;
  events: VisitEvent[];
}

// Regroupe des événements horodatés en "sessions" — un nouveau groupe démarre
// dès qu'il y a plus de `gapMinutes` de silence entre deux actions. Pas de
// notion de session propre côté serveur (pas de heartbeat) : c'est
// l'approximation la plus honnête qu'on puisse tirer de timestamps discrets.
export function groupSessions(events: VisitEvent[], gapMinutes = 30): Session[] {
  const sorted = [...events].sort((a, b) => a.at.getTime() - b.at.getTime());
  const sessions: Session[] = [];
  const gapMs = gapMinutes * 60_000;

  for (const ev of sorted) {
    const last = sessions[sessions.length - 1];
    if (last && ev.at.getTime() - last.end.getTime() <= gapMs) {
      last.end = ev.at;
      last.events.push(ev);
    } else {
      sessions.push({ start: ev.at, end: ev.at, durationMin: 0, events: [ev] });
    }
  }
  for (const s of sessions) {
    s.durationMin = Math.max(1, Math.round((s.end.getTime() - s.start.getTime()) / 60_000));
  }
  return sessions.reverse(); // plus récentes d'abord
}
