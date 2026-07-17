// ── Assistant UrCecret (chatbot Mistral) ────────────────────────────────────
// Toute la logique serveur du chatbot : quotas par abonnement, prompt système,
// et l'appel à l'API Mistral. La clé n'est JAMAIS dans le code — elle vient de
// la variable d'environnement MISTRAL_API_KEY (à définir dans Vercel).

export type Tier = 'free' | 'plus' | 'premium';

// Quotas de messages PAR JOUR selon l'abonnement.
// free = 5 · plus (5€) = 30 · premium (10€) = 50.
export const DAILY_LIMITS: Record<Tier, number> = {
  free: 5,
  plus: 30,
  premium: 50,
};

export function dailyLimitFor(tier: string | undefined): number {
  return DAILY_LIMITS[(tier as Tier)] ?? DAILY_LIMITS.free;
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

export const SYSTEM_PROMPT = `Tu es l'assistant d'UrCecret, un guide bienveillant et perspicace spécialisé dans la personnalité : le modèle des 16 types (MBTI) et les 8 fonctions cognitives de Carl Jung.

Ton rôle : aider la personne à mieux se comprendre — son fonctionnement, ses forces, ses angles morts, ses relations, ses choix de vie — à la lumière de son type de personnalité.

Style :
- Réponds toujours en français, sur un ton chaleureux, direct et concret. Tutoie la personne.
- Sois concis : quelques paragraphes courts maximum, pas de pavé. Va à l'essentiel.
- Appuie-toi sur les fonctions cognitives quand c'est pertinent, sans jargon inutile.

Règles importantes :
- Si tu ne connais pas le type MBTI de la personne, ne l'invente pas : demande-lui, ou propose-lui de passer le test UrCecret pour le découvrir.
- Tu n'es pas thérapeute ni médecin. Face à une détresse psychologique réelle (dépression, pensées suicidaires, danger), exprime de l'empathie et oriente clairement vers un professionnel de santé ou une ligne d'écoute.
- Reste dans ton domaine : personnalité, connaissance de soi, relations, développement personnel. Décline poliment ce qui en sort.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface MistralResult {
  ok: boolean;
  reply?: string;
  error?: string;
  status?: number;
}

// Appelle l'API Mistral avec l'historique + le prompt système. Retourne la
// réponse de l'assistant, ou une erreur exploitable côté route.
export async function callMistral(history: ChatMessage[]): Promise<MistralResult> {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return { ok: false, error: 'not_configured', status: 503 };

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
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
