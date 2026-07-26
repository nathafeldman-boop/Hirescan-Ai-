// ── Journal d'événements produit ─────────────────────────────────────────────
// Un seul point d'écriture pour AppEvent — jamais bloquant : un événement qui
// échoue à s'écrire ne doit JAMAIS faire échouer la vraie action (envoyer un
// message à Nova, sauver une entrée de journal...). Toujours en fire-and-forget.
//
// Noms d'événements — liste fermée, à étendre ici en premier avant d'appeler
// logEvent ailleurs, pour que /natha-admin/insights sache toujours quoi
// afficher sans deviner des chaînes éparpillées dans le code.
export const EVENTS = {
  SIGNED_IN: 'signed_in',
  NOVA_MESSAGE_SENT: 'nova_message_sent',
  JOURNAL_ENTRY_SAVED: 'journal_entry_saved',
  JOURNAL_STARTED: 'journal_started', // première entrée JAMAIS créée par ce compte
  CONVERSATION_ANALYZED: 'conversation_analyzed',
  TEST_COMPLETED: 'test_completed',
  COMPAT_CREATED: 'compat_created',
  PROFIL_AVANCE_GENERATED: 'profil_avance_generated',
  QUIZ_CREATED: 'quiz_created',
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS];

export async function logEvent(userId: string | null | undefined, event: EventName, properties?: Record<string, unknown>) {
  if (!userId) return;
  try {
    const { prisma } = await import('./db');
    await prisma.appEvent.create({
      data: { userId, event, properties: properties ? JSON.parse(JSON.stringify(properties)) : undefined },
    });
  } catch {
    // Un événement raté ne doit jamais remonter — voir commentaire en tête de fichier.
  }
}
