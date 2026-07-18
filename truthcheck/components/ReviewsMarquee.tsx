// Bandeau d'avis qui défilent — 2 rangées en sens opposés, animation CSS pure
// (aucun JS, aucune image). Remplace les pop-ups "social proof" par une preuve
// sociale honnête et premium.
interface Review { name: string; age: number; type: string; quote: string }

const REVIEWS: Review[] = [
  { name: 'Camille', age: 24, type: 'INFP', quote: 'Le résultat m’a mise face à des trucs que je refusais de voir. Précision flippante.' },
  { name: 'Lucas', age: 22, type: 'INTJ', quote: 'J’étais sur 16personalities depuis 3 ans. Là, le coach m’a appris des choses sur moi. Autre niveau.' },
  { name: 'Jade', age: 27, type: 'ENFP', quote: 'J’ai posté ma carte sur TikTok, 40k vues. Et le coach répond vraiment comme s’il me connaissait.' },
  { name: 'Sarah', age: 31, type: 'INFJ', quote: 'Le coach IA m’a expliqué pourquoi je fuis les conflits. J’ai enfin compris.' },
  { name: 'Théo', age: 25, type: 'ENTP', quote: '3 minutes, résultat bluffant. J’ai fait faire le test à toute ma coloc.' },
  { name: 'Manon', age: 28, type: 'ISFJ', quote: 'Je me suis reconnue à 100%. Et pouvoir en discuter avec le coach, c’est génial.' },
  { name: 'Karim', age: 23, type: 'INTP', quote: 'Franchement mieux que ChatGPT — il connaît déjà mon profil.' },
  { name: 'Léa', age: 20, type: 'ENFJ', quote: 'La carte est trop belle, je l’ai mise en story direct.' },
  { name: 'Hugo', age: 26, type: 'ISTP', quote: 'Sceptique au début. Puis le coach a tapé juste sur un truc que personne ne sait sur moi.' },
  { name: 'Yanis', age: 19, type: 'ESTP', quote: 'Le seul test où j’ai eu l’impression qu’on parlait de MOI, pas d’une case.' },
];

function Card({ r }: { r: Review }) {
  return (
    <div
      className="flex-shrink-0 rounded-2xl p-4"
      style={{ width: 280, background: 'var(--paper-panel)', border: '1px solid var(--line)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span style={{ color: 'var(--gold)', letterSpacing: '0.08em' }}>★★★★★</span>
        <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: 'var(--gold-soft)', color: 'var(--gold)', border: '1px solid var(--gold-line)' }}>
          {r.type}
        </span>
      </div>
      <p className="text-stone-700 text-[13px] leading-relaxed mb-2.5">“{r.quote}”</p>
      <p className="text-stone-400 text-xs">{r.name}, {r.age} ans</p>
    </div>
  );
}

function Row({ items, reverse }: { items: Review[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex gap-3 w-max" style={{ animation: `urMarquee 46s linear infinite${reverse ? ' reverse' : ''}` }}>
      {doubled.map((r, i) => (<Card key={`${r.name}-${i}`} r={r} />))}
    </div>
  );
}

export default function ReviewsMarquee() {
  const half = Math.ceil(REVIEWS.length / 2);
  const row1 = REVIEWS.slice(0, half);
  const row2 = REVIEWS.slice(half);
  return (
    <section className="relative z-10 py-12 overflow-hidden">
      <style>{`@keyframes urMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){[data-marquee]{animation:none!important}}`}</style>
      <div className="px-6 mb-7 text-center">
        <p className="ur-label text-[10px] mb-2" style={{ color: 'var(--gold)' }}>Ils se sont enfin compris</p>
        <h2 className="font-display text-2xl font-black text-stone-900">Des milliers de révélations</h2>
      </div>
      <div className="flex flex-col gap-3">
        <div data-marquee><Row items={row1} /></div>
        <div data-marquee><Row items={row2} reverse /></div>
      </div>
    </section>
  );
}
