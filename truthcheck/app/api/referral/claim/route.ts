import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Fenêtre pendant laquelle un compte peut encore être rattaché à son parrain.
// Évite qu'un vieux compte "réclame" un parrainage des mois plus tard.
const CLAIM_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

// ── Rattache le compte connecté à son parrain (cookie urs_invite) ──
// Appelé (silencieusement) après connexion. Idempotent :
//  - sans cookie / déjà parrainé / auto-parrainage → no-op.
//  - succès → referredById posé + le parrain gagne 3 messages bonus (one-off).
// Le bonus permanent (+3/jour) est géré par le webhook Stripe au 1er paiement 2€+.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ ok: false }, { status: 401 });

  const inviterId = req.cookies.get('urs_invite')?.value;
  // Réponse qui efface le cookie une fois traité (succès OU no-op définitif).
  const done = (body: Record<string, unknown>) => {
    const res = NextResponse.json(body);
    if (inviterId) res.cookies.set('urs_invite', '', { maxAge: 0, path: '/' });
    return res;
  };

  if (!inviterId || inviterId === uid) return done({ ok: false });

  const me = await prisma.user.findUnique({
    where: { id: uid },
    select: { referredById: true, createdAt: true },
  }).catch(() => null);
  if (!me || me.referredById) return done({ ok: false });
  if (Date.now() - me.createdAt.getTime() > CLAIM_WINDOW_MS) return done({ ok: false });

  const inviter = await prisma.user.findUnique({ where: { id: inviterId }, select: { id: true } }).catch(() => null);
  if (!inviter) return done({ ok: false });

  await prisma.$transaction([
    prisma.user.update({ where: { id: uid }, data: { referredById: inviterId } }),
    prisma.user.update({ where: { id: inviterId }, data: { chatBonusCredits: { increment: 3 } } }),
  ]).catch(() => {});

  return done({ ok: true });
}
