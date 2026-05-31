import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      quizResults: { orderBy: { createdAt: 'desc' }, take: 5 },
      analyses: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  });

  if (!user) redirect('/login');

  return (
    <DashboardClient
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
        rizzScore: user.rizzScore,
        rizzLevel: user.rizzLevel,
        tier: user.tier,
      }}
      recentQuizzes={user.quizResults}
      recentAnalyses={user.analyses.map((a) => ({
        id: a.id,
        context: a.context,
        rizzScoreAfter: a.rizzScoreAfter,
        createdAt: a.createdAt.toISOString(),
      }))}
    />
  );
}
