import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { selectRandomQuestions } from '@/lib/fusion';

export async function POST(req: NextRequest) {
  try {
    const { groupId, participantId } = await req.json();
    if (!groupId || !participantId) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    const group = await prisma.fusionGroup.findUnique({
      where: { id: groupId },
      include: { participants: { orderBy: { createdAt: 'asc' }, take: 1 } },
    });

    if (!group) return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });
    if (group.participants[0]?.id !== participantId) {
      return NextResponse.json({ error: 'Seul le créateur peut démarrer' }, { status: 403 });
    }
    if (group.status !== 'waiting') {
      return NextResponse.json({ error: 'Session déjà démarrée' }, { status: 400 });
    }

    const questionIds = selectRandomQuestions(15);
    await prisma.fusionGroup.update({
      where: { id: groupId },
      data: { status: 'active', questionIds },
    });

    return NextResponse.json({ ok: true, questionIds });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
