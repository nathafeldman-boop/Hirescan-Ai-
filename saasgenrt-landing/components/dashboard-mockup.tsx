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
  { label: 'Dashboard', icon: '⬡', active: false },
  { label: 'My Ideas', icon: '◈', active: true },
  { label: 'Analysis', icon: '◎', active: false },
  { label: 'Growth', icon: '↗', active: false },
  { label: 'Settings', icon: '⚙', active: false },
]

export function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
      className="relative"
      style={{ perspective: '1200px' }}
    >
      {/* Outer glow */}
      <div className="absolute inset-0 bg-brand-600/20 rounded-2xl blur-[50px] scale-95 -z-10" />
      <div className="absolute inset-0 bg-brand-600/8 rounded-2xl blur-[80px] scale-75 -z-10" />

      {/* Dashboard window */}
      <div
        className="relative w-[520px] max-w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/60"
        style={{
          transform: 'rotateX(6deg) rotateY(-10deg) rotateZ(1.5deg)',
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(145deg, #111120 0%, #0d0c1d 50%, #0a0918 100%)',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        {/* Titlebar */}
        <div
          className="flex items-center gap-3 px-4 py-2.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div
            className="flex-1 rounded-md h-[18px] mx-4 flex items-center px-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-2 h-2 rounded-full bg-brand-600/60 mr-1.5" />
            <div className="text-white/25 text-[9px]">app.saasgenrt.com/ideas</div>
          </div>
        </div>

        {/* App layout */}
        <div className="flex" style={{ height: '340px' }}>
          {/* Sidebar */}
          <div
            className="w-[150px] flex-shrink-0 flex flex-col py-3"
            style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="px-4 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-brand-600/70 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-sm bg-white/80" />
                </div>
                <span className="text-white/80 text-[11px] font-semibold">SaaSGenrt</span>
              </div>
            </div>
            <div className="px-2 space-y-0.5">
              {sidebarItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-2 py-[5px] rounded-md"
                  style={{
                    background: item.active ? 'rgba(124,58,237,0.25)' : 'transparent',
                    border: item.active ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                  }}
                >
                  <span
                    className="text-[11px]"
                    style={{ color: item.active ? '#a78bfa' : 'rgba(255,255,255,0.3)' }}
                  >
                    {item.icon}
                  </span>
                  <span
                    className="text-[10.5px] font-medium"
                    style={{ color: item.active ? '#c4b5fd' : 'rgba(255,255,255,0.4)' }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            {/* User avatar bottom */}
            <div className="mt-auto px-4 pb-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-600/60 flex items-center justify-center">
                  <span className="text-[8px] text-white">N</span>
                </div>
                <div>
                  <div className="text-white/50 text-[9px]">Natha</div>
                  <div className="text-white/25 text-[8px]">Free plan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col p-3 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <div className="text-white text-[12px] font-semibold">Mes idées SaaS</div>
                <div className="text-white/35 text-[10px]">10 idées générées • Secteur: B2B SaaS</div>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="text-[9px] px-2 py-0.5 rounded-full font-medium text-brand-300"
                  style={{ background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.3)' }}
                >
                  Filtrer
                </div>
                <div
                  className="text-[9px] px-2 py-0.5 rounded-full font-medium text-white/50"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Trier
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
              {[
                { label: 'MRR Potentiel', value: '$24K', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
                { label: 'Idées Top', value: '3', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
                { label: 'Score Moyen', value: '8.9', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg p-2"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                >
                  <div className="text-white/40 text-[8.5px] mb-0.5">{s.label}</div>
                  <div className="text-[13px] font-bold" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Table header */}
            <div
              className="grid gap-1 px-2 mb-1"
              style={{ gridTemplateColumns: '1fr 52px 60px 44px' }}
            >
              {['IDÉE', 'MRR', 'SCORE', 'TAG'].map((h) => (
                <span key={h} className="text-white/25 text-[8px] font-semibold tracking-wide">{h}</span>
              ))}
            </div>

            {/* Ideas rows */}
            <div className="space-y-1 flex-1 overflow-hidden">
              {ideas.map((idea, i) => (
                <div
                  key={i}
                  className="grid items-center gap-1 px-2 py-[6px] rounded-lg"
                  style={{
                    gridTemplateColumns: '1fr 52px 60px 44px',
                    background: i === 0
                      ? 'rgba(124,58,237,0.15)'
                      : idea.unlocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)',
                    border: i === 0
                      ? '1px solid rgba(124,58,237,0.25)'
                      : idea.unlocked ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.03)',
                  }}
                >
                  {/* Name */}
                  <span
                    className="text-[10px] font-medium truncate"
                    style={{
                      color: idea.unlocked ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.15)',
                      filter: idea.unlocked ? 'none' : 'blur(3.5px)',
                    }}
                  >
                    {idea.name}
                  </span>
                  {/* MRR */}
                  <span
                    className="text-[10px] font-semibold"
                    style={{
                      color: idea.unlocked ? '#34d399' : 'rgba(255,255,255,0.15)',
                      filter: idea.unlocked ? 'none' : 'blur(3.5px)',
                    }}
                  >
                    {idea.mrr}
                  </span>
                  {/* Score bar */}
                  <div className="flex items-center gap-1">
                    {idea.unlocked ? (
                      <>
                        <div className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${idea.score * 10}%`,
                              background: i === 0 ? '#a78bfa' : '#60a5fa',
                            }}
                          />
                        </div>
                        <span className="text-white/50 text-[9px] w-5 text-right">{idea.score}</span>
                      </>
                    ) : (
                      <div className="w-full h-[3px] rounded-full bg-white/5" />
                    )}
                  </div>
                  {/* Tag */}
                  <div>
                    {idea.unlocked ? (
                      <span
                        className="text-[8px] font-semibold px-1.5 py-0.5 rounded"
                        style={{
                          background: idea.tagColor === 'purple' ? 'rgba(124,58,237,0.35)' : 'rgba(52,211,153,0.2)',
                          color: idea.tagColor === 'purple' ? '#c4b5fd' : '#34d399',
                        }}
                      >
                        {idea.tag === 'Top' ? '🔥 Top' : '✓ Bon'}
                      </span>
                    ) : (
                      <span
                        className="text-[8px] px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' }}
                      >
                        🔒
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Unlock banner */}
            <div
              className="mt-2 px-3 py-2 rounded-lg flex items-center justify-between"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(109,40,217,0.15) 100%)',
                border: '1px solid rgba(124,58,237,0.3)',
              }}
            >
              <div>
                <div className="text-[9.5px] text-white/70 font-medium">7 idées verrouillées</div>
                <div className="text-[8.5px] text-white/40">Débloquer pour voir toutes les idées</div>
              </div>
              <div
                className="text-[9px] font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ background: 'rgba(124,58,237,0.8)' }}
              >
                €9 →
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
