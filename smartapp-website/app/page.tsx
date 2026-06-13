// ─── Data layer — add new products here ────────────────────────────────────
const products = [
  {
    slug: "urcecret",
    name: "UrCecret",
    tagline: "Discover your MBTI personality type",
    description:
      "100-question personality quiz that reveals your MBTI type, deep profile, and compatibility with others.",
    tags: ["Psychology", "Quiz", "MBTI"],
    href: "https://urcecret.site",
    status: "live" as const,
    emoji: "🧠",
    accentColor: "#7c3aed",
  },
  // — drop new products below, they appear automatically —
];

const stats = [
  { label: "Products live", value: products.filter((p) => p.status === "live").length.toString() },
  { label: "Focus", value: "100%" },
  { label: "Shortcuts taken", value: "Zero" },
];

const principles = [
  {
    icon: "◈",
    title: "One thing at a time",
    body: "We ship one product at a time, grow it until it stands on its own, then build the next one.",
  },
  {
    icon: "◎",
    title: "Solve real problems",
    body: "No bloatware, no features for the demo. Every product starts with an observable, specific pain.",
  },
  {
    icon: "◉",
    title: "Built to last",
    body: "Simple stacks, clean codebases, stable revenue. We build things still running in 10 years.",
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-black text-lg tracking-tight text-neutral-900">Smartapp</span>
          <nav className="flex items-center gap-6 text-sm text-neutral-500 font-medium">
            <a href="#products" className="hover:text-neutral-900 transition-colors">Products</a>
            <a href="#about" className="hover:text-neutral-900 transition-colors">About</a>
            <a
              href="https://urcecret.site"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-700 transition-colors"
            >
              Try a product →
            </a>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full px-6 pt-24 pb-20">
        <div className="animate-in delay-1 inline-flex items-center gap-2 mb-8 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 0 3px #d1fae5" }} />
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Building in public</span>
        </div>

        <h1 className="animate-in delay-2 text-5xl sm:text-7xl font-black tracking-tighter text-neutral-900 leading-[1.05] mb-6 max-w-3xl">
          We craft software<br />
          <span className="text-neutral-300">people love.</span>
        </h1>

        <p className="animate-in delay-3 text-lg text-neutral-500 max-w-xl leading-relaxed mb-10">
          Smartapp is an indie studio. We ship focused SaaS tools — one at a time,
          until each one earns its own place in the world.
        </p>

        <div className="animate-in delay-4 flex items-center gap-4 flex-wrap">
          <a
            href="#products"
            className="px-6 py-3 rounded-xl bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-700 transition-colors"
          >
            See our products
          </a>
          <a href="#about" className="text-sm font-semibold text-neutral-400 hover:text-neutral-700 transition-colors">
            About the studio →
          </a>
        </div>

        <div className="animate-in delay-5 flex items-center gap-10 mt-16 pt-8 border-t border-neutral-100">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-black text-neutral-900">{s.value}</p>
              <p className="text-xs text-neutral-400 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products ── */}
      <section id="products" className="bg-neutral-50 border-t border-neutral-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Portfolio</p>
              <h2 className="text-3xl font-black tracking-tight text-neutral-900">Our products</h2>
            </div>
            <span className="text-xs font-semibold text-neutral-400 bg-neutral-200 px-3 py-1 rounded-full">
              {products.length} total
            </span>
          </div>

          {/* Grid — scales from 1 to 50+ products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <a
                key={p.slug}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-neutral-200 p-6 hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex flex-col"
                style={{ borderTop: `3px solid ${p.accentColor}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{p.emoji}</span>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-base font-black text-neutral-900 mb-1">{p.name}</p>
                <p className="text-sm font-semibold text-neutral-500 mb-3">{p.tagline}</p>
                <p className="text-xs text-neutral-400 leading-relaxed flex-1">{p.description}</p>
                <div className="flex items-center gap-2 mt-5 flex-wrap">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs font-bold group-hover:underline" style={{ color: p.accentColor }}>
                  Visit {p.name} →
                </p>
              </a>
            ))}

            {/* Teaser card */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-neutral-200 p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
              <p className="text-2xl mb-3">🚀</p>
              <p className="text-sm font-black text-neutral-400">Next product</p>
              <p className="text-xs text-neutral-300 mt-1">Coming when it&apos;s ready.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section id="about" className="py-20 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">How we build</p>
          <h2 className="text-3xl font-black tracking-tight text-neutral-900 mb-12">The Smartapp way</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {principles.map((pr) => (
              <div key={pr.title}>
                <span className="text-xl text-neutral-300 font-mono">{pr.icon}</span>
                <h3 className="text-base font-black text-neutral-900 mt-3 mb-2">{pr.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{pr.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-neutral-100 max-w-2xl">
            <p className="text-sm text-neutral-400 leading-relaxed">
              Smartapp is a solo-founder studio. No VC, no roadmap theatre — just working software,
              paying customers, and a long-term perspective. Each product is built to run profitably
              on its own before we move to the next one.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-100 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <span className="font-black text-neutral-900">Smartapp</span>
          <span>© {new Date().getFullYear()} Smartapp. All rights reserved.</span>
          <div className="flex items-center gap-5 font-medium">
            <a href="#products" className="hover:text-neutral-700 transition-colors">Products</a>
            <a href="https://urcecret.site" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-700 transition-colors">
              UrCecret
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ─── Badge component ─────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "live" | "beta" | "soon" }) {
  const map = {
    live: { label: "Live", bg: "#dcfce7", color: "#15803d" },
    beta: { label: "Beta", bg: "#fef9c3", color: "#a16207" },
    soon: { label: "Soon", bg: "#f1f5f9", color: "#64748b" },
  };
  const s = map[status];
  return (
    <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}
