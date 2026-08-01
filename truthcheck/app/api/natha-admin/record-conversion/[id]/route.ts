import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ── Suppression d'un paiement mal enregistré ────────────────────────────────
// Complète le rattrapage manuel (route voisine, POST) : une erreur de saisie
// (mauvais montant, mauvais type d'offre, doublon) doit pouvoir être annulée
// sans avoir à aller modifier la base directement. Supprime aussi la ligne
// AffiliateConversion liée (même stripeSessionId) s'il y en a une, pour ne
// jamais laisser une commission orpheline sur un paiement qui n'existe plus.
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const conversion = await prisma.conversion.findUnique({ where: { id: params.id }, select: { id: true, stripeSessionId: true } });
  if (!conversion) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  await prisma.affiliateConversion.deleteMany({ where: { stripeSessionId: conversion.stripeSessionId } });
  await prisma.conversion.delete({ where: { id: conversion.id } });

  return NextResponse.json({ ok: true });
}
