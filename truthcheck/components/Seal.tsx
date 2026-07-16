// Le sceau — motif signature « L'Oracle ». Un cercle gravé à la main façon
// astrolabe : 8 graduations (les 8 fonctions cognitives de Jung), un cercle
// intérieur, un point central. Utilisé sur le hero, la révélation du type,
// et en version réduite comme étiquette de famille. Trait fin, jamais rempli.
export default function Seal({
  size = 96,
  color = 'var(--gold)',
  strokeWidth = 1.2,
  spin = false,
  className = '',
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
  spin?: boolean;
  className?: string;
}) {
  const ticks = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 360) / 8;
    const rad = (angle * Math.PI) / 180;
    const rOuter = 46;
    const rInner = i % 2 === 0 ? 38 : 41;
    const x1 = 50 + rOuter * Math.sin(rad);
    const y1 = 50 - rOuter * Math.cos(rad);
    const x2 = 50 + rInner * Math.sin(rad);
    const y2 = 50 - rInner * Math.cos(rad);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
  });

  return (
    <svg
      className={`${spin ? 'ur-seal-turn' : ''} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      aria-hidden
    >
      <circle cx="50" cy="50" r="47" />
      <circle cx="50" cy="50" r="34" opacity="0.55" />
      {ticks}
      <circle cx="50" cy="50" r="2" fill={color} stroke="none" />
    </svg>
  );
}
