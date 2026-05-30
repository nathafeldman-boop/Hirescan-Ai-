import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Tu es un expert en communication sociale et en "rizz" — l'art de la séduction naturelle et charismatique.

Quand on te donne un screenshot de conversation, tu dois :
1. Analyser le contexte, le ton et les sous-entendus
2. Générer exactement 5 réponses dans 5 styles différents : Witty, Séducteur, Neutre, Audacieux, Empathique
3. Attribuer un score Rizz de 1 à 10 à chaque réponse

Réponds UNIQUEMENT en JSON valide avec cette structure :
{
  "context": "résumé du contexte en 1-2 phrases",
  "tone": "ton de la conversation (ex: flirt, amical, tendu, neutre)",
  "responses": [
    { "style": "Witty", "emoji": "😏", "text": "...", "score": 8 },
    { "style": "Séducteur", "emoji": "🔥", "text": "...", "score": 9 },
    { "style": "Neutre", "emoji": "😊", "text": "...", "score": 6 },
    { "style": "Audacieux", "emoji": "⚡", "text": "...", "score": 7 },
    { "style": "Empathique", "emoji": "💙", "text": "...", "score": 7 }
  ]
}`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY non configurée' }, { status: 503 });
  }

  // Rate limit: free users get 5/month
  const session = await getServerSession(authOptions);
  if (session?.user?.id && session.user.tier === 'free') {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const count = await prisma.screenshotAnalysis.count({
      where: { userId: session.user.id, createdAt: { gte: startOfMonth } },
    });

    if (count >= 5) {
      return NextResponse.json(
        { error: 'Limite mensuelle atteinte (5 analyses). Passe en Pro pour analyses illimitées.' },
        { status: 429 }
      );
    }
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: 'Image requise' }, { status: 400 });
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image trop grande (max 10MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64 = buffer.toString('base64');
    const mediaType = (imageFile.type as 'image/jpeg' | 'image/png' | 'image/webp') || 'image/jpeg';

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            {
              type: 'text',
              text: 'Analyse cette conversation et génère 5 réponses avec leurs scores Rizz.',
            },
          ],
        },
      ],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Réponse IA invalide');

    const parsed = JSON.parse(jsonMatch[0]);

    // Calculate rizz points earned (avg score * 10)
    const avgScore = parsed.responses.reduce((s: number, r: { score: number }) => s + r.score, 0) / parsed.responses.length;
    const rizzPointsEarned = Math.round(avgScore * 10);

    // Save to DB + update user score
    if (session?.user?.id) {
      await prisma.$transaction([
        prisma.screenshotAnalysis.create({
          data: {
            userId: session.user.id,
            rawText: '',
            context: parsed.context,
            rizzScoreBefore: session.user.rizzScore,
            rizzScoreAfter: rizzPointsEarned,
            responses: JSON.stringify(parsed.responses),
          },
        }),
        prisma.user.update({
          where: { id: session.user.id },
          data: { rizzScore: { increment: rizzPointsEarned } },
        }),
      ]);
    }

    return NextResponse.json({ ...parsed, rizzPointsEarned });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
