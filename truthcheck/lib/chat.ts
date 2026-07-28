// ── Assistant UrCecret (chatbot Mistral) ────────────────────────────────────
// Toute la logique serveur du chatbot : quotas par abonnement, prompt système,
// et l'appel à l'API Mistral. La clé n'est JAMAIS dans le code — elle vient de
// la variable d'environnement MISTRAL_API_KEY (à définir dans Vercel).

export type Tier = 'free' | 'starter' | 'plus' | 'premium';

// ── Grille de quotas, un seul endroit à modifier ────────────────────────────
// Toute nouvelle feature consommant le quota Nova (chat, créateur de test,
// analyse de conversation, et les prochaines : journal, compatibilité...)
// DOIT lire ces mêmes constantes plutôt que d'inventer sa propre limite —
// un "message" a un sens unique et cohérent dans toute l'app.
//
// Correspondance avec le langage produit ("Free / Premium 1 / 2 / Max") :
//   free    = Free       — 3 messages PAR JOUR (générique, sans le profil complet)
//   starter = Premium 1  — 5 messages/jour  (1,99€/mois)
//   plus    = Premium 2  — 30 messages/jour (5€/mois)
//   premium = Premium Max — 50 messages/jour (9,99€/mois ou 29,99€/an)
// Les noms internes (starter/plus/premium) restent inchangés — ce sont ceux
// utilisés par Stripe/webhook/DB ; les renommer serait un risque inutile pour
// un simple changement d'étiquette côté produit.
//
// FREE_DAILY_LIMIT était FREE_MONTHLY_LIMIT (5/MOIS) — un chiffre qui
// contredisait frontalement la promesse "coach disponible 24/7" : personne ne
// construit d'attachement à une relation qu'on ne peut toucher que 5 fois par
// mois. Passer sur une base quotidienne (même modeste) laisse le temps à la
// relation de s'installer AVANT toute question d'abonnement — voir la
// réflexion produit du 28/07 sur la rétention avant la conversion.
export const DAILY_LIMITS: Record<Exclude<Tier, 'free'>, number> = {
  starter: 5,
  plus: 30,
  premium: 50,
};
export const FREE_DAILY_LIMIT = 3;

export function dailyLimitFor(tier: string | undefined): number {
  return DAILY_LIMITS[(tier as Exclude<Tier, 'free'>)] ?? DAILY_LIMITS.starter;
}

// Jour courant au fuseau Europe/Paris, format "YYYY-MM-DD" — sert de clé de
// quota. Le quota se réinitialise à minuit, heure de Paris.
export function parisDay(now: Date = new Date()): string {
  return now.toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' }); // ex: 2026-07-17
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
// `opts` permet d'ajuster max_tokens/température pour des appels non-chat
// (ex: génération de quiz JSON, qui a besoin de plus de tokens en sortie).
export async function callMistral(
  system: string,
  history: ChatMessage[],
  opts?: { maxTokens?: number; temperature?: number },
): Promise<MistralResult> {
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
        max_tokens: opts?.maxTokens ?? MAX_TOKENS,
        temperature: opts?.temperature ?? 0.6,
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
