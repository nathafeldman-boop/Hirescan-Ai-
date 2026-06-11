import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getQuizBySlug } from '@/lib/quizzes';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`results:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

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
