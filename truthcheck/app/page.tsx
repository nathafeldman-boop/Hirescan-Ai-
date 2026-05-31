import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'UrSecret — Découvre la vérité que tu ressens',
  description:
    'UrSecret : des questionnaires anonymes pour savoir si ton/ta partenaire te trompe, si tu es adopté(e), si vous êtes vraiment amis. Résultats instantanés, 100% gratuit.',
};

export default function HomePage() {
  return (
    <>
      <noscript>
        <main style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#fff', background: '#09090b', minHeight: '100vh' }}>
          <h1>UrSecret — Tes vraies réponses</h1>
          <p>Des questionnaires anonymes pour découvrir la vérité sur ton couple, tes amis et ta famille.</p>
          <ul>
            <li><a href="/quiz/infidelite" style={{ color: '#a78bfa' }}>💔 Mon/Ma partenaire me trompe ?</a></li>
            <li><a href="/quiz/adopte" style={{ color: '#a78bfa' }}>🔍 Suis-je adopté(e) ?</a></li>
            <li><a href="/quiz/amoureux" style={{ color: '#a78bfa' }}>💫 Suis-je vraiment amoureux ?</a></li>
            <li><a href="/quiz/vrais-amis" style={{ color: '#a78bfa' }}>🫂 Sont-ils mes vrais amis ?</a></li>
            <li><a href="/quiz/orientation" style={{ color: '#a78bfa' }}>🌈 Quelle est mon orientation ?</a></li>
          </ul>
          <p>100% anonyme · Zéro compte requis · Résultats instantanés</p>
        </main>
      </noscript>
      <HomeClient />
    </>
  );
}
