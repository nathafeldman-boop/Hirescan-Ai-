'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Seal from './Seal';

// Boule flottante « assistant IA » en bas à droite (façon Meta AI sur WhatsApp).
// Présente sur tout le site sauf le chat lui-même et les écrans où elle
// gênerait (quiz en cours, tunnel de paiement).
const HIDE_ON = ['/chat', '/success', '/quiz/personnalite', '/quiz/'];

export default function ChatFab() {
  const pathname = usePathname() ?? '';
  if (HIDE_ON.some((p) => pathname === p || pathname.startsWith(p))) return null;

  return (
    <Link
      href="/chat"
      aria-label="Assistant IA UrCecret"
      className="fixed z-[60] flex items-center justify-center rounded-full active:scale-95 transition-transform"
      style={{
        bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
        right: '1.25rem',
        width: 58,
        height: 58,
        background: 'var(--gold)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      }}
    >
      {/* Le sceau (astrolabe = l'oracle IA) tourne lentement → « boule vivante » */}
      <Seal size={34} color="var(--ink)" strokeWidth={1.4} spin />
      {/* Pastille ✦ pour signaler « IA » */}
      <span
        aria-hidden
        className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full text-[10px] font-black"
        style={{ width: 18, height: 18, background: 'var(--ink)', color: 'var(--gold)' }}
      >
        ✦
      </span>
    </Link>
  );
}
