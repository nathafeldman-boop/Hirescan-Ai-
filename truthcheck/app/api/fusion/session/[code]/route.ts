import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fusionQuestions, computeFusionResult, type ParticipantAnswers, type FusionAnswer } from '@/lib/fusion';

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const group = await prisma.fusionGroup.findUnique({
      where: { code: params.code.toUpperCase() },
      include: { participants: { orderBy: { createdAt: 'asc' } } },
    });

    if (!group) return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });

    const questionIds = Array.isArray(group.questionIds) ? group.questionIds as number[] : [];
    const questions = questionIds.length > 0
      ? fusionQuestions.filter(q => questionIds.includes(q.id))
      : [];

    // Compute result if all done and not yet stored
    let resultData = group.resultData as object | null;
    if (group.status === 'active' && group.participants.every(p => p.done) && !resultData) {
      const participantAnswers: ParticipantAnswers[] = group.participants
        .filter(p => p.answers)
        .map(p => ({ answers: p.answers as Record<number, FusionAnswer> }));
      const result = computeFusionResult(questionIds, participantAnswers);
      resultData = result as unknown as object;
      await prisma.fusionGroup.update({
        where: { id: group.id },
        data: { status: 'complete', resultData },
      });
    }

    return NextResponse.json({
      status: group.status,
      paid: group.paid,
      participants: group.participants.map(p => ({
        id: p.id,
        name: p.name,
        done: p.done,
      })),
      questions,
      result: resultData,
    });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
