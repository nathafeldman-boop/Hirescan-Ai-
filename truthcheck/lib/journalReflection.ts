// ── Réflexion de Elio après chaque entrée du journal ─────────────────────────
// Volontairement DÉTERMINISTE (pas d'appel Mistral) : c'est le moment qui doit
// être INSTANTANÉ (pas de "Elio réfléchit…" après avoir tapé "Enregistrer") —
// et c'est la partie "premières analyses simples" du palier gratuit, voir
// lib/journalAccess.ts pour la partie IA (tendances/résumés), elle réservée
// aux abonnés/essai. Fonctions pures, importables côté client comme serveur.

import { goalJournalClause } from './onboardingGoalCopy';

export interface ReflectionEntry { mood: number; energy: number; stress: number }

export function simpleReflection(mood: number, energy: number, stress: number): string {
  if (mood >= 4 && stress <= 2) return 'Belle journée — savoure-la, elle compte.';
  if (mood >= 4) return 'Une bonne journée, même avec un peu de tension. Bien joué.';
  if (mood === 3 && energy <= 2) return 'Journée correcte mais fatigante. Pense à souffler un peu.';
  if (mood === 3) return 'Une journée dans la moyenne — rien à forcer, continue comme ça.';
  if (mood <= 2 && stress >= 4) return 'Journée difficile et sous tension. Sois indulgent avec toi-même ce soir.';
  if (mood <= 2) return "Journée difficile. C'est noté — demain est un autre jour.";
  return 'Journée notée. Reviens demain pour continuer ton suivi.';
}

// Comparaison au jour précédent — la "réponse magnifique" attendue juste après
// l'enregistrement. Retourne null si la veille n'a pas d'entrée ou si rien de
// notable ne ressort (le fallback simpleReflection() prend alors le relais).
export function compareToYesterday(today: ReflectionEntry, yesterday: ReflectionEntry | null): string | null {
  if (!yesterday) return null;

  const moodDelta = today.mood - yesterday.mood;
  const stressDelta = today.stress - yesterday.stress;
  const energyDelta = today.energy - yesterday.energy;

  if (stressDelta <= -2) return 'Tu sembles beaucoup plus serein aujourd\'hui qu\'hier.';
  if (moodDelta >= 2) return 'Ton humeur a nettement remonté par rapport à hier — bien joué.';
  if (energyDelta >= 2) return 'Ton énergie a fait un vrai bond depuis hier.';
  if (stressDelta >= 2) return 'Tu sembles plus tendu qu\'hier — prends un moment pour toi.';
  if (moodDelta <= -2) return 'Journée plus difficile qu\'hier. Ça arrive, sois indulgent avec toi-même.';
  if (energyDelta <= -2) return 'Ton énergie est nettement plus basse qu\'hier.';

  return null;
}

export function dailyReaction(today: ReflectionEntry, yesterday: ReflectionEntry | null): string {
  return compareToYesterday(today, yesterday) ?? simpleReflection(today.mood, today.energy, today.stress);
}

// ── Réponse d'Elio à la toute première entrée d'un compte ───────────────────
// C'est LE moment charnière du nouveau funnel : avant même de parler profil
// ou abonnement, l'utilisateur doit sentir qu'on l'a entendu. Déterministe et
// par palier d'humeur (pas de lecture du texte de la note — voir le
// commentaire en tête de fichier sur l'instantanéité), mais le ton change
// vraiment selon comment la personne se sent, pas une formule générique.
export function firstEntryReply(mood: number, firstName: string | null, goal?: string | null): string {
  const name = firstName ? `, ${firstName}` : '';
  const base = (() => {
    if (mood >= 5) return `J'aime commencer sur une note aussi positive${name}. Je vais apprendre à te connaître, jour après jour — merci de m'avoir dit ça.`;
    if (mood === 4) return `Merci de me l'avoir partagé${name}. C'est un bon point de départ — je suis là pour la suite, chaque jour.`;
    if (mood === 3) return `Merci${name}. Une journée neutre, c'est déjà une vraie réponse — c'est exactement ce dont j'ai besoin pour commencer à te connaître.`;
    if (mood === 2) return `Merci de me le dire${name} — même dans les journées moins faciles, je suis là. On continue ensemble, un jour à la fois.`;
    return `Je suis désolé que ce soit difficile aujourd'hui${name}. Merci de me l'avoir confié — c'est déjà beaucoup. Je serai là chaque jour, à cette même heure.`;
  })();
  // Relie l'émotion du jour à l'objectif déclaré à l'inscription (voir
  // lib/onboardingGoalCopy.ts) — LE moment où l'appli doit sembler avoir
  // compris pourquoi la personne est venue, pas juste comment elle va.
  const clause = goalJournalClause(goal, mood);
  return clause ? `${base} ${clause}` : base;
}
