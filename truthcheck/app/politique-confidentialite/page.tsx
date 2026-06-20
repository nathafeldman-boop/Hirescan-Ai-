import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité d\'UrCecret. Comment nous traitons tes données personnelles. Conformité RGPD.',
  robots: { index: true, follow: false },
  alternates: { canonical: 'https://urcecret.site/politique-confidentialite' },
};

export default function PolitiqueConfidentialite() {
  return (
    <main className="min-h-screen" style={{ background: '#f7f3ec', color: '#2b2622' }}>
      <header className="sticky top-0 z-20 backdrop-blur-md" style={{ background: 'rgba(247,243,236,0.9)', borderBottom: '1px solid #e8e0d4' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#d17d52,#e0a380)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-stone-900">Cecret</span>
          </Link>
          <Link href="/quizzes" className="text-xs text-stone-500 hover:text-stone-900 transition-colors">← Retour</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-stone-900 mb-2">Politique de Confidentialité</h1>
        <p className="text-stone-500 text-sm mb-10">Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679)</p>

        <div className="space-y-8 text-sm text-stone-400 leading-relaxed">

          <section>
            <h2 className="text-stone-900 font-bold text-base mb-3">1. Principe de conception : Privacy by Design</h2>
            <p>UrCecret est conçu selon le principe du <strong className="text-stone-900">Privacy by Design</strong>. L&apos;utilisation des quiz est <strong className="text-stone-900">100% anonyme</strong> par défaut : aucun compte, aucune adresse email, aucune donnée personnelle n&apos;est requise pour accéder aux quiz gratuits et à leur résultat de base.</p>
          </section>

          <section>
            <h2 className="text-stone-900 font-bold text-base mb-3">2. Données collectées</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-stone-300 font-semibold mb-1">Utilisateurs non-connectés (usage anonyme)</h3>
                <p>Aucune donnée personnelle identifiable n&apos;est collectée. Les résultats des quiz sont stockés de façon anonyme avec un identifiant aléatoire non lié à une identité.</p>
              </div>
              <div>
                <h3 className="text-stone-300 font-semibold mb-1">Utilisateurs connectés (compte premium)</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Adresse email (pour l&apos;authentification)</li>
                  <li>Historique des résultats de quiz (lié au compte)</li>
                  <li>Statut d&apos;abonnement (géré par Stripe)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-stone-900 font-bold text-base mb-3">3. Finalités du traitement</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Authentification et gestion des comptes</li>
              <li>Traitement des paiements (via Stripe, certifié PCI-DSS)</li>
              <li>Amélioration du service et des contenus</li>
            </ul>
          </section>

          <section>
            <h2 className="text-stone-900 font-bold text-base mb-3">4. Base légale du traitement</h2>
            <p>Le traitement des données est fondé sur l&apos;exécution du contrat (compte premium) et le consentement de l&apos;utilisateur. Aucun traitement à des fins publicitaires n&apos;est effectué.</p>
          </section>

          <section>
            <h2 className="text-stone-900 font-bold text-base mb-3">5. Durée de conservation</h2>
            <p>Les données de compte sont conservées pendant la durée d&apos;activité du compte, puis 3 ans après la dernière connexion. Les données anonymes de quiz peuvent être conservées indéfiniment pour améliorer le service.</p>
          </section>

          <section>
            <h2 className="text-stone-900 font-bold text-base mb-3">6. Sous-traitants</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-stone-300">Vercel Inc.</strong> — hébergement (États-Unis, couvert par des clauses contractuelles types UE)</li>
              <li><strong className="text-stone-300">Stripe Inc.</strong> — paiement (États-Unis, certifié PCI-DSS, Privacy Shield)</li>
              <li><strong className="text-stone-300">Google (NextAuth)</strong> — authentification Google optionnelle</li>
            </ul>
          </section>

          <section>
            <h2 className="text-stone-900 font-bold text-base mb-3">7. Tes droits (RGPD)</h2>
            <p className="mb-2">Conformément au RGPD, tu disposes des droits suivants :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Droit d&apos;accès à tes données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
              <li>Droit à la portabilité</li>
              <li>Droit d&apos;opposition</li>
            </ul>
            <p className="mt-3">Pour exercer ces droits, contacte-nous via le site. Tu as également le droit de déposer une réclamation auprès de la <strong className="text-stone-300">CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés — cnil.fr).</p>
          </section>

          <section>
            <h2 className="text-stone-900 font-bold text-base mb-3">8. Cookies</h2>
            <p>Le site utilise uniquement des cookies strictement nécessaires au fonctionnement (session d&apos;authentification). Aucun cookie publicitaire ou de tracking n&apos;est déposé sans ton consentement explicite.</p>
          </section>

          <p className="text-stone-600 text-xs pt-4 border-t border-white/5">Dernière mise à jour : juin 2025</p>
        </div>

        <div className="mt-10 flex gap-4 flex-wrap">
          <Link href="/mentions-legales" className="text-xs text-stone-500 hover:text-stone-900 transition-colors">Mentions légales →</Link>
          <Link href="/cgu" className="text-xs text-stone-500 hover:text-stone-900 transition-colors">CGU →</Link>
          <Link href="/quizzes" className="text-xs text-stone-500 hover:text-stone-900 transition-colors">Retour aux quiz →</Link>
        </div>
      </div>
    </main>
  );
}
