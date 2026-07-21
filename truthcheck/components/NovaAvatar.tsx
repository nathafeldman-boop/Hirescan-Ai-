// Nova — la mascotte du coach. Un petit esprit doré, chaleureux et souriant :
// on parle à « quelqu'un », pas à une IA. Pur SVG (léger, net à toutes tailles),
// dans la palette L'Oracle (or sur encre).
export default function NovaAvatar({ size = 40, glow = false }: { size?: number; glow?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
         style={glow ? { filter: 'drop-shadow(0 0 10px rgba(201,162,39,0.45))' } : undefined}>
      <defs>
        <radialGradient id="novaOrb" cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#F0D98A" />
          <stop offset="55%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#8F6F14" />
        </radialGradient>
      </defs>

      {/* Halo discret */}
      <circle cx="24" cy="25" r="19.5" fill="#C9A227" opacity="0.16" />

      {/* Corps : orbe-esprit avec une petite flamme au sommet */}
      <path
        d="M24 4.5c1.1 3.2 2.9 5 5.4 6.3A16 16 0 1 1 18.6 10.8c2.5-1.3 4.3-3.1 5.4-6.3Z"
        fill="url(#novaOrb)"
      />

      {/* Yeux fermés heureux (arcs) */}
      <path d="M16.5 25.5c1.5-2 4-2 5.5 0" stroke="#15121F" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M26 25.5c1.5-2 4-2 5.5 0" stroke="#15121F" strokeWidth="2.1" strokeLinecap="round" />

      {/* Joues */}
      <circle cx="15.4" cy="29.6" r="1.8" fill="#15121F" opacity="0.14" />
      <circle cx="32.6" cy="29.6" r="1.8" fill="#15121F" opacity="0.14" />

      {/* Sourire */}
      <path d="M20 31.5c2.4 2.6 5.6 2.6 8 0" stroke="#15121F" strokeWidth="2.1" strokeLinecap="round" />

      {/* Étincelle ✦ compagne */}
      <path d="M39.5 8.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" fill="#F0D98A" />
    </svg>
  );
}
