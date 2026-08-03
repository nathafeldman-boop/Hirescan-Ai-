import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logEvent, EVENTS } from '@/lib/trackEvent';

export const dynamic = 'force-dynamic';

const VALID_REASONS = new Set(['too_complicated', 'not_interested', 'later', 'technical', 'other']);

// Note + raison de départ, capturées via components/ExitIntentSurvey.tsx (voir
// ce fichier pour pourquoi c'est déclenché au bouton retour plutôt qu'à la
// vraie fermeture d'onglet, techniquement impossible à intercepter). Stocké
// dans AppEvent (comme tout le reste des événements produit) — pas de nouveau
// modèle, /natha-admin agrège directement depuis cette table.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = session?.user?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const body = await req.json().catch(() => null) as { step?: string; rating?: number; reason?: string; reasonText?: string } | null;
  if (!body) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  const step = typeof body.step === 'string' ? body.step.slice(0, 40) : 'unknown';
  const rating = typeof body.rating === 'number' && body.rating >= 1 && body.rating <= 5 ? body.rating : null;
  const reason = typeof body.reason === 'string' && VALID_REASONS.has(body.reason) ? body.reason : null;
  const reasonText = reason === 'other' && typeof body.reasonText === 'string' ? body.reasonText.slice(0, 300) : null;

  // Un skip total (ni note ni raison) n'apporte rien à logger.
  if (rating === null && reason === null) return NextResponse.json({ ok: true });

  await logEvent(uid, EVENTS.EXIT_FEEDBACK, { step, rating, reason, reasonText });
  return NextResponse.json({ ok: true });
}
