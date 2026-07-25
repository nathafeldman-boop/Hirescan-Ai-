// ── Tendances du journal émotionnel, vues par Nova ──────────────────────────
// À partir des dernières entrées (humeur/énergie/stress/note), Nova repère 2 à
// 4 tendances concrètes ("tu sembles plus positif les jours où...", "ton
// énergie baisse en fin de semaine"...) — jamais un résumé générique, toujours
// ancré dans les données réelles fournies. Même logique que les autres
// générateurs Nova : prompt JSON strict + parseur qui ne fait confiance à rien.

import { callMistral } from './chat';

export interface JournalEntryForInsights {
  day: string; // "YYYY-MM-DD"
  mood: number;
  energy: number;
  stress: number;
  note: string | null;
}

const WEEKDAY_FR = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

function formatEntriesForPrompt(entries: JournalEntryForInsights[]): string {
  return entries
    .map((e) => {
      const weekday = WEEKDAY_FR[new Date(e.day + 'T12:00:00').getDay()];
      const noteText = e.note ? ` — note : "${e.note}"` : '';
      return `${e.day} (${weekday}) : humeur ${e.mood}/5, énergie ${e.energy}/5, stress ${e.stress}/5${noteText}`;
    })
    .join('\n');
}

export function journalInsightsPrompt(entries: JournalEntryForInsights[]): string {
  return `Tu es Nova, le coach IA d'UrCecret. Voici le journal émotionnel récent d'un utilisateur (humeur/énergie/stress notés chaque jour sur 5, note libre optionnelle) :

${formatEntriesForPrompt(entries)}

Réponds UNIQUEMENT avec un objet JSON valide, RIEN d'autre (pas de markdown, pas de phrase avant/après), au format EXACT suivant :

{
  "insights": ["2 à 4 tendances concrètes observées dans CES données précises, 1 phrase courte chacune, à la 2e personne ('Tu sembles...', 'Ton énergie...')"]
}

RÈGLES :
- Base-toi UNIQUEMENT sur les données fournies — n'invente jamais un pattern qui n'y est pas. S'il n'y a pas assez de variation pour dire quelque chose de solide, dis une observation plus générale mais honnête (ex: "Ton humeur est restée stable ces derniers jours").
- Ton chaleureux, direct, jamais clinique ni moralisateur.
- Si des notes libres mentionnent des activités, événements ou personnes, tu peux t'en servir pour expliquer une tendance (ex: jours où une activité citée revient avec une humeur meilleure/pire).
- N'utilise JAMAIS de vocabulaire médical/clinique ("trouble", "dépression", "anxiété" au sens clinique).`;
}

export function parseJournalInsights(raw: string): string[] | null {
  let jsonText = raw.trim();
  const fenced = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) jsonText = fenced[1].trim();

  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch {
    return null;
  }
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.insights)) return null;

  const insights = d.insights
    .filter((x): x is string => typeof x === 'string' && !!x.trim())
    .map((x) => x.trim().slice(0, 220))
    .slice(0, 4);

  return insights.length > 0 ? insights : null;
}

export async function generateJournalInsights(entries: JournalEntryForInsights[]): Promise<string[] | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    let system = journalInsightsPrompt(entries);
    if (attempt > 0) {
      system += '\n\nRappel strict : ta réponse précédente n\'était pas du JSON valide. Réponds UNIQUEMENT avec l\'objet JSON demandé, sans aucun texte, markdown ou commentaire autour.';
    }
    const gen = await callMistral(system, [
      { role: 'user', content: 'Génère les tendances maintenant, au format JSON demandé, rien d\'autre.' },
    ], { maxTokens: 500, temperature: attempt === 0 ? 0.6 : 0.3 });
    const parsed = gen.ok && gen.reply ? parseJournalInsights(gen.reply) : null;
    if (parsed) return parsed;
  }
  return null;
}

// ── Résumé narratif d'une période (semaine/mois) ────────────────────────────
// Différent des "tendances" (liste de puces courtes) : un vrai petit texte de
// synthèse, comme un ami qui résume ta semaine — voir "résumer une période"
// dans la demande produit.
export function journalPeriodSummaryPrompt(entries: JournalEntryForInsights[], periodLabel: string): string {
  return `Tu es Nova, le coach IA d'UrCecret. Voici le journal émotionnel d'un utilisateur sur ${periodLabel} (humeur/énergie/stress sur 5, note libre optionnelle) :

${formatEntriesForPrompt(entries)}

Réponds UNIQUEMENT avec un objet JSON valide, RIEN d'autre (pas de markdown, pas de phrase avant/après), au format EXACT suivant :

{
  "summary": "3-4 phrases qui résument ${periodLabel} comme le ferait une amie qui a suivi son journal — évolution de l'humeur, moments marquants s'ils ressortent des notes, ton chaleureux"
}

RÈGLES :
- Base-toi UNIQUEMENT sur les données fournies.
- Ton chaleureux, jamais clinique ni moralisateur.
- N'utilise JAMAIS de vocabulaire médical/clinique.`;
}

export function parseJournalPeriodSummary(raw: string): string | null {
  let jsonText = raw.trim();
  const fenced = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) jsonText = fenced[1].trim();

  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch {
    return null;
  }
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  const summary = typeof d.summary === 'string' && d.summary.trim() ? d.summary.trim().slice(0, 700) : null;
  return summary;
}

export async function generateJournalPeriodSummary(
  entries: JournalEntryForInsights[],
  periodLabel: string,
): Promise<string | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    let system = journalPeriodSummaryPrompt(entries, periodLabel);
    if (attempt > 0) {
      system += '\n\nRappel strict : ta réponse précédente n\'était pas du JSON valide. Réponds UNIQUEMENT avec l\'objet JSON demandé, sans aucun texte, markdown ou commentaire autour.';
    }
    const gen = await callMistral(system, [
      { role: 'user', content: 'Génère le résumé maintenant, au format JSON demandé, rien d\'autre.' },
    ], { maxTokens: 500, temperature: attempt === 0 ? 0.6 : 0.3 });
    const parsed = gen.ok && gen.reply ? parseJournalPeriodSummary(gen.reply) : null;
    if (parsed) return parsed;
  }
  return null;
}
