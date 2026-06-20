export const dynamic = 'force-dynamic';

const scripts = [
  {
    type: 'MBTI',
    hook: "J'ai fait un test de personnalité et le résultat m'a choqué 😳",
    script: `[Montre ton résultat MBTI à l'écran]
"Donc j'ai fait le test MBTI sur UrCecret et je suis [TON TYPE]."
"Ce que ça dit de moi : [lit 1-2 traits]"
"Honnêtement... c'est trop précis 😭"
"Teste le tien → urcecret.site (lien en bio)"`,
    duration: '15-20s',
    format: 'Face cam + screen share',
    hashtags: '#MBTI #TestPersonnalité #INFJ #ENFP #Personnalité #UrCecret',
  },
  {
    type: 'MBTI Type Reveal',
    hook: 'POV : tu découvres enfin pourquoi tu es comme ça',
    script: `[Text on screen : "Mon type MBTI vient de m'expliquer toute ma vie"]
[Montre le résultat]
"[TYPE] - et ça explique TOUT"
"Pourquoi je suis [trait 1], [trait 2], [trait 3]"
"Fais le test toi aussi → lien en bio"`,
    duration: '20-30s',
    format: 'POV texte + résultat',
    hashtags: '#MBTI #Personnalité #DéveloppementPersonnel #Quiz',
  },
  {
    type: 'Quiz Vérité',
    hook: 'Ce quiz m\'a dit une vérité que personne osait me dire 🤫',
    script: `[Mystérieux, voix basse]
"Il y a un quiz sur UrCecret qui te dit des choses que tes amis te cacheront toujours."
"Est-ce que tu es dans une relation toxique ?"
"Est-ce que tu es vraiment amoureux(se) ?"
"Est-ce que tu risques le burnout ?"
"J'ai fait le quiz [NOM] et le résultat était..."
[Pause dramatique]
"...trop vrai pour être ignoré."
"lien en bio si t'as le courage"`,
    duration: '25-35s',
    format: 'Voix off + texte mystère',
    hashtags: '#QuizVérité #RelationToxique #Anonyme #Vérité',
  },
  {
    type: 'Astro crossover',
    hook: 'Ton signe astro vs ton type MBTI — lequel est le plus précis ? 🌙',
    script: `"Ok j'ai testé les deux."
"Mon signe : [SIGNE] → ça dit [caractéristique astro]"
"Mon MBTI : [TYPE] → ça dit [caractéristique MBTI]"
"Et honnêtement... le MBTI m'a mieux cerné 😅"
"Teste le tien sur urcecret.site → lien en bio"`,
    duration: '20-25s',
    format: 'Comparaison côte à côte',
    hashtags: '#Astrologie #MBTI #Personnalité #Zodiaque',
  },
  {
    type: 'Duo Mode',
    hook: 'J\'ai fait faire le quiz à mon(ma) meilleur(e) ami(e) et voilà ce qu\'il/elle pense vraiment de moi 💀',
    script: `"Il y a un mode sur UrCecret où tu réponds aux mêmes questions que quelqu'un d'autre..."
"...et à la fin vous voyez VOS DEUX réponses côte à côte 💀"
"J'ai fait ça avec [mon pote / ma copine / mon crush]"
"Question 4 m'a achevé(e)"
"Lien en bio — faites-le avec quelqu'un que vous connaissez vraiment"`,
    duration: '25-30s',
    format: 'Storytelling + réaction',
    hashtags: '#ModeDuo #Quiz #Amis #Couple #UrCecret',
  },
  {
    type: 'Thumbnail hook',
    hook: '[Image : résultat "Relation toxique : 87%" avec emoji choqué]',
    script: `"87% de probabilité que je suis dans une relation toxique."
[Silence]
"C'est pas moi qui le dis — c'est le quiz UrCecret."
"J'ai répondu honnêtement et..."
"...ça m'a forcé à m'interroger sur des trucs que j'ignorais."
"Test gratuit, résultat anonyme → lien en bio"`,
    duration: '20s',
    format: 'Score choc en thumbnail',
    hashtags: '#RelationToxique #VéritéDure #Quiz #Anonyme',
  },
];

const S = {
  page: { maxWidth: 800, margin: '0 auto', padding: '32px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' } as React.CSSProperties,
  h1: { fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 4 } as React.CSSProperties,
  sub: { color: '#52525b', fontSize: 13, marginTop: 0, marginBottom: 32 } as React.CSSProperties,
  card: { background: '#18181b', border: '1px solid #27272a', borderRadius: 14, padding: '20px 24px', marginBottom: 20 } as React.CSSProperties,
  badge: { display: 'inline-block', background: 'rgba(209,125,82,0.15)', color: '#d17d52', border: '1px solid rgba(209,125,82,0.3)', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700, marginBottom: 10 } as React.CSSProperties,
  hook: { fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 14 } as React.CSSProperties,
  label: { fontSize: 11, fontWeight: 700, color: '#52525b', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 },
  pre: { background: '#09090b', border: '1px solid #27272a', borderRadius: 8, padding: '12px 16px', color: '#e4e4e7', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap' as const, marginBottom: 14 },
  row: { display: 'flex', gap: 16, flexWrap: 'wrap' as const, marginBottom: 12 },
  chip: { background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a', borderRadius: 8, padding: '4px 10px', fontSize: 12, color: '#a1a1aa' },
  hashtags: { fontSize: 12, color: '#b07d2b', marginBottom: 0 },
};

export default function ContentKitPage() {
  return (
    <div style={S.page}>
      <h1 style={S.h1}>Kit contenu TikTok / Reels</h1>
      <p style={S.sub}>
        {scripts.length} scripts prêts à poster — copie, adapte, publie.
      </p>

      {scripts.map((s, i) => (
        <div key={i} style={S.card}>
          <span style={S.badge}>{s.type}</span>
          <p style={S.hook}>🎬 {s.hook}</p>

          <p style={S.label}>Script</p>
          <pre style={S.pre}>{s.script}</pre>

          <div style={S.row}>
            <div>
              <p style={S.label}>Durée</p>
              <span style={S.chip}>{s.duration}</span>
            </div>
            <div>
              <p style={S.label}>Format</p>
              <span style={S.chip}>{s.format}</span>
            </div>
          </div>

          <p style={S.label}>Hashtags</p>
          <p style={S.hashtags}>{s.hashtags}</p>
        </div>
      ))}

      <div style={{ ...S.card, background: 'rgba(209,125,82,0.05)', border: '1px solid rgba(209,125,82,0.2)' }}>
        <p style={{ margin: 0, color: '#d17d52', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>💡 Tips performance</p>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#71717a', fontSize: 14, lineHeight: 2.2 }}>
          <li>Les 2 premières secondes = tout. Le hook doit choquer ou intriguer</li>
          <li>Montre ton vrai résultat — l&apos;authenticité performe mieux que le scripté</li>
          <li>Poster entre 18h et 21h (heure FR) = meilleure portée</li>
          <li>1 vidéo par jour pendant 7 jours = algorithme qui décolle</li>
          <li>Réponds aux commentaires les 30 premières minutes — boost massif</li>
        </ul>
      </div>
    </div>
  );
}
