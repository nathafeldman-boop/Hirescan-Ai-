import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPaidAccess } from '@/lib/plans';
import CompatClient from './CompatClient';

export default async function CompatPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true },
  });
  if (!user) redirect('/login');

  return <CompatClient isPaid={hasPaidAccess(user.tier)} />;
}
