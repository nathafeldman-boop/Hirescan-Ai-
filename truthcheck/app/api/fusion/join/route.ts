import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`fusion-join:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

  try {
    const { code, name } = await req.json();
    if (!code || !name || typeof name !== 'string' || name.trim().length < 1) {
      return NextResponse.json({ error: 'Code et nom requis' }, { status: 400 });
    }

    const group = await prisma.fusionGroup.findUnique({
      where: { code: code.toUpperCase() },
      include: { participants: true },
    });

    if (!group) return NextResponse.json({ error: 'Code invalide' }, { status: 404 });
    if (group.status === 'complete') return NextResponse.json({ error: 'Session terminée' }, { status: 400 });
    if (group.participants.length >= 10) return NextResponse.json({ error: 'Session pleine (max 10)' }, { status: 400 });

    const participant = await prisma.fusionParticipant.create({
      data: { groupId: group.id, name: name.trim().slice(0, 30) },
    });

    return NextResponse.json({ groupId: group.id, participantId: participant.id, code: group.code });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
