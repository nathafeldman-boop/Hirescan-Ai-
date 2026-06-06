import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminDashboard from './AdminDashboard';

const OWNER_EMAIL = 'nathabuisseness@gmail.com';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== OWNER_EMAIL) redirect('/login');

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const twelveMonthsAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  // Users
  const [totalUsers, premiumUsers, newToday, newThisWeek, newThisMonth, recentUsers, allUsersForMonth] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: 'premium' } }),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        createdAt: true,
        _count: { select: { quizResults: true } },
      },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true },
    }),
  ]);

  // Quiz Results
  const [totalResults, paidResults, paidToday, paidThisMonth, allResults] = await Promise.all([
    prisma.quizResult.count(),
    prisma.quizResult.count({ where: { paid: true } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: startOfToday } } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: startOfMonth } } }),
    prisma.quizResult.findMany({
      select: { quizSlug: true, score: true, paid: true, createdAt: true, userId: true },
    }),
  ]);

  // Affiliate conversions (revenue tracking)
  const [allConversions, affiliates] = await Promise.all([
    prisma.affiliateConversion.findMany({
      select: { amountCents: true, commissionCents: true, createdAt: true, affiliateId: true },
    }),
    prisma.affiliate.findMany({
      include: { conversions: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Group users by month
  const usersByMonth: Record<string, number> = {};
  allUsersForMonth.forEach(u => {
    const key = u.createdAt.toISOString().slice(0, 7);
    usersByMonth[key] = (usersByMonth[key] || 0) + 1;
  });

  // Group conversions by month
  const revenueByMonth: Record<string, { revenue: number; commission: number; count: number }> = {};
  allConversions.forEach(c => {
    const key = c.createdAt.toISOString().slice(0, 7);
    if (!revenueByMonth[key]) revenueByMonth[key] = { revenue: 0, commission: 0, count: 0 };
    revenueByMonth[key].revenue += c.amountCents;
    revenueByMonth[key].commission += c.commissionCents;
    revenueByMonth[key].count++;
  });

  // Group quiz results by slug
  const byQuiz: Record<string, { count: number; paidCount: number; totalScore: number }> = {};
  allResults.forEach(r => {
    if (!byQuiz[r.quizSlug]) byQuiz[r.quizSlug] = { count: 0, paidCount: 0, totalScore: 0 };
    byQuiz[r.quizSlug].count++;
    if (r.paid) byQuiz[r.quizSlug].paidCount++;
    byQuiz[r.quizSlug].totalScore += r.score;
  });

  // Revenue totals
  const totalRevenueCents = allConversions.reduce((s, c) => s + c.amountCents, 0);
  const todayRevenueCents = allConversions
    .filter(c => new Date(c.createdAt) >= startOfToday)
    .reduce((s, c) => s + c.amountCents, 0);
  const monthRevenueCents = allConversions
    .filter(c => new Date(c.createdAt) >= startOfMonth)
    .reduce((s, c) => s + c.amountCents, 0);
  const yearRevenueCents = allConversions
    .filter(c => new Date(c.createdAt) >= startOfYear)
    .reduce((s, c) => s + c.amountCents, 0);
  const weekRevenueCents = allConversions
    .filter(c => new Date(c.createdAt) >= sevenDaysAgo)
    .reduce((s, c) => s + c.amountCents, 0);

  const stats = JSON.parse(
    JSON.stringify({
      // Users
      totalUsers,
      premiumUsers,
      newToday,
      newThisWeek,
      newThisMonth,
      recentUsers,
      usersByMonth,
      // Quiz
      totalResults,
      paidResults,
      paidToday,
      paidThisMonth,
      byQuiz,
      // Revenue
      totalRevenueCents,
      todayRevenueCents,
      monthRevenueCents,
      yearRevenueCents,
      weekRevenueCents,
      revenueByMonth,
      // Affiliates
      affiliates,
    })
  );

  return <AdminDashboard stats={stats} />;
}
