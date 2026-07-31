import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { parisDay } from '@/lib/chat';
import { getPath, getLevel, type ExerciseContent } from '@/lib/paths';
import { canCompleteLevel } from '@/lib/pathAccess';
import { generatePathInsight } from '@/lib/pathInsight';
import { logEvent, EVENTS } from '@/lib/trackEvent';
import { checkAndRecordQuestCompletions } from '@/lib/quests';

export const dynamic = 'force-dynamic';

// À partir de ce que le client envoie pour CE type d'exercice, construit (a)
// le texte de la consigne (pour le reflet Elio) et (b) la réponse à figer —
// null quand l'exercice n'a pas de réponse textuelle exploitable (respiration,
// défi réel, tri de pensées : pas de "bonne" réponse à refléter).
function extractAnswer(content: ExerciseContent, body: Record<string, unknown>): { prompt: string; answer: string | null } {
  switch (content.type) {
    case 'reflexion': {
      const answer = typeof body.answer === 'string' ? body.answer.trim() : '';
      return { prompt: content.question, answer: answer || null };
    }
    case 'quiz_situation': {
      const value = typeof body.value === 'string' ? body.value : '';
      const option = content.options.find((o) => o.value === value);
      return { prompt: content.scenario, answer: option?.label ?? null };
    }
    case 'gratitude': {
      const items = Array.isArray(body.items) ? body.items.filter((i): i is string => typeof i === 'string' && i.trim().length > 0) : [];
      return { prompt: content.instruction, answer: items.length > 0 ? items.join(' · ') : null };
    }
    case 'affirmation': {
      const answer = typeof body.answer === 'string' ? body.answer.trim() : '';
      return { prompt: content.base, answer: answer || null };
    }
    case 'reconnaissance_emotion': {
      const selected = Array.isArray(body.selected) ? body.selected.filter((s): s is string => typeof s === 'string') : [];
      return { prompt: content.situation, answer: selected.length > 0 ? selected.join(', ') : null };
    }
    case 'journal_guide': {
      const answers = Array.isArray(body.answers) ? body.answers.filter((a): a is string => typeof a === 'string' && a.trim().length > 0) : [];
      return { prompt: content.prompts.join(' / '), answer: answers.length > 0 ? answers.join('\n') : null };
    }
    case 'cognitif': {
      const thought = typeof body.thought === 'string' ? body.thought.trim() : '';
      const reframe = typeof body.reframe === 'string' ? body.reframe.trim() : '';
      const answer = thought && reframe ? `Pensée : ${thought}\nReformulation : ${reframe}` : null;
      return { prompt: content.instruction, answer };
    }
    case 'tri_pensees':
      return { prompt: content.instruction, answer: null };
    case 'respiration':
      return { prompt: content.instruction, answer: null };
    case 'defi_reel':
      return { prompt: content.challenge, answer: null };
    default:
      return { prompt: '', answer: null };
  }
}

export async function POST(req: NextRequest, { params }: { params: { pathKey: string } }) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const path = getPath(params.pathKey);
  if (!path) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_body' }, { status: 400 }); }

  const levelIndex = typeof body.levelIndex === 'number' ? body.levelIndex : NaN;
  const level = getLevel(path.key, levelIndex);
  if (!level) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  const [user, pathCompletions, todayCompletionsCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: uid }, select: { name: true, tier: true, mbtiType: true } }),
    prisma.levelCompletion.findMany({ where: { userId: uid, pathKey: path.key }, select: { levelIndex: true, xpEarned: true, insight: true, answer: true } }),
    prisma.levelCompletion.count({ where: { userId: uid, day: parisDay() } }),
  ]);

  const existing = pathCompletions.find((c) => c.levelIndex === levelIndex);
  const highestCompletedIndex = pathCompletions.reduce((max, c) => Math.max(max, c.levelIndex), -1);

  const access = canCompleteLevel({
    tier: user?.tier ?? 'free',
    levelIndex,
    highestCompletedIndex,
    completionsToday: todayCompletionsCount,
    alreadyCompletedThisLevel: !!existing,
  });
  if (!access.allowed) return NextResponse.json({ error: access.reason }, { status: 403 });

  if (existing) {
    return NextResponse.json({ ok: true, alreadyDone: true, xpEarned: existing.xpEarned, insight: existing.insight });
  }

  const { prompt, answer } = extractAnswer(level.content, body);

  const insight = answer
    ? await generatePathInsight({
        firstName: user?.name?.split(' ')[0] ?? null,
        levelTitle: level.title,
        exercisePrompt: prompt,
        userAnswer: answer,
        mbtiType: user?.mbtiType ?? null,
      })
    : null;

  await prisma.levelCompletion.create({
    data: { userId: uid, pathKey: path.key, levelIndex, day: parisDay(), xpEarned: level.xp, answer, insight },
  });

  await logEvent(uid, EVENTS.PARCOURS_LEVEL_COMPLETED, { pathKey: path.key, levelIndex });
  await checkAndRecordQuestCompletions(uid);

  return NextResponse.json({ ok: true, alreadyDone: false, xpEarned: level.xp, insight });
}
