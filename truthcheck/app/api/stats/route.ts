import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const QUIZ_SLUGS = ['amoureux', 'vrais-amis'] as const;

export async function GET() {
  try {
    const all = await prisma.quizResult.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const total = all.length;

    const byQuiz = Object.fromEntries(
      QUIZ_SLUGS.map((slug) => {
        const results = all.filter((r) => r.quizSlug === slug);
        const count = results.length;
        const avgScore =
          count > 0
            ? Math.round(results.reduce((s, r) => s + r.score, 0) / count)
            : 0;

        // 5 buckets: 0-19, 20-39, 40-59, 60-79, 80-100
        const distribution = [0, 0, 0, 0, 0];
        for (const r of results) {
          const bucket = Math.min(4, Math.floor(r.score / 20));
          distribution[bucket]++;
        }

        return [slug, { count, avgScore, distribution }];
      })
    );

    // Last 10 results across all quizzes
    const recent = all.slice(0, 10).map((r) => ({
      id: r.id,
      quizSlug: r.quizSlug,
      score: r.score,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({ total, byQuiz, recent });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
