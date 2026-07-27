'use client';

import { usePathname } from 'next/navigation';
import AppTabBar from './AppTabBar';

// Barre de navigation globale (Home / Moi) — remplace l'ancienne boule
// flottante « assistant IA » en bas à droite. Le tab "Home" pointe vers
// /decouverte (le hub central où choisir Nova, le journal, etc.), pas vers
// la landing — donc pas de sens de la montrer SUR la landing elle-même.
// Présente sur les autres pages publiques (hub, types, quiz...), masquée sur :
//  - la landing (racine) — voir ci-dessus ;
//  - les pages qui ont déjà leur propre AppTabBar à 4 onglets (Test/Nova/
//    Journal/Moi), pour ne jamais empiler deux barres l'une sur l'autre ;
//  - les écrans où une barre de nav gênerait (quiz en cours, tunnel de paiement).
const HIDE_ON = ['/chat', '/journal', '/dashboard', '/compat', '/profil-avance', '/success', '/quiz/personnalite', '/quiz/'];

export default function GlobalTabBar() {
  const pathname = usePathname() ?? '';
  if (pathname === '/') return null;
  if (HIDE_ON.some((p) => pathname === p || pathname.startsWith(p))) return null;

  return <AppTabBar variant="public" />;
}
