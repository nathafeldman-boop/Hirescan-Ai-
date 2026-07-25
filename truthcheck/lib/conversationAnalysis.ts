// ── Analyse de conversation par Nova ─────────────────────────────────────────
// Feature phare (voir demande produit) : l'utilisateur colle une conversation
// et/ou envoie une capture d'écran, Nova l'analyse en JSON structuré via
// Mistral (texte + vision, même modèle que le coach — voir lib/chat.ts).
// Même logique que lib/customQuiz.ts : un prompt qui force un format JSON
// strict, un parseur qui valide avant de faire confiance à quoi que ce soit.

import { callMistral, ChatMessage } from './chat';

export interface ConversationAnalysisResult {
  personality: string;
  attachmentStyle: string;
  manipulationFlags: string;
  greenFlags: string[];
  redFlags: string[];
  compatibility: string;
  emotionalLanguage: string;
  advice: string;
}

const SAFETY_NOTE =
  "Cette analyse est générée automatiquement à visée ludique et de réflexion personnelle — ce n'est PAS un diagnostic psychologique. En cas de doute réel sur une relation (emprise, violence), parle à un professionnel ou une association spécialisée.";

export function conversationAnalysisPrompt(): string {
  return `Tu es Nova, le coach IA d'UrCecret. On te montre un extrait de conversation (texte collé et/ou capture d'écran) entre l'utilisateur et une autre personne (ami, date, ex, partenaire...). Analyse cette conversation et réponds UNIQUEMENT avec un objet JSON valide, RIEN d'autre (pas de markdown, pas de phrase avant/après), au format EXACT suivant :

{
  "personality": "2-3 phrases sur la personnalité probable de L'AUTRE personne d'après son style d'écriture (ton, vocabulaire, rythme des réponses)",
  "attachmentStyle": "1-2 phrases sur le style d'attachement qui ressort de la conversation (sécure, anxieux, évitant, désorganisé) — reste nuancé, ce n'est qu'une conversation",
  "manipulationFlags": "1-2 phrases honnêtes : y a-t-il des signes de manipulation, culpabilisation, gaslighting ? Si rien de notable, dis-le clairement plutôt que d'en inventer",
  "greenFlags": ["2 à 4 signes positifs concrets observés dans la conversation, courts (1 phrase max chacun)"],
  "redFlags": ["0 à 4 signes qui interpellent, courts (1 phrase max chacun) — tableau vide si vraiment rien à signaler, ne force jamais un red flag"],
  "compatibility": "2-3 phrases sur la dynamique relationnelle qui se dessine (équilibre, réciprocité, qui investit le plus)",
  "emotionalLanguage": "1-2 phrases sur comment chacun exprime ses émotions dans l'échange",
  "advice": "2-3 phrases de conseil concret et actionnable pour l'utilisateur, orienté vers CETTE situation précise"
}

RÈGLES :
- Ton chaleureux, direct, jamais moralisateur. Tu parles à un(e) ami(e), pas un rapport clinique.
- Ne révèle jamais l'identité réelle de qui que ce soit, ne fais aucune supposition sur des infos non présentes dans la conversation.
- Si la conversation est trop courte ou ambiguë pour juger un point, dis-le honnêtement au lieu d'inventer ("pas assez d'échange pour juger ça").
- N'utilise JAMAIS de vocabulaire clinique/diagnostic ("trouble", "pathologie", "trouble de la personnalité") — reste dans le registre "observation, ressenti", jamais médical.
- Si la conversation montre des signes clairs de danger réel (menaces, violence, emprise sévère), dis-le sans détour dans "manipulationFlags" et oriente vers de l'aide professionnelle dans "advice".`;
}

export function parseConversationAnalysis(raw: string): ConversationAnalysisResult | null {
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

  const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, 600) : null);
  const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && !!x.trim()).map((x) => x.slice(0, 200)).slice(0, 6) : null);

  const personality = str(d.personality);
  const attachmentStyle = str(d.attachmentStyle);
  const manipulationFlags = str(d.manipulationFlags);
  const greenFlags = arr(d.greenFlags);
  const redFlags = arr(d.redFlags);
  const compatibility = str(d.compatibility);
  const emotionalLanguage = str(d.emotionalLanguage);
  const advice = str(d.advice);

  if (!personality || !attachmentStyle || !manipulationFlags || !greenFlags || !redFlags || !compatibility || !emotionalLanguage || !advice) {
    return null;
  }

  return { personality, attachmentStyle, manipulationFlags, greenFlags, redFlags, compatibility, emotionalLanguage, advice };
}

export function conversationAnalysisDisclaimer(): string {
  return SAFETY_NOTE;
}

// Génère l'analyse avec 1 retry (prompt renforcé) si le modèle dévie du JSON
// attendu au 1er essai — même approche que generateQuiz() dans customQuiz.ts.
export async function generateConversationAnalysis(
  text: string,
  imageDataUri: string | null,
): Promise<ConversationAnalysisResult | null> {
  const userContent: ChatMessage['content'] = imageDataUri
    ? [
        { type: 'text', text: text || 'Voici la capture d\'écran de la conversation à analyser.' },
        { type: 'image_url', image_url: imageDataUri },
      ]
    : text;

  for (let attempt = 0; attempt < 2; attempt++) {
    const system = attempt === 0
      ? conversationAnalysisPrompt()
      : `${conversationAnalysisPrompt()}\n\nRappel strict : ta réponse précédente n'était pas du JSON valide. Réponds UNIQUEMENT avec l'objet JSON demandé, sans aucun texte, markdown ou commentaire autour.`;
    const gen = await callMistral(system, [{ role: 'user', content: userContent }], {
      maxTokens: 1200,
      temperature: attempt === 0 ? 0.6 : 0.3,
    });
    const parsed = gen.ok && gen.reply ? parseConversationAnalysis(gen.reply) : null;
    if (parsed) return parsed;
  }
  return null;
}
