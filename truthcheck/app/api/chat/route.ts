import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { callMistral, dailyLimitFor, parisDay, ChatMessage } from '@/lib/chat';

export const dynamic = 'force-dynamic';

// Assistant UrCecret — la SEULE route qui parle à Mistral.
// Compte obligatoire (pour appliquer les quotas de façon fiable) + quota
// quotidien par abonnement, vérifié côté serveur AVANT chaque appel payant.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; tier?: string } | undefined;
  if (!user?.id) {
    return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as { messages?: ChatMessage[] } | null;
  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  // Garde-fous d'entrée : rôles valides, longueur bornée.
  const clean: ChatMessage[] = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (clean.length === 0 || clean[clean.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const limit = dailyLimitFor(user.tier);
  const day = parisDay();

  // Usage du jour (crée la ligne à 0 si absente).
  const usage = await prisma.chatUsage.upsert({
    where: { userId_day: { userId: user.id, day } },
    create: { userId: user.id, day, count: 0 },
    update: {},
  }).catch(() => null);

  const used = usage?.count ?? 0;
  if (used >= limit) {
    return NextResponse.json(
      { error: 'quota_exceeded', limit, tier: user.tier ?? 'free' },
      { status: 429 },
    );
  }

  const result = await callMistral(clean);

  if (!result.ok) {
    if (result.error === 'not_configured') {
      return NextResponse.json({ error: 'not_configured' }, { status: 503 });
    }
    return NextResponse.json({ error: 'assistant_unavailable' }, { status: 502 });
  }

  // Réponse OK → on décompte 1 message.
  const updated = await prisma.chatUsage.update({
    where: { userId_day: { userId: user.id, day } },
    data: { count: { increment: 1 } },
  }).catch(() => null);

  const remaining = Math.max(0, limit - (updated?.count ?? used + 1));
  return NextResponse.json({ reply: result.reply, remaining, limit });
}
