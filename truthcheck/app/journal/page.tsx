import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import JournalClient from './JournalClient';

export default async function JournalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });

  if (!user) redirect('/login');

  return <JournalClient firstName={user.name?.split(' ')[0] ?? null} />;
}
