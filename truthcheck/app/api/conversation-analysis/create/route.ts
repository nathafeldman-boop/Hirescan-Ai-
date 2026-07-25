import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPaidAccess } from '@/lib/plans';
import { dailyLimitFor, parisDay } from '@/lib/chat';
import { generateConversationAnalysis, conversationAnalysisDisclaimer } from '@/lib/conversationAnalysis';

export const dynamic = 'force-dynamic';

// Même limite que la photo envoyée à Nova en chat (voir /api/chat) — data URI
// décodée reste sous ~4,5 Mo.
const MAX_IMAGE_DATA_URI_LENGTH = 6_000_000;

// Analyse de conversation (texte collé et/ou capture d'écran) — feature phare,
// réservée aux abonnés payants (starter/plus/premium), même quota que le chat
// Nova (1 analyse = 1 message, pas de nouveau système de limite à maintenir).
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; tier?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  if (!hasPaidAccess(user.tier)) {
    return NextResponse.json({ error: 'payment_required' }, { status: 402 });
  }

  const body = await req.json().catch(() => null) as { text?: string; imageBase64?: string } | null;
  const text = (body?.text ?? '').trim().slice(0, 6000);
  const rawImage = typeof body?.imageBase64 === 'string' ? body.imageBase64 : '';

  let imageDataUri: string | null = null;
  if (rawImage) {
    if (!/^data:image\/(jpe?g|png|webp|gif);base64,/i.test(rawImage)) {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    }
    if (rawImage.length > MAX_IMAGE_DATA_URI_LENGTH) {
      return NextResponse.json({ error: 'image_too_large' }, { status: 413 });
    }
    imageDataUri = rawImage;
  }

  if (!text && !imageDataUri) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  // Même quota journalier que le chat Nova.
  const day = parisDay();
  const limit = dailyLimitFor(user.tier);
  const usage = await prisma.chatUsage.upsert({
    where: { userId_day: { userId: user.id, day } },
    create: { userId: user.id, day, count: 0 },
    update: {},
  }).catch(() => null);
  if ((usage?.count ?? 0) >= limit) {
    return NextResponse.json({ error: 'quota_exceeded', limit }, { status: 429 });
  }

  const result = await generateConversationAnalysis(text, imageDataUri);
  if (!result) {
    // On ne décompte pas le quota si l'analyse a échoué — voir même principe
    // que /api/quiz-builder/create.
    return NextResponse.json({ error: 'analysis_failed' }, { status: 502 });
  }

  const saved = await prisma.conversationAnalysis.create({
    data: {
      userId: user.id,
      inputPreview: text ? text.slice(0, 200) : '[Capture d\'écran]',
      personality: result.personality,
      attachmentStyle: result.attachmentStyle,
      manipulationFlags: result.manipulationFlags,
      greenFlags: result.greenFlags,
      redFlags: result.redFlags,
      compatibility: result.compatibility,
      emotionalLanguage: result.emotionalLanguage,
      advice: result.advice,
    },
  });

  const updated = await prisma.chatUsage.update({
    where: { userId_day: { userId: user.id, day } },
    data: { count: { increment: 1 } },
  }).catch(() => null);
  const remaining = Math.max(0, limit - (updated?.count ?? (usage?.count ?? 0) + 1));

  return NextResponse.json({
    ok: true,
    id: saved.id,
    result,
    disclaimer: conversationAnalysisDisclaimer(),
    remaining,
    limit,
  });
}
