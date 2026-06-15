import { prisma } from '@/lib/db';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const now = new Date();
  const startOfToday    = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo    = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth    = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear     = new Date(now.getFullYear(), 0, 1);
  const twelveMonthsAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  const [
    totalUsers, premiumUsers, newToday, newThisWeek, newThisMonth,
    recentUsers, allUsersForMonth, premiumUsersForMonth,
    totalResults, paidResults, paidToday, paidThisMonth, quizGrouped,
    quizResultsForMonth,
    mbtiUsers,
    allConversions, affiliates, affiliateClickViews,
    totalPageViews,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: 'premium' } }),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, take: 100,
      select: { id: true, email: true, name: true, tier: true, createdAt: true, _count: { select: { quizResults: true } } },
    }),
    prisma.user.findMany({ where: { createdAt: { gte: twelveMonthsAgo } }, select: { createdAt: true } }),
    prisma.user.findMany({ where: { tier: 'premium', createdAt: { gte: twelveMonthsAgo } }, select: { createdAt: true } }),
    prisma.quizResult.count(),
    prisma.quizResult.count({ where: { paid: true } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: startOfToday } } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: startOfMonth } } }),
    prisma.quizResult.groupBy({ by: ['quizSlug', 'paid'], _count: { id: true }, _sum: { score: true } }),
    prisma.quizResult.findMany({ where: { createdAt: { gte: twelveMonthsAgo } }, select: { createdAt: true, paid: true } }),
    prisma.user.findMany({ where: { mbtiType: { not: null } }, select: { mbtiType: true } }),
    prisma.affiliateConversion.findMany({ select: { amountCents: true, commissionCents: true, createdAt: true, affiliateId: true } }),
    prisma.affiliate.findMany({ include: { conversions: { orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' } }),
    prisma.pageView.findMany({ where: { path: { startsWith: '/__aff/' } }, select: { path: true } }),
    prisma.pageView.count(),
  ]);

  // Group users by month
  const usersByMonth: Record<string, number> = {};
  allUsersForMonth.forEach(u => {
    const key = u.createdAt.toISOString().slice(0, 7);
    usersByMonth[key] = (usersByMonth[key] || 0) + 1;
  });

  // Group premium by month
  const premiumByMonth: Record<string, number> = {};
  premiumUsersForMonth.forEach(u => {
    const key = u.createdAt.toISOString().slice(0, 7);
    premiumByMonth[key] = (premiumByMonth[key] || 0) + 1;
  });

  // Group quiz completions by month
  const quizByMonth: Record<string, number> = {};
  const paidByMonth: Record<string, number> = {};
  quizResultsForMonth.forEach(r => {
    const key = r.createdAt.toISOString().slice(0, 7);
    quizByMonth[key]  = (quizByMonth[key]  || 0) + 1;
    if (r.paid) paidByMonth[key] = (paidByMonth[key] || 0) + 1;
  });

  // Group conversions by month
  const revenueByMonth: Record<string, { revenue: number; commission: number; count: number }> = {};
  allConversions.forEach(c => {
    const key = c.createdAt.toISOString().slice(0, 7);
    if (!revenueByMonth[key]) revenueByMonth[key] = { revenue: 0, commission: 0, count: 0 };
    revenueByMonth[key].revenue    += c.amountCents;
    revenueByMonth[key].commission += c.commissionCents;
    revenueByMonth[key].count++;
  });

  // byQuiz
  const byQuiz: Record<string, { count: number; paidCount: number; totalScore: number }> = {};
  quizGrouped.forEach(row => {
    if (!byQuiz[row.quizSlug]) byQuiz[row.quizSlug] = { count: 0, paidCount: 0, totalScore: 0 };
    byQuiz[row.quizSlug].count      += row._count.id;
    byQuiz[row.quizSlug].totalScore += row._sum.score ?? 0;
    if (row.paid) byQuiz[row.quizSlug].paidCount += row._count.id;
  });

  // mbtiDistribution
  const mbtiDistribution: Record<string, number> = {};
  mbtiUsers.forEach(u => {
    if (u.mbtiType) mbtiDistribution[u.mbtiType] = (mbtiDistribution[u.mbtiType] ?? 0) + 1;
  });

  // Affiliate clicks
  const affiliateClicks: Record<string, number> = {};
  affiliateClickViews.forEach(v => {
    const slug = v.path.replace('/__aff/', '');
    affiliateClicks[slug] = (affiliateClicks[slug] ?? 0) + 1;
  });

  // Revenue totals
  const totalRevenueCents  = allConversions.reduce((s, c) => s + c.amountCents, 0);
  const todayRevenueCents  = allConversions.filter(c => new Date(c.createdAt) >= startOfToday).reduce((s, c) => s + c.amountCents, 0);
  const monthRevenueCents  = allConversions.filter(c => new Date(c.createdAt) >= startOfMonth).reduce((s, c) => s + c.amountCents, 0);
  const yearRevenueCents   = allConversions.filter(c => new Date(c.createdAt) >= startOfYear).reduce((s, c)  => s + c.amountCents, 0);
  const weekRevenueCents   = allConversions.filter(c => new Date(c.createdAt) >= sevenDaysAgo).reduce((s, c) => s + c.amountCents, 0);

  const stats = JSON.parse(JSON.stringify({
    totalUsers, premiumUsers, newToday, newThisWeek, newThisMonth,
    recentUsers, usersByMonth, premiumByMonth,
    totalResults, paidResults, paidToday, paidThisMonth,
    byQuiz, quizByMonth, paidByMonth, mbtiDistribution,
    totalRevenueCents, todayRevenueCents, monthRevenueCents, yearRevenueCents, weekRevenueCents,
    revenueByMonth,
    affiliates, affiliateClicks,
    totalPageViews,
  }));

  return <AdminDashboard stats={stats} />;
}
