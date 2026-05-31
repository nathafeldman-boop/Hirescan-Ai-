import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, age, gender, situation, quizSlug } = body;
    if (!quizSlug) return NextResponse.json({ error: 'quizSlug required' }, { status: 400 });

    const session = await prisma.userSession.create({
      data: {
        firstName: firstName ?? null,
        age: age ?? null,
        gender: gender ?? null,
        situation: situation ?? null,
        quizSlug,
      },
    });

    return NextResponse.json({ id: session.id });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
