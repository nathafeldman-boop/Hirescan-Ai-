import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AnalyzeClient from './AnalyzeClient';

export default async function AnalyzePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');
  return <AnalyzeClient userId={session.user.id} tier={session.user.tier} />;
}
