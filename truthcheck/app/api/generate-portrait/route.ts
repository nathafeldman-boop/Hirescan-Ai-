import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

const MISTRAL_KEY = process.env.MISTRAL_API_KEY ?? 'OZCrIA5rinqzqHzrbSnwqGowsYjo8vqs';

const ARCHETYPES: Record<string, string> = {
  INTJ: 'L\'Architecte', INTP: 'Le Logicien', ENTJ: 'Le Commandant', ENTP: 'Le Débatteur',
  INFJ: 'L\'Avocat', INFP: 'Le Médiateur', ENFJ: 'Le Protagoniste', ENFP: 'Le Visionnaire',
  ISTJ: 'Le Logisticien', ISFJ: 'Le Défenseur', ESTJ: 'Le Directeur', ESFJ: 'Le Consul',
  ISTP: 'Le Virtuose', ISFP: 'L\'Aventurier', ESTP: 'L\'Entrepreneur', ESFP: 'Le Performeur',
};

const QUIZ_LABELS: Record<string, string> = {
  infidelite: 'test infidélité', amoureux: 'test amoureux', 'vrais-amis': 'test amitié',
  orientation: 'test orientation', narcissique: 'test narcissisme', 'mon-ex': 'test ex',
  manipule: 'test manipulation', rompre: 'test rupture', jaloux: 'test jalousie',
  'relation-toxique': 'test relation toxique', crush: 'test crush', burnout: 'test burnout',
  depression: 'test dépression', 'vrai-amour': 'test vrai amour', personnalite: 'test MBTI',
};

function buildPrompt(quizSlug: string, score: number, typeCode?: string): string {
  if (quizSlug === 'personnalite' && typeCode && ARCHETYPES[typeCode]) {
    const archetype = ARCHETYPES[typeCode];
    return `Tu crées le texte d'un portrait viral TikTok/Instagram pour le type MBTI ${typeCode} (${archetype}).
Score au test UrCecret : ${score}%.
Génère en JSON strict (pas de markdown) :
{
  "hook": "phrase choc max 12 mots style TikTok (ex: Mon cerveau fonctionne différemment. La preuve.)",
  "archetype": "${archetype}",
  "description": "2 phrases percutantes sur ce type MBTI, poétiques et vraies, max 70 mots",
  "caption": "légende TikTok/Instagram max 140 caractères avec 2-3 émojis",
  "hashtags": "#MBTI #${typeCode} #personnalite #psychologie #urcecret #qui_je_suis #type_mbti #portrait"
}`;
  }
  const label = QUIZ_LABELS[quizSlug] ?? quizSlug;
  return `Tu crées le texte d'un portrait viral TikTok/Instagram. Résultat : ${score}% au ${label} sur UrCecret.
Génère en JSON strict (pas de markdown) :
{
  "hook": "phrase choc max 12 mots, mystérieuse ou provocatrice, style TikTok",
  "archetype": "surnom court et percutant pour ce score (ex: Le Traqueur d'indices, La Naïve Lucide...)",
  "description": "2 phrases percutantes sur ce que révèle ce score, max 70 mots",
  "caption": "légende TikTok/Instagram max 140 caractères avec 2-3 émojis",
  "hashtags": "#psychologie #revelations #quiz #urcecret #portrait #qui_je_suis #${quizSlug}"
}`;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`portrait:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

  const { quizSlug, score, typeCode } = await req.json() as { quizSlug: string; score: number; typeCode?: string };

  const prompt = buildPrompt(quizSlug, score, typeCode);

  try {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${MISTRAL_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.85,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) throw new Error(`Mistral ${res.status}`);
    const data = await res.json() as { choices?: { message?: { content?: string } }[] };
    const raw = data.choices?.[0]?.message?.content ?? '{}';
    let parsed: { hook?: string; archetype?: string; description?: string; caption?: string; hashtags?: string } = {};
    try { parsed = JSON.parse(raw); } catch { /* utilise les fallbacks ci-dessous */ }

    return NextResponse.json({
      hook:        parsed.hook        ?? 'Mon profil psychologique vient d\'être révélé.',
      archetype:   parsed.archetype   ?? (typeCode ? ARCHETYPES[typeCode] : 'Le Profil Rare'),
      description: parsed.description ?? 'Ce résultat en dit plus sur toi que tu ne le penses.',
      caption:     parsed.caption     ?? `J'ai fait le test UrCecret. Le résultat m'a surpris. 🔥`,
      hashtags:    parsed.hashtags    ?? '#urcecret #psychologie #portrait',
    });
  } catch {
    return NextResponse.json({
      hook: 'Mon profil psychologique vient d\'être révélé.',
      archetype: typeCode ? (ARCHETYPES[typeCode] ?? typeCode) : 'Le Profil Rare',
      description: 'Ce résultat révèle quelque chose de rare sur ta façon de penser et de ressentir.',
      caption: `J'ai fait le test UrCecret. Le résultat m'a surpris. 🔥`,
      hashtags: '#urcecret #psychologie #portrait #quiz',
    });
  }
}
