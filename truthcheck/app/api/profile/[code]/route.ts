import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ALL_MBTI_TYPES } from '@/lib/mbti';
import { mbtiTypesPremium } from '@/lib/mbti-premium';
import { mbtiTypesEnPremium } from '@/lib/i18n/mbtiTypesEnPremium';

// Seule route qui sert le contenu payant (fullDesc, inLove, atWork,
// strengths, weaknesses, growth, famousExamples, compatibleWith) à un
// client. Vérifie le paiement via la session serveur (base de données,
// jamais un JWT/valeur côté client) avant de répondre — voir lib/auth.ts
// (session: { strategy: 'database' }), donc `tier` est toujours à jour et
// ne peut pas être falsifié depuis le navigateur.
export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const session = await getServerSession(authOptions);
  const isPremium = (session?.user as { tier?: string } | undefined)?.tier === 'premium';
  if (!isPremium) {
    return NextResponse.json({ error: 'Paiement requis' }, { status: 403 });
  }

  const code = params.code.toUpperCase();
  if (!ALL_MBTI_TYPES.includes(code)) {
    return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
  }

  const lang = req.nextUrl.searchParams.get('lang') === 'en' ? 'en' : 'fr';
  const base = mbtiTypesPremium[code];
  const data = lang === 'en' ? { ...base, ...mbtiTypesEnPremium[code] } : base;

  return NextResponse.json(data);
}
