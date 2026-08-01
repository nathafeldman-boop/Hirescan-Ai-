import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`saveemail:${ip}`, 5, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : null;
  const mbtiType = typeof body.typeCode === 'string' ? body.typeCode.trim().toUpperCase().slice(0, 4) : null;

  if (!email || !email.includes('@') || !email.includes('.')) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Capture le lead (email, éventuellement nom/type MBTI) sans envoyer
  // d'email — retiré le 01/08 (économie de quota Resend). Ne pose PAS de
  // ligne EmailLog(type:'welcome') ici : ce marqueur sert maintenant de
  // source de vérité au "vrai moment d'activation" pour les compteurs
  // admin (voir lib/notifySignup.ts) — le poser dès une simple capture
  // anonyme referait exactement le bug déjà corrigé (compte "actif"
  // compté le jour de la capture au lieu du jour de la vraie connexion).
  await prisma.user.upsert({
    where: { email },
    create: { email, tier: 'free', ...(name ? { name } : {}), ...(mbtiType ? { mbtiType } : {}) },
    update: { ...(mbtiType ? { mbtiType } : {}) },
  }).catch(() => null);

  return NextResponse.json({ ok: true });
}
