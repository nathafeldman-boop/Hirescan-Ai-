export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import AdminDashboard from '../admin/AdminDashboard';

export default async function StatsPage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const twelveMonthsAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  const [totalUsers, premiumUsers, newToday, newThisWeek, newThisMonth, recentUsers, allUsersForMonth] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: 'premium' } }),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { id: true, email: true, name: true, tier: true, createdAt: true, _count: { select: { quizResults: true } } },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true },
    }),
  ]);

  const [totalResults, paidResults, paidToday, paidThisMonth, allResults] = await Promise.all([
    prisma.quizResult.count(),
    prisma.quizResult.count({ where: { paid: true } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: startOfToday } } }),
    prisma.quizResult.count({ where: { paid: true, createdAt: { gte: startOfMonth } } }),
    prisma.quizResult.findMany({
      select: { quizSlug: true, score: true, paid: true, createdAt: true, userId: true },
    }),
  ]);

  const [allConversions, affiliates, allAttributionConversions] = await Promise.all([
    prisma.affiliateConversion.findMany({
      select: { amountCents: true, commissionCents: true, createdAt: true, affiliateId: true },
    }),
    prisma.affiliate.findMany({
      include: { conversions: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.conversion.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: {
        id: true, email: true, amountCents: true, quizSlug: true,
        productType: true, utmSource: true, utmMedium: true,
        utmCampaign: true, affiliateSlug: true, landingPath: true, createdAt: true,
      },
    }),
  ]);

  // Agrégation par source
  const sourceBreakdown: Record<string, { count: number; revenueCents: number }> = {};
  allAttributionConversions.forEach(c => {
    const src = c.utmSource ?? (c.affiliateSlug ? `aff:${c.affiliateSlug}` : 'organique');
    if (!sourceBreakdown[src]) sourceBreakdown[src] = { count: 0, revenueCents: 0 };
    sourceBreakdown[src].count++;
    sourceBreakdown[src].revenueCents += c.amountCents;
  });

  const usersByMonth: Record<string, number> = {};
  allUsersForMonth.forEach(u => {
    const key = u.createdAt.toISOString().slice(0, 7);
    usersByMonth[key] = (usersByMonth[key] || 0) + 1;
  });

  const revenueByMonth: Record<string, { revenue: number; commission: number; count: number }> = {};
  allConversions.forEach(c => {
    const key = c.createdAt.toISOString().slice(0, 7);
    if (!revenueByMonth[key]) revenueByMonth[key] = { revenue: 0, commission: 0, count: 0 };
    revenueByMonth[key].revenue += c.amountCents;
    revenueByMonth[key].commission += c.commissionCents;
    revenueByMonth[key].count++;
  });

  const byQuiz: Record<string, { count: number; paidCount: number; totalScore: number }> = {};
  allResults.forEach(r => {
    if (!byQuiz[r.quizSlug]) byQuiz[r.quizSlug] = { count: 0, paidCount: 0, totalScore: 0 };
    byQuiz[r.quizSlug].count++;
    if (r.paid) byQuiz[r.quizSlug].paidCount++;
    byQuiz[r.quizSlug].totalScore += r.score;
  });

  const totalRevenueCents = allConversions.reduce((s, c) => s + c.amountCents, 0);
  const todayRevenueCents = allConversions.filter(c => new Date(c.createdAt) >= startOfToday).reduce((s, c) => s + c.amountCents, 0);
  const weekRevenueCents = allConversions.filter(c => new Date(c.createdAt) >= sevenDaysAgo).reduce((s, c) => s + c.amountCents, 0);
  const monthRevenueCents = allConversions.filter(c => new Date(c.createdAt) >= startOfMonth).reduce((s, c) => s + c.amountCents, 0);
  const yearRevenueCents = allConversions.filter(c => new Date(c.createdAt) >= startOfYear).reduce((s, c) => s + c.amountCents, 0);

  const stats = JSON.parse(JSON.stringify({
    totalUsers, premiumUsers, newToday, newThisWeek, newThisMonth,
    recentUsers, usersByMonth,
    totalResults, paidResults, paidToday, paidThisMonth, byQuiz,
    totalRevenueCents, todayRevenueCents, weekRevenueCents, monthRevenueCents, yearRevenueCents,
    revenueByMonth, affiliates,
    recentAttributionConversions: allAttributionConversions.slice(0, 50),
    sourceBreakdown,
  }));

  return <AdminDashboard stats={stats} />;
}
