import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logEvent, EVENTS } from '@/lib/trackEvent';
import { AGE_RANGES, GENDERS, ONBOARDING_REASONS, ONBOARDING_FOCUS_OPTIONS } from '@/lib/onboardingFunnel';

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

  let body: { name?: string; ageRange?: string; gender?: string; reason?: string; focus?: string[] };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_body' }, { status: 400 }); }

  const name = (body.name ?? '').trim().slice(0, 60) || undefined;
  const ageRange = AGE_RANGES.includes(body.ageRange as typeof AGE_RANGES[number]) ? body.ageRange : undefined;
  const gender = GENDERS.includes(body.gender as typeof GENDERS[number]) ? body.gender : undefined;
  const reason = ONBOARDING_REASONS.includes(body.reason as typeof ONBOARDING_REASONS[number]) ? body.reason : undefined;
  const focus = Array.isArray(body.focus)
    ? body.focus.filter((f): f is string => ONBOARDING_FOCUS_OPTIONS.includes(f as typeof ONBOARDING_FOCUS_OPTIONS[number])).slice(0, 6)
    : [];

  await prisma.user.update({
    where: { id: uid },
    data: {
      ...(name ? { name } : {}),
      ageRange,
      gender,
      onboardingReason: reason,
      onboardingFocus: focus,
      onboardingCompletedAt: new Date(),
    },
  });

  await logEvent(uid, EVENTS.ONBOARDING_COMPLETED, { ageRange, gender, reason, focus });

  return NextResponse.json({ ok: true });
}
