import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPaidAccess } from '@/lib/plans';
import { dailyLimitFor, parisDay } from '@/lib/chat';
import { generateQuiz } from '@/lib/customQuiz';
import { logEvent, EVENTS } from '@/lib/trackEvent';

export const dynamic = 'force-dynamic';

// Génère un mini-test partageable (Nova, via Mistral) sur un thème demandé
// par l'utilisateur. Réservé aux abonnés payants (starter/plus/premium) — un
// vrai argument de conversion : "avec Nova tu peux créer TES tests à envoyer
// à tes amis". Consomme 1 message du quota Nova déjà en place (même compteur,
// pas de nouveau système de limite à maintenir).
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; tier?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  if (!hasPaidAccess(user.tier)) {
    return NextResponse.json({ error: 'payment_required' }, { status: 402 });
  }

  const body = await req.json().catch(() => null) as { topic?: string } | null;
  const topic = (body?.topic ?? '').trim().slice(0, 200);
  if (!topic) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  // Même quota journalier que le chat Nova — une génération de test = 1 message.
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

  const quiz = await generateQuiz(topic);
  if (!quiz) {
    // On ne décompte pas le quota si la génération a échoué — l'utilisateur
    // n'a rien reçu, ce ne serait pas honnête de lui prendre un message.
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
  }

  const saved = await prisma.customQuiz.create({
    data: {
      creatorId: user.id,
      topic,
      title: quiz.title,
      intro: quiz.intro,
      questions: quiz.questions as object,
      resultBands: quiz.resultBands as object,
      disclaimer: quiz.disclaimer,
    },
  });

  const updated = await prisma.chatUsage.update({
    where: { userId_day: { userId: user.id, day } },
    data: { count: { increment: 1 } },
  }).catch(() => null);
  const remaining = Math.max(0, limit - (updated?.count ?? (usage?.count ?? 0) + 1));

  await logEvent(user.id, EVENTS.QUIZ_CREATED);

  return NextResponse.json({
    ok: true,
    id: saved.id,
    title: quiz.title,
    intro: quiz.intro,
    questionCount: quiz.questions.length,
    remaining,
    limit,
  });
}
