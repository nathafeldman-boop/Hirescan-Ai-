import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AffiliatesClient from './AffiliatesClient';
import Link from 'next/link';

const OWNER_EMAIL = 'nathabuisseness@gmail.com';

export default async function AdminAffiliatesPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== OWNER_EMAIL) redirect('/login');

  const affiliates = await prisma.affiliate.findMany({
    include: { conversions: { orderBy: { createdAt: 'desc' } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <header className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-white">Secret</span>
          </Link>
          <span className="text-xs text-zinc-500">Admin · Affiliés</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Liens affiliés</h1>
          <p className="text-zinc-500 text-sm">
            Chaque influenceur partage son lien <code className="text-violet-400">urcecret.site/?ref=son-slug</code>.
            Les ventes générées dans les 30 jours sont automatiquement trackées et la commission est calculée à 50%.
          </p>
        </div>

        <AffiliatesClient initial={JSON.parse(JSON.stringify(affiliates))} />
      </div>
    </main>
  );
}
