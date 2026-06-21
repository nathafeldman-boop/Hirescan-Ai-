import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SaaSGenrt – Build a SaaS people actually pay for',
  description: 'Discover profitable SaaS ideas, validate them and launch your first SaaS faster than ever with AI.',
  keywords: 'saas, ideas, ai, startup, validation, launch',
  openGraph: {
    title: 'SaaSGenrt – Build a SaaS people actually pay for',
    description: 'Discover profitable SaaS ideas, validate them and launch your first SaaS faster than ever with AI.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-[#090B11] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
