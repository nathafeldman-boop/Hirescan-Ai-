// Identifiant anonyme persistant par navigateur — nécessaire pour compter les
// étapes du funnel (arrivée → quiz démarré → terminé → paywall → paiement) en
// VISITEURS UNIQUES plutôt qu'en événements bruts. Sans ça, une page vue
// plusieurs fois (refresh, retour arrière) gonfle artificiellement une étape
// et peut la faire dépasser une étape antérieure — symptôme de "tracking
// cassé" explicitement à corriger. Pas un identifiant d'authentification :
// uniquement stocké côté client, jamais utilisé pour l'accès au contenu payant.
const KEY = '_urs_vid';

export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return '';
  }
}
