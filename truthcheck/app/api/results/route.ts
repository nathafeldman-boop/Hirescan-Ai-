import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getQuizBySlug } from '@/lib/quizzes';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizSlug, score } = body;

    if (!quizSlug || typeof score !== 'number') {
      return NextResponse.json({ error: 'quizSlug et score sont requis' }, { status: 400 });
    }

    if (!getQuizBySlug(quizSlug)) {
      return NextResponse.json({ error: 'Quiz introuvable' }, { status: 404 });
    }

    const result = await prisma.quizResult.create({
      data: {
        quizSlug,
        score: Math.max(0, Math.min(100, Math.round(score))),
      },
    });

    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
