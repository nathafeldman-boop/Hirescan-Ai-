import { prisma } from './db';

// ── Porte d'entrée du hub : le test de personnalité d'abord ─────────────────
// Après le funnel de démarrage (onboarding + 1er Journal, voir funnelGate.ts),
// le compte est envoyé sur /quetes plutôt que directement sur le hub — la
// quête "Test de personnalité" y est mise en avant en priorité (voir
// QuetesClient.tsx). Une fois le test fait, la suite du funnel (Elio, puis
// Parcours) n'est PLUS pilotée depuis /decouverte : chaque palier se déclenche
// à son propre moment de paywall (résultat du test, quota Elio épuisé, mur des
// 10 niveaux gratuits du Parcours — voir TypeClient.tsx, ChatClient.tsx,
// PersonnaliteClient.tsx::ResultTeaser) et ne redirige que si le compte ne
// paie pas à cette étape précise. /decouverte n'a donc plus qu'UNE seule
// chose à vérifier : le test est-il fait ?
//
// Fonction VOLONTAIREMENT à part de funnelGate.ts, et SEULE /decouverte la
// consulte (jamais /quetes) — sinon /quetes se redirigerait vers lui-même en
// boucle (voir l'incident du tour guidé précédent).
//
// Grandfathering : ne s'applique qu'aux comptes créés à partir de ce moment —
// un compte déjà actif ne doit jamais se retrouver bloqué hors de son hub.
const SEQUENCE_ENFORCED_FROM = new Date('2026-08-02T00:00:00Z');

export async function needsMbtiBeforeHub(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true, mbtiType: true } });
  if (!user || user.createdAt < SEQUENCE_ENFORCED_FROM) return false;
  return !user.mbtiType;
}
