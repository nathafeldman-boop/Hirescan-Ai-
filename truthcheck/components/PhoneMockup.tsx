// Cadre de téléphone en CSS pur (pas d'image) — sert à montrer les démos
// "gameplay" de chaque feature sur la landing dans un contexte mobile
// crédible. `dark` change la couleur du cadre pour rester cohérent avec le
// fond de l'écran affiché à l'intérieur.
export default function PhoneMockup({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className="relative mx-auto"
      style={{
        width: 252,
        height: 516,
        padding: 12,
        borderRadius: 42,
        background: dark ? '#0a0705' : '#1a1611',
        boxShadow: '0 24px 60px rgba(21,18,31,0.28), 0 2px 8px rgba(21,18,31,0.12)',
      }}
    >
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ borderRadius: 30, background: dark ? '#0a0705' : 'var(--paper)' }}
      >
        {/* Encoche */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20" style={{ width: 84, height: 20, background: dark ? '#0a0705' : '#1a1611', borderBottomLeftRadius: 14, borderBottomRightRadius: 14 }} />
        <div className="absolute inset-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
