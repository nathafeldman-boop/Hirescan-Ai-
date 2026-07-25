import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPaidAccess } from '@/lib/plans';
import { dailyLimitFor, parisDay } from '@/lib/chat';
import { generateFriendCompat, COMPAT_QUESTIONS, RELATION_TYPES, type RelationType } from '@/lib/friendCompat';

export const dynamic = 'force-dynamic';

// Compatibilité avec un ami/couple/famille — feature sociale, réservée aux
// abonnés payants (même quota Nova que l'analyse de conversation / le
// créateur de test : 1 génération = 1 message du quota du jour).
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; tier?: string; mbtiType?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  if (!hasPaidAccess(user.tier)) {
    return NextResponse.json({ error: 'payment_required' }, { status: 402 });
  }

  const body = await req.json().catch(() => null) as {
    personName?: string;
    relationType?: string;
    answers?: { questionId: string; choiceIndex: number }[];
  } | null;

  const personName = (body?.personName ?? '').trim().slice(0, 60);
  const relationType = body?.relationType as RelationType | undefined;
  if (!personName || !relationType || !RELATION_TYPES.some((r) => r.value === relationType)) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  if (!Array.isArray(body?.answers) || body.answers.length !== COMPAT_QUESTIONS.length) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const answersForPrompt: { question: string; choice: string }[] = [];
  const answersToStore: { questionId: string; choiceLabel: string }[] = [];
  for (const a of body.answers) {
    const q = COMPAT_QUESTIONS.find((qq) => qq.id === a.questionId);
    const choice = q?.options[a.choiceIndex];
    if (!q || choice === undefined) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    answersForPrompt.push({ question: q.text, choice });
    answersToStore.push({ questionId: q.id, choiceLabel: choice });
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { mbtiType: true } });

  const day = parisDay();
  const limit = dailyLimitFor(user.tier);
  const usage = await prisma.chatUsage.upsert({
    where: { userId_day: { userId: user.id, day } },
    create: { userId: user.id, day, count: 0 },
    update: {},
  }).catch(() => null);
  if ((usage?.count ?? 0) >= limit) {
    return NextResponse.json({ error: 'quota_exceeded', limit }, { status: 429 });
  }

  const result = await generateFriendCompat(relationType, personName, dbUser?.mbtiType ?? null, answersForPrompt);
  if (!result) {
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
  }

  const saved = await prisma.compatibilityCheck.create({
    data: {
      userId: user.id,
      personName,
      relationType,
      answers: answersToStore,
      commonPoints: result.commonPoints,
      differences: result.differences,
      strengths: result.strengths,
      watchPoints: result.watchPoints,
      summary: result.summary,
    },
  });

  const updated = await prisma.chatUsage.update({
    where: { userId_day: { userId: user.id, day } },
    data: { count: { increment: 1 } },
  }).catch(() => null);
  const remaining = Math.max(0, limit - (updated?.count ?? (usage?.count ?? 0) + 1));

  return NextResponse.json({ ok: true, id: saved.id, remaining, limit });
}
