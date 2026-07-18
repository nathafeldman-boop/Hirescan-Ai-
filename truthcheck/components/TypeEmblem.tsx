// Emblème stylé par type MBTI — médaillon SVG (anneau + graduations façon
// sceau, teinté à la couleur du type) avec l'emoji au centre. Léger, cohérent,
// scalable — 16 "logos" qui chargent instantanément. Données pures, sûr côté
// client.
export default function TypeEmblem({
  emoji,
  accentColor,
  size = 72,
}: {
  emoji: string;
  accentColor: string;
  size?: number;
}) {
  const ticks = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180;
    const rO = 46, rI = i % 2 === 0 ? 38 : 41;
    return { x1: 50 + rO * Math.sin(a), y1: 50 - rO * Math.cos(a), x2: 50 + rI * Math.sin(a), y2: 50 - rI * Math.cos(a) };
  });
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={accentColor} strokeWidth={1.4} aria-hidden>
        <circle cx="50" cy="50" r="47" fill={`${accentColor}14`} />
        <circle cx="50" cy="50" r="47" />
        <circle cx="50" cy="50" r="34" opacity="0.4" />
        {ticks.map((k, i) => (<line key={i} x1={k.x1} y1={k.y1} x2={k.x2} y2={k.y2} opacity="0.6" />))}
      </svg>
      <span className="absolute" style={{ fontSize: size * 0.4, lineHeight: 1 }}>{emoji}</span>
    </div>
  );
}
