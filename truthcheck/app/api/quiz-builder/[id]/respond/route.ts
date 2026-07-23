import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { matchResultBand } from '@/lib/customQuiz';
import type { QuizQuestion, ResultBand } from '@/lib/customQuiz';

export const dynamic = 'force-dynamic';

// Public — calcule le résultat côté serveur à partir des réponses (indices
// d'options), jamais depuis un total envoyé par le client (facilement falsifiable).
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const ip = getClientIp(req);
  if (!rateLimit(`quiz-respond:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const quiz = await prisma.customQuiz.findUnique({
    where: { id: params.id },
    select: { id: true, questions: true, resultBands: true, disclaimer: true, creatorId: true },
  }).catch(() => null);
  if (!quiz) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const body = await req.json().catch(() => null) as { answers?: number[] } | null;
  const answers = Array.isArray(body?.answers) ? body.answers : null;
  const questions = quiz.questions as unknown as QuizQuestion[];
  if (!answers || answers.length !== questions.length) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  let total = 0;
  for (let i = 0; i < questions.length; i++) {
    const idx = answers[i];
    const opt = Number.isInteger(idx) ? questions[i].options[idx] : undefined;
    if (!opt) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    total += opt.points;
  }

  const bands = quiz.resultBands as unknown as ResultBand[];
  const band = matchResultBand(bands, total);

  await prisma.$transaction([
    prisma.customQuizResponse.create({ data: { quizId: quiz.id, totalPoints: total } }),
    prisma.customQuiz.update({ where: { id: quiz.id }, data: { responseCount: { increment: 1 } } }),
  ]).catch(() => {});

  return NextResponse.json({
    ok: true,
    title: band.title,
    description: band.description,
    disclaimer: quiz.disclaimer,
    // Lien de parrainage du créateur — même mécanisme que le chat (voir
    // /api/referral/claim) : si le répondant s'inscrit puis paie 2€+, le
    // créateur du test gagne +3 messages Nova/jour à vie.
    creatorInviteId: quiz.creatorId,
  });
}
