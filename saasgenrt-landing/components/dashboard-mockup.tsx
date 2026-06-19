'use client'

import { motion } from 'framer-motion'

const ideas = [
  { name: 'AI Invoice Scanner', mrr: '$8.2K', score: 9.4, tag: 'Top', tagColor: 'purple', unlocked: true },
  { name: 'SaaS Monitoring Pro', mrr: '$5.1K', score: 8.8, tag: 'Bon', tagColor: 'green', unlocked: true },
  { name: 'Churn Predictor AI', mrr: '$4.7K', score: 8.5, tag: 'Bon', tagColor: 'green', unlocked: true },
  { name: '██████████████', mrr: '████', score: 0, tag: '', tagColor: '', unlocked: false },
  { name: '██████████████', mrr: '████', score: 0, tag: '', tagColor: '', unlocked: false },
  { name: '██████████████', mrr: '████', score: 0, tag: '', tagColor: '', unlocked: false },
]

const sidebarItems = [
  { label: 'Dashboard', icon: '⊞', active: false },
  { label: 'My Ideas', icon: '◈', active: true },
  { label: 'Analysis', icon: '◎', active: false },
  { label: 'Growth', icon: '↗', active: false },
  { label: 'Settings', icon: '⚙', active: false },
]

export function DashboardMockup() {
  return (
    /* perspective wrapper */
    <div style={{ perspective: '1400px', perspectiveOrigin: '50% 40%' }}>
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 18, rotateY: -20 }}
        animate={{ opacity: 1, y: 0, rotateX: 12, rotateY: -16 }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Floating animation wrapper */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          {/* ─── Back glow ─── */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: '-30px',
              background: 'radial-gradient(ellipse, rgba(109,40,217,0.55) 0%, rgba(109,40,217,0.2) 40%, transparent 70%)',
              borderRadius: '32px',
              zIndex: -1,
              filter: 'blur(8px)',
            }}
          />

          {/* ─── Window ─── */}
          <div
            style={{
              width: '540px',
              maxWidth: '100%',
              borderRadius: '18px',
              overflow: 'hidden',
              background: 'linear-gradient(160deg, #131228 0%, #0f0e22 50%, #0b0a1c 100%)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.12)',
            }}
          >
            {/* Title bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.025)',
              }}
            >
              <div style={{ display: 'flex', gap: '5px' }}>
                {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.85 }} />
                ))}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 18,
                  borderRadius: 5,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px',
                  gap: 5,
                  marginLeft: 12,
                }}
              >
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(124,58,237,0.7)' }} />
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)', fontFamily: 'monospace' }}>app.saasgenrt.com/ideas</div>
              </div>
            </div>

            {/* App body */}
            <div style={{ display: 'flex', height: 360 }}>

              {/* Sidebar */}
              <div
                style={{
                  width: 148,
                  flexShrink: 0,
                  borderRight: '1px solid rgba(255,255,255,0.05)',
                  padding: '12px 0',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ padding: '0 14px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(124,58,237,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: 'rgba(255,255,255,0.8)' }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>SaaSGenrt</span>
                  </div>
                </div>
                <div style={{ padding: '0 6px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {sidebarItems.map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '5px 8px',
                        borderRadius: 7,
                        background: item.active ? 'rgba(124,58,237,0.22)' : 'transparent',
                        border: item.active ? '1px solid rgba(124,58,237,0.28)' : '1px solid transparent',
                      }}
                    >
                      <span style={{ fontSize: 10, color: item.active ? '#a78bfa' : 'rgba(255,255,255,0.28)' }}>{item.icon}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 500, color: item.active ? '#c4b5fd' : 'rgba(255,255,255,0.38)' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
                {/* User */}
                <div style={{ marginTop: 'auto', padding: '0 14px 4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(124,58,237,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 8, color: 'white' }}>N</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>Natha</div>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)' }}>Free plan</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main */}
              <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Mes idées SaaS</div>
                    <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.32)' }}>10 idées • B2B SaaS</div>
                  </div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <div style={{ fontSize: 9, padding: '2px 8px', borderRadius: 99, background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.35)', color: '#c4b5fd', fontWeight: 500 }}>Filtrer</div>
                    <div style={{ fontSize: 9, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>Trier</div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
                  {[
                    { l: 'MRR Potentiel', v: '$24K', c: '#34d399', bg: 'rgba(52,211,153,0.1)', br: 'rgba(52,211,153,0.2)' },
                    { l: 'Idées Top', v: '3', c: '#a78bfa', bg: 'rgba(167,139,250,0.1)', br: 'rgba(167,139,250,0.2)' },
                    { l: 'Score Moyen', v: '8.9', c: '#60a5fa', bg: 'rgba(96,165,250,0.1)', br: 'rgba(96,165,250,0.2)' },
                  ].map((s) => (
                    <div key={s.l} style={{ background: s.bg, border: `1px solid ${s.br}`, borderRadius: 8, padding: '6px 8px' }}>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.38)', marginBottom: 2 }}>{s.l}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>

                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 64px 44px', gap: 4, padding: '0 8px', marginBottom: 4 }}>
                  {['IDÉE', 'MRR', 'SCORE', 'TAG'].map((h) => (
                    <span key={h} style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)', fontWeight: 600, letterSpacing: '0.05em' }}>{h}</span>
                  ))}
                </div>

                {/* Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflow: 'hidden' }}>
                  {ideas.map((idea, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 50px 64px 44px',
                        gap: 4,
                        alignItems: 'center',
                        padding: '6px 8px',
                        borderRadius: 8,
                        background: i === 0 ? 'rgba(124,58,237,0.16)' : idea.unlocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)',
                        border: i === 0 ? '1px solid rgba(124,58,237,0.28)' : idea.unlocked ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.025)',
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 500, color: idea.unlocked ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.12)', filter: idea.unlocked ? 'none' : 'blur(4px)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{idea.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: idea.unlocked ? '#34d399' : 'rgba(255,255,255,0.12)', filter: idea.unlocked ? 'none' : 'blur(4px)' }}>{idea.mrr}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {idea.unlocked ? (
                          <>
                            <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                              <div style={{ height: '100%', borderRadius: 99, width: `${idea.score * 10}%`, background: i === 0 ? '#a78bfa' : '#60a5fa' }} />
                            </div>
                            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', minWidth: 20, textAlign: 'right' }}>{idea.score}</span>
                          </>
                        ) : (
                          <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.04)' }} />
                        )}
                      </div>
                      <div>
                        {idea.unlocked ? (
                          <span style={{ fontSize: 8, fontWeight: 600, padding: '2px 6px', borderRadius: 5, background: idea.tagColor === 'purple' ? 'rgba(124,58,237,0.35)' : 'rgba(52,211,153,0.18)', color: idea.tagColor === 'purple' ? '#c4b5fd' : '#34d399' }}>
                            {idea.tag === 'Top' ? '🔥 Top' : '✓ Bon'}
                          </span>
                        ) : (
                          <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 5, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.18)' }}>🔒</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Unlock bar */}
                <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(109,40,217,0.12))', border: '1px solid rgba(124,58,237,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>7 idées verrouillées</div>
                    <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.38)' }}>Débloquer toutes les idées</div>
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: 'rgba(124,58,237,0.85)', color: 'white' }}>€9 →</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
