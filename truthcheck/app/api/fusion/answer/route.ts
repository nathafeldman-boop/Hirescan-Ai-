import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { participantId, answers } = await req.json();
    if (!participantId || !answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    await prisma.fusionParticipant.update({
      where: { id: participantId },
      data: { answers, done: true },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
