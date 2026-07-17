// ── Profil MBTI complet — SERVEUR UNIQUEMENT ────────────────────────────────
// Recompose les 16 profils complets (gratuit + payant). Ne JAMAIS importer ce
// fichier depuis un composant 'use client', ni depuis tout module que du code
// client importe, même indirectement — ça ferait fuiter le contenu payant
// des 16 types dans le bundle JS public, consultable sans payer via les
// devtools. Réservé aux pages serveur (RSC), routes API (après vérification
// serveur du paiement/tier), et scripts d'email/cron.

import { mbtiTypesFree } from './mbti-free';
import { mbtiTypesPremium } from './mbti-premium';
import type { MbtiType } from './mbti';

export const mbtiTypes: Record<string, MbtiType> = Object.fromEntries(
  Object.keys(mbtiTypesFree).map(code => [
    code,
    { ...mbtiTypesFree[code], ...mbtiTypesPremium[code] } as MbtiType,
  ])
);
