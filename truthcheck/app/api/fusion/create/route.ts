import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateFusionCode } from '@/lib/fusion';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`fusion-create:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

  try {
    const { hostName } = await req.json();
    if (!hostName || typeof hostName !== 'string' || hostName.trim().length < 1) {
      return NextResponse.json({ error: 'Nom requis' }, { status: 400 });
    }

    // Generate unique code (retry if collision)
    let code = generateFusionCode();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.fusionGroup.findUnique({ where: { code } });
      if (!existing) break;
      code = generateFusionCode();
      attempts++;
    }

    const group = await prisma.fusionGroup.create({ data: { code, status: 'waiting' } });
    const participant = await prisma.fusionParticipant.create({
      data: { groupId: group.id, name: hostName.trim().slice(0, 30) },
    });

    return NextResponse.json({ code: group.id === group.id ? code : code, groupId: group.id, participantId: participant.id });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
