import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logEvent, EVENTS } from '@/lib/trackEvent';
import { AGE_RANGES, GENDERS, ONBOARDING_GOALS } from '@/lib/onboardingFunnel';

export const dynamic = 'force-dynamic';

// Questionnaire d'accueil (page /bienvenue) — un seul écrit, jamais rejoué
// (voir onboardingCompletedAt dans schema.prisma). Purement déclaratif : sert
// l'admin (comprendre l'intention des inscrits) et l'impression de
// personnalisation dès la 1ère minute, pas encore injecté dans les prompts
// d'Elio (voir commentaire du champ dans schema.prisma).
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  let body: { name?: string; ageRange?: string; gender?: string; goal?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_body' }, { status: 400 }); }

  const name = (body.name ?? '').trim().slice(0, 60) || undefined;
  const ageRange = AGE_RANGES.includes(body.ageRange as typeof AGE_RANGES[number]) ? body.ageRange : undefined;
  const gender = GENDERS.includes(body.gender as typeof GENDERS[number]) ? body.gender : undefined;
  const goal = ONBOARDING_GOALS.includes(body.goal as typeof ONBOARDING_GOALS[number]) ? body.goal : undefined;

  await prisma.user.update({
    where: { id: uid },
    data: {
      ...(name ? { name } : {}),
      ageRange,
      gender,
      onboardingGoal: goal,
      onboardingCompletedAt: new Date(),
    },
  });

  await logEvent(uid, EVENTS.ONBOARDING_COMPLETED, { ageRange, gender, goal });

  return NextResponse.json({ ok: true });
}
