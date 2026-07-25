import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { journalAccessFor } from '@/lib/journalAccess';
import JournalClient from './JournalClient';

export default async function JournalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, tier: true, createdAt: true },
  });

  if (!user) redirect('/login');

  const access = journalAccessFor(user.tier, user.createdAt);

  return (
    <JournalClient
      firstName={user.name?.split(' ')[0] ?? null}
      access={{ trendInsights: access.trendInsights, inTrial: access.inTrial, trialDaysLeft: access.trialDaysLeft }}
    />
  );
}
