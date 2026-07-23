import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { QuizQuestion } from '@/lib/customQuiz';

export const dynamic = 'force-dynamic';

// Public — n'importe qui (sans compte) peut ouvrir un test partagé. On ne
// renvoie PAS les points des options ni les tranches de résultat : le score
// est calculé côté serveur dans /respond, jamais confié au client.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const quiz = await prisma.customQuiz.findUnique({
    where: { id: params.id },
    select: { id: true, title: true, intro: true, questions: true, disclaimer: true },
  }).catch(() => null);
  if (!quiz) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const questions = (quiz.questions as unknown as QuizQuestion[]).map((q) => ({
    text: q.text,
    options: q.options.map((o) => o.label),
  }));

  return NextResponse.json({
    id: quiz.id,
    title: quiz.title,
    intro: quiz.intro,
    disclaimer: quiz.disclaimer,
    questions,
  });
}
