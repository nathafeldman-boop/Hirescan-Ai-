// ── Assistant UrCecret (chatbot Mistral) ────────────────────────────────────
// Toute la logique serveur du chatbot : quotas par abonnement, prompt système,
// et l'appel à l'API Mistral. La clé n'est JAMAIS dans le code — elle vient de
// la variable d'environnement MISTRAL_API_KEY (à définir dans Vercel).

export type Tier = 'free' | 'starter' | 'plus' | 'premium';

// Quotas de messages PAR JOUR selon l'abonnement.
// starter (1,99€) = 5 · plus (5€) = 30 · premium = 50.
// Le palier GRATUIT n'est pas journalier : 5 messages PAR MOIS (découverte).
export const DAILY_LIMITS: Record<Exclude<Tier, 'free'>, number> = {
  starter: 5,
  plus: 30,
  premium: 50,
};
export const FREE_MONTHLY_LIMIT = 5;

export function dailyLimitFor(tier: string | undefined): number {
  return DAILY_LIMITS[(tier as Exclude<Tier, 'free'>)] ?? DAILY_LIMITS.starter;
}

// Jour courant au fuseau Europe/Paris, format "YYYY-MM-DD" — sert de clé de
// quota. Le quota se réinitialise à minuit, heure de Paris.
export function parisDay(now: Date = new Date()): string {
  return now.toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' }); // ex: 2026-07-17
}

// Mois courant à Paris, "YYYY-MM" — clé de quota du palier gratuit (5/mois).
// Réutilise la même table ChatUsage (le champ `day` stocke la clé, jour ou mois).
export function parisMonth(now: Date = new Date()): string {
  return parisDay(now).slice(0, 7); // ex: 2026-07
}

// Modèle Mistral économique — adapté à un assistant conversationnel court.
// mistral-small = bon rapport qualité/prix. On plafonne les tokens de réponse
// pour maîtriser le coût (rentabilité).
export const MISTRAL_MODEL = 'mistral-small-latest';
export const MAX_TOKENS = 600;
// On ne renvoie que les N derniers messages à l'API (contexte borné = coût borné).
export const MAX_HISTORY = 12;

// Le prompt système est désormais construit par requête (coach personnalisé) —
// voir lib/coach.ts (coachSystemPrompt + buildCoachContext). callMistral le
// reçoit en paramètre.

// Contenu multimodal (vision) — mistral-small-latest accepte du texte + des
// images dans le même message (parties de contenu, format identique à OpenAI).
// On ne construit ce format QUE pour le tour courant (voir /api/chat) : les
// images ne sont jamais réinjectées dans l'historique rechargé, pour ne pas
// alourdir chaque appel suivant en tokens/coût.
export type MistralContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: string };

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string | MistralContentPart[];
}

interface MistralResult {
  ok: boolean;
  reply?: string;
  error?: string;
  status?: number;
}

// Appelle l'API Mistral avec le prompt système (coach) + l'historique borné.
// Retourne la réponse de l'assistant, ou une erreur exploitable côté route.
export async function callMistral(system: string, history: ChatMessage[]): Promise<MistralResult> {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return { ok: false, error: 'not_configured', status: 503 };

  const messages = [
    { role: 'system' as const, content: system },
    ...history.slice(-MAX_HISTORY).map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages,
        max_tokens: MAX_TOKENS,
        temperature: 0.6,
      }),
    });

    if (!res.ok) {
      return { ok: false, error: 'mistral_error', status: res.status };
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) return { ok: false, error: 'empty', status: 502 };
    return { ok: true, reply };
  } catch {
    return { ok: false, error: 'network', status: 502 };
  }
}
