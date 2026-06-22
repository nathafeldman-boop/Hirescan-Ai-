import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SaaSGenrt — Trouve un SaaS que les gens paient vraiment',
  description: "Pas une idée de plus dans ton carnet. Une idée validée, un pricing et un plan de lancement clair — en 10 minutes, pas en 6 mois.",
  keywords: 'saas, idées, startup, validation, lancement, fondateur, MRR',
  openGraph: {
    title: 'SaaSGenrt — Trouve un SaaS que les gens paient vraiment',
    description: "Une idée validée, un pricing et un plan de lancement clair — en 10 minutes, pas en 6 mois.",
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  )
}
