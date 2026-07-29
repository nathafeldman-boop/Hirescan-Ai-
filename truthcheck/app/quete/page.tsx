import { redirect } from 'next/navigation';

// Ancienne page (simple écran "complète ton profil") — remplacée par le
// vrai système de quêtes à 3 catégories, voir app/quetes/. Garde ce
// redirect plutôt que de supprimer la route : /quete était déjà lié depuis
// DecouverteClient et potentiellement des favoris/liens partagés.
export default function QuetePage() {
  redirect('/quetes');
}
