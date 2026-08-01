// ── Parcours adaptatifs ──────────────────────────────────────────────────
// Un niveau "branché" (voir lib/paths.ts::PathLevelDef.branch) a un contenu
// différent selon la réponse donnée par CE compte à un niveau diagnostic
// antérieur (ex: "d'où vient ton stress"). Rien n'est stocké nulle part
// pour ça : on relit juste LevelCompletion.answer du niveau diagnostic à
// chaque affichage — même philosophie "compute, don't cache" que le
// streak/l'énergie (voir lib/pathAccess.ts).
//
// Hypothèse volontairement simple : dans UN même parcours, tous les niveaux
// branchés partagent le même niveau diagnostic (`fromLevelIndex`) — donc une
// seule lecture suffit pour résoudre tout le parcours d'un coup
// (resolvePathLevelsForUser), au lieu d'une lecture par niveau branché.
import { prisma } from './db';
import { getPath, getLevel, type PathLevelDef } from './paths';

// Le niveau diagnostic est toujours un quiz_situation : chaque option porte
// un `label` (affiché, stocké tel quel dans LevelCompletion.answer — voir
// extractAnswer dans app/api/paths/[pathKey]/complete/route.ts) et une
// `value` stable (la clé de branche, ex. "travail"). On retrouve la clé en
// recherchant quelle option a ce label exact.
async function resolveBranchKey(pathKey: string, userId: string, fromLevelIndex: number): Promise<string | null> {
  const sourceLevel = getLevel(pathKey, fromLevelIndex);
  if (!sourceLevel || sourceLevel.content.type !== 'quiz_situation') return null;

  const completion = await prisma.levelCompletion.findUnique({
    where: { userId_pathKey_levelIndex: { userId, pathKey, levelIndex: fromLevelIndex } },
    select: { answer: true },
  });
  if (!completion?.answer) return null;

  const option = sourceLevel.content.options.find((o) => o.label === completion.answer);
  return option?.value ?? null;
}

function applyBranch(level: PathLevelDef, branchKey: string | null): PathLevelDef {
  if (!level.branch || !branchKey) return level;
  const variant = level.branch.variants[branchKey];
  if (!variant) return level;
  return { ...level, title: variant.title, emoji: variant.emoji, content: variant.content };
}

export async function resolvePathLevelsForUser(pathKey: string, userId: string): Promise<PathLevelDef[]> {
  const path = getPath(pathKey);
  if (!path) return [];
  const branchedLevel = path.levels.find((l) => l.branch);
  const branchKey = branchedLevel ? await resolveBranchKey(pathKey, userId, branchedLevel.branch!.fromLevelIndex) : null;
  return path.levels.map((l) => applyBranch(l, branchKey));
}

export async function resolveLevelForUser(pathKey: string, levelIndex: number, userId: string): Promise<PathLevelDef | undefined> {
  const level = getLevel(pathKey, levelIndex);
  if (!level || !level.branch) return level;
  const branchKey = await resolveBranchKey(pathKey, userId, level.branch.fromLevelIndex);
  return applyBranch(level, branchKey);
}
