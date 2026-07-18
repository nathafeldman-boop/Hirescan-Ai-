// Décor cosmique en SVG — champ d'étoiles + constellations + astrolabe + lune,
// en or sur fond encre. Pur SVG (aucune image, ~2 Ko), déterministe, léger.
// À poser en fond (absolute) d'une section sombre pour une ambiance mystique.
const GOLD = '#C9A227';

// Étoiles déterministes (pas de Math.random → stable au rendu serveur).
const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 73 + (i % 5) * 11) % 400,
  y: (i * i * 13 + i * 37) % 230,
  r: 0.5 + (i % 3) * 0.45,
  o: 0.18 + (i % 4) * 0.16,
}));

// Deux petites constellations (points en coord 0-400 × 0-240).
const CONSTELLATIONS: [number, number][][] = [
  [[40, 40], [72, 66], [96, 40], [128, 78], [150, 52]],
  [[300, 170], [332, 150], [356, 186], [388, 160]],
];

export default function CosmicBackdrop({ opacity = 1 }: { opacity?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden style={{ opacity }}>
      <svg width="100%" height="100%" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" fill="none">
        {/* Astrolabe fantôme en fond */}
        <g stroke={GOLD} strokeWidth="0.6" opacity="0.14">
          <circle cx="330" cy="60" r="60" />
          <circle cx="330" cy="60" r="44" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return <line key={i} x1={330 + 60 * Math.sin(a)} y1={60 - 60 * Math.cos(a)} x2={330 + 52 * Math.sin(a)} y2={60 - 52 * Math.cos(a)} />;
          })}
        </g>

        {/* Constellations */}
        <g stroke={GOLD} strokeWidth="0.5" opacity="0.3">
          {CONSTELLATIONS.map((pts, i) => (
            <polyline key={i} points={pts.map((p) => p.join(',')).join(' ')} fill="none" />
          ))}
        </g>
        <g fill={GOLD} opacity="0.6">
          {CONSTELLATIONS.flat().map((p, i) => (<circle key={i} cx={p[0]} cy={p[1]} r="1.3" />))}
        </g>

        {/* Champ d'étoiles */}
        <g fill="#FAF6EC">
          {STARS.map((s, i) => (<circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />))}
        </g>

        {/* Lune dorée en croissant */}
        <g opacity="0.9">
          <circle cx="60" cy="185" r="16" fill={GOLD} opacity="0.14" />
          <path d="M60 171 a14 14 0 1 0 0 28 a10 10 0 1 1 0 -28 z" fill={GOLD} opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
