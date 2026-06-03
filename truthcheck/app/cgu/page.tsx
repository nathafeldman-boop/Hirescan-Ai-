import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation',
  description: 'Conditions Générales d\'Utilisation d\'UrSecret. Règles d\'utilisation des quiz psychologiques et des abonnements premium.',
  robots: { index: true, follow: false },
  alternates: { canonical: 'https://ursecret.vercel.app/cgu' },
};

export default function CGU() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <header className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            <span style={{ background: 'linear-gradient(to right,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ur</span>
            <span className="text-white">Secret</span>
          </Link>
          <Link href="/quizzes" className="text-xs text-zinc-500 hover:text-white transition-colors">← Retour</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-white mb-2">Conditions Générales d&apos;Utilisation</h1>
        <p className="text-zinc-500 text-sm mb-10">En utilisant UrSecret, tu acceptes les présentes CGU. Dernière mise à jour : juin 2025.</p>

        <div className="space-y-8 text-sm text-zinc-400 leading-relaxed">

          <section>
            <h2 className="text-white font-bold text-base mb-3">1. Objet</h2>
            <p>UrSecret est une plateforme de quiz et tests psychologiques à vocation informative. Les présentes CGU définissent les conditions d&apos;accès et d&apos;utilisation du service.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">2. Accès au service</h2>
            <p>L&apos;accès aux quiz de base est gratuit et anonyme. Un compte est nécessaire pour accéder aux résultats détaillés premium. L&apos;utilisateur doit être âgé d&apos;au moins 16 ans pour créer un compte.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">3. Nature du service</h2>
            <p>Les quiz et analyses proposés par UrSecret sont des <strong className="text-white">outils de découverte de soi à visée informative uniquement</strong>. Ils ne constituent en aucun cas :</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Un diagnostic médical ou psychologique</li>
              <li>Un avis médical ou thérapeutique</li>
              <li>Un substitut à une consultation professionnelle</li>
            </ul>
            <p className="mt-3">En cas de détresse psychologique, contacte un professionnel de santé ou appelle le <strong className="text-white">3114</strong> (numéro national de prévention du suicide, gratuit, 24h/24).</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">4. Abonnement et paiement</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-zinc-300 font-semibold mb-1">Abonnement mensuel</h3>
                <p>L&apos;abonnement mensuel est sans engagement, annulable à tout moment depuis les paramètres de ton compte ou en nous contactant. La résiliation prend effet à la fin de la période en cours.</p>
              </div>
              <div>
                <h3 className="text-zinc-300 font-semibold mb-1">Abonnement annuel</h3>
                <p>L&apos;abonnement annuel est facturé en une fois pour 12 mois. Il bénéficie d&apos;une remise par rapport au tarif mensuel. Annulable à tout moment, sans remboursement prorata sauf exercice du droit de rétractation (14 jours).</p>
              </div>
              <div>
                <h3 className="text-zinc-300 font-semibold mb-1">Accès unique</h3>
                <p>Le paiement unique donne accès aux résultats détaillés d&apos;un quiz spécifique, sans limite de durée.</p>
              </div>
              <div>
                <h3 className="text-zinc-300 font-semibold mb-1">Droit de rétractation</h3>
                <p>Conformément au Code de la consommation, tu disposes d&apos;un délai de <strong className="text-white">14 jours</strong> pour exercer ton droit de rétractation à compter de la souscription, sans avoir à justifier de motifs. Par ailleurs, UrSecret applique une garantie <strong className="text-white">satisfait ou remboursé 7 jours</strong>.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">5. Utilisation acceptable</h2>
            <p>L&apos;utilisateur s&apos;engage à ne pas :</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Utiliser le service à des fins illicites ou contraires à l&apos;ordre public</li>
              <li>Tenter de contourner les protections techniques du service</li>
              <li>Revendre ou redistribuer les analyses et contenus premium</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">6. Propriété intellectuelle</h2>
            <p>L&apos;ensemble des contenus (quiz, analyses, textes, design) est la propriété exclusive d&apos;UrSecret et protégé par le droit d&apos;auteur français et les conventions internationales.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">7. Modification des CGU</h2>
            <p>UrSecret se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs en compte seront informés par email. La poursuite de l&apos;utilisation du service après modification vaut acceptation des nouvelles CGU.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">8. Droit applicable et juridiction</h2>
            <p>Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence exclusive des tribunaux français.</p>
          </section>

          <p className="text-zinc-600 text-xs pt-4 border-t border-white/5">Dernière mise à jour : juin 2025</p>
        </div>

        <div className="mt-10 flex gap-4 flex-wrap">
          <Link href="/mentions-legales" className="text-xs text-zinc-500 hover:text-white transition-colors">Mentions légales →</Link>
          <Link href="/politique-confidentialite" className="text-xs text-zinc-500 hover:text-white transition-colors">Politique de confidentialité →</Link>
          <Link href="/quizzes" className="text-xs text-zinc-500 hover:text-white transition-colors">Retour aux quiz →</Link>
        </div>
      </div>
    </main>
  );
}
