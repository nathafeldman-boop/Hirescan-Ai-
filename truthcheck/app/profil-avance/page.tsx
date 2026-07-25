import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPaidAccess } from '@/lib/plans';
import ProfilAvanceClient from './ProfilAvanceClient';

export default async function ProfilAvancePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true, mbtiType: true },
  });
  if (!user) redirect('/login');

  return <ProfilAvanceClient isPaid={hasPaidAccess(user.tier)} hasTest={!!user.mbtiType} />;
}
