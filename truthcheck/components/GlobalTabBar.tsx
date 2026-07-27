'use client';

import { usePathname } from 'next/navigation';
import AppTabBar from './AppTabBar';

// Barre de navigation globale (Home/Test/Nova/Journal/Moi) — remplace
// l'ancienne boule flottante « assistant IA » en bas à droite, sur les
// pages qui n'ont pas déjà cette même barre intégrée (voir AppTabBar.tsx
// pour la liste des onglets). Le tab "Home" pointe vers /decouverte (le hub
// central), pas vers la landing — donc pas de sens de la montrer SUR la
// landing elle-même. Masquée sur :
//  - la landing (racine) ;
//  - les pages qui ont déjà leur propre AppTabBar, pour ne jamais empiler
//    deux barres l'une sur l'autre ;
//  - les écrans où une barre de nav gênerait (quiz en cours, tunnel de paiement).
const HIDE_ON = ['/chat', '/journal', '/dashboard', '/compat', '/profil-avance', '/success', '/quiz/personnalite', '/quiz/'];

// Pages internes (tableau de bord admin) : Test/Nova/Journal n'ont aucun sens
// ici, on ne garde que Home + Moi.
const MINIMAL_ON = ['/natha-admin', '/uc-board-n4th4'];

export default function GlobalTabBar() {
  const pathname = usePathname() ?? '';
  if (pathname === '/') return null;
  if (MINIMAL_ON.some((p) => pathname === p || pathname.startsWith(p))) return <AppTabBar minimal />;
  if (HIDE_ON.some((p) => pathname === p || pathname.startsWith(p))) return null;

  return <AppTabBar />;
}
