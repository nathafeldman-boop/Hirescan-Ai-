import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions Légales',
  description: 'Mentions légales d\'UrCecret conformément à la loi française LCEN du 21 juin 2004.',
  robots: { index: true, follow: false },
  alternates: { canonical: 'https://ursecret.vercel.app/mentions-legales' },
};

export default function MentionsLegales() {
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
        <h1 className="text-2xl font-black text-white mb-2">Mentions Légales</h1>
        <p className="text-zinc-500 text-sm mb-10">Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN)</p>

        <div className="space-y-8 text-sm text-zinc-400 leading-relaxed">

          <section>
            <h2 className="text-white font-bold text-base mb-3">1. Éditeur du site</h2>
            <p>Le site UrCecret est édité à titre personnel.</p>
            <p className="mt-2">Directeur de la publication : Propriétaire du site UrCecret</p>
            <p className="mt-2">Contact : accessible via le formulaire de contact disponible sur le site.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">2. Hébergement</h2>
            <p>Le site est hébergé par :</p>
            <p className="mt-2 font-medium text-zinc-300">Vercel Inc.</p>
            <p>340 Pine Street, Suite 701</p>
            <p>San Francisco, CA 94104 — États-Unis</p>
            <p className="mt-2">Site web : <span className="text-zinc-300">vercel.com</span></p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">3. Propriété intellectuelle</h2>
            <p>L&apos;ensemble du contenu du site UrCecret (textes, quiz, analyses, design, code) est protégé par le droit d&apos;auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">4. Données personnelles</h2>
            <p>UrCecret est conçu pour être utilisé de manière <strong className="text-white">100% anonyme</strong>. Aucun compte n&apos;est requis pour accéder aux quiz gratuits. Pour les utilisateurs qui créent un compte (nécessaire pour accéder aux résultats premium), les données collectées sont limitées à l&apos;adresse email.</p>
            <p className="mt-2">Pour plus d&apos;informations, consultez notre <Link href="/politique-confidentialite" className="text-violet-400 hover:text-violet-300">Politique de confidentialité</Link>.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">5. Cookies</h2>
            <p>Le site utilise des cookies strictement nécessaires au fonctionnement des sessions authentifiées. Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé sans consentement.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">6. Limitation de responsabilité</h2>
            <p>Les quiz et tests proposés sur UrCecret sont des outils de découverte de soi à visée informative. Ils ne constituent en aucun cas des diagnostics médicaux ou psychologiques. UrCecret décline toute responsabilité pour les décisions prises sur la base des résultats obtenus.</p>
            <p className="mt-2">En cas de détresse psychologique, consultez un professionnel de santé ou appelez le <strong className="text-white">3114</strong> (numéro national de prévention du suicide — gratuit, 24h/24).</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">7. Droit applicable</h2>
            <p>Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
          </section>

          <p className="text-zinc-600 text-xs pt-4 border-t border-white/5">Dernière mise à jour : juin 2025</p>
        </div>

        <div className="mt-10 flex gap-4 flex-wrap">
          <Link href="/politique-confidentialite" className="text-xs text-zinc-500 hover:text-white transition-colors">Politique de confidentialité →</Link>
          <Link href="/cgu" className="text-xs text-zinc-500 hover:text-white transition-colors">CGU →</Link>
          <Link href="/quizzes" className="text-xs text-zinc-500 hover:text-white transition-colors">Retour aux quiz →</Link>
        </div>
      </div>
    </main>
  );
}
