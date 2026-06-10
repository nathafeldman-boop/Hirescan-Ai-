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
    select: {
      name: true,
      email: true,
      image: true,
      tier: true,
      createdAt: true,
    },
  });

  if (!user) redirect('/login');

  return (
    <DashboardClient
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
        tier: user.tier,
        memberSince: user.createdAt.toISOString(),
      }}
    />
  );
}
