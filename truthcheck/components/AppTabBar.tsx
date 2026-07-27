'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Navigation principale de l'app — mobile-first, ajoutée SOUS le contenu
// existant de chaque page (jamais en remplacement d'une navigation déjà là)
// pour ne rien casser. Une seule source de vérité pour les 5 onglets :
// ajouter un onglet plus tard = une ligne de plus ici. "Home" renvoie vers
// le hub /decouverte (l'endroit central où choisir Nova, le journal, etc.),
// pas vers la landing — voir GlobalTabBar.tsx pour où cette même barre
// remplace l'ancienne boule flottante « assistant IA » sur les pages qui
// n'ont pas déjà cette barre intégrée.
const TABS = [
  { href: '/decouverte', emoji: '🏠', label: 'Home' },
  { href: '/quiz/personnalite', emoji: '🧠', label: 'Test' },
  { href: '/chat', emoji: '🤖', label: 'Nova' },
  { href: '/journal', emoji: '📖', label: 'Journal' },
  { href: '/dashboard', emoji: '✨', label: 'Moi' },
] as const;

// dark : variante pour les pages au thème sombre (ex. dashboard premium) — même
// structure, juste des couleurs de fond/texte inversées pour ne pas jurer.
// mode : 'fixed' (défaut) épingle la barre en bas du viewport — parfait pour
// une page qui scrolle normalement (Journal, Moi). 'static' la rend comme un
// simple élément de flux, à placer en dernier enfant d'une colonne flex en
// h-[100dvh] — nécessaire sur /chat, où un input déjà collé en bas du flex
// entrerait sinon en collision avec une barre fixe (voir ChatClient.tsx).
// minimal : ne garde que Home + Moi — pour les pages internes (admin) où Test/
// Nova/Journal n'ont pas de sens.
export default function AppTabBar({ dark = false, mode = 'fixed', minimal = false }: { dark?: boolean; mode?: 'fixed' | 'static'; minimal?: boolean }) {
  const pathname = usePathname();
  const bg = dark ? 'rgba(10,7,5,0.92)' : 'rgba(242,236,222,0.94)';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'var(--line)';
  const idleColor = dark ? '#6b6055' : '#a8a29e';
  const activeColor = dark ? '#e8a94d' : 'var(--gold)';
  const tabs = minimal ? TABS.filter((t) => t.label === 'Home' || t.label === 'Moi') : TABS;

  return (
    <nav
      className={mode === 'fixed' ? 'fixed bottom-0 left-0 right-0 z-40 flex-shrink-0' : 'flex-shrink-0'}
      style={{ background: bg, backdropFilter: 'blur(16px)', borderTop: `1px solid ${border}`, paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-lg mx-auto grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((t) => {
          const active = pathname === t.href || pathname?.startsWith(t.href + '/');
          return (
            <Link
              key={t.href}
              href={t.href}
              className="flex flex-col items-center gap-0.5 py-2.5 transition-all active:scale-95"
              style={{ color: active ? activeColor : idleColor }}
            >
              <span className="text-xl leading-none" style={{ opacity: active ? 1 : 0.7, transform: active ? 'scale(1.08)' : 'none', transition: 'transform .15s' }}>
                {t.emoji}
              </span>
              <span className="text-[10px] font-bold">{t.label}</span>
              <span
                className="w-1 h-1 rounded-full mt-0.5"
                style={{ background: active ? activeColor : 'transparent' }}
                aria-hidden
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
