// Elio — le compagnon de développement personnel d'UrCecret. Pas un robot,
// pas une mascotte enfantine : une présence lumineuse et calme, pensée pour
// l'introspection plutôt que pour amuser. Un orbe de lumière chaude (or) qui
// se fond dans un halo plus profond (violet/bleu nuit) — aucun trait de
// visage, pour rester premium et adulte. `speaking` ajoute une respiration
// plus marquée pendant qu'Elio répond (voir .elio-avatar-idle/-speaking dans
// globals.css pour les animations, respectueuses de prefers-reduced-motion).
export default function ElioAvatar({
  size = 40,
  glow = false,
  speaking = false,
}: {
  size?: number;
  glow?: boolean;
  speaking?: boolean;
}) {
  return (
    <span
      className={`elio-avatar ${speaking ? 'elio-avatar-speaking' : 'elio-avatar-idle'}`}
      style={{ display: 'inline-flex', width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
           style={glow ? { filter: 'drop-shadow(0 0 10px rgba(201,162,39,0.4)) drop-shadow(0 0 18px rgba(107,63,82,0.25))' } : undefined}>
        <defs>
          <radialGradient id="elioCore" cx="42%" cy="36%" r="70%">
            <stop offset="0%" stopColor="#FBEAB8" />
            <stop offset="45%" stopColor="#E8B94D" />
            <stop offset="100%" stopColor="#C9A227" />
          </radialGradient>
          <radialGradient id="elioHalo" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#6B3F52" stopOpacity="0" />
            <stop offset="100%" stopColor="#35506B" stopOpacity="0.35" />
          </radialGradient>
        </defs>

        {/* Halo profond — violet/bleu nuit, très doux */}
        <circle cx="24" cy="24" r="23" fill="url(#elioHalo)" />

        {/* Cœur lumineux — chaud, sans visage */}
        <circle cx="24" cy="24" r="14" fill="url(#elioCore)" />

        {/* Reflet — donne du volume, jamais un œil */}
        <ellipse cx="19.5" cy="18.5" rx="4.2" ry="2.6" fill="#FFFDF3" opacity="0.55" />

        {/* Étincelle compagne, comme un instant de clarté */}
        <path d="M38 9l1.1 2.8 2.8 1.1-2.8 1.1L38 17l-1.1-2.8-2.8-1.1 2.8-1.1Z" fill="#F0D98A" opacity="0.9" />
      </svg>
    </span>
  );
}
