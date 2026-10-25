import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ variable: '--font-sans', subsets: ['latin'] })

const SITE_URL = 'https://careers.beaconlbr.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Winter Internships at Beacon — Life Beyond Routine',
  description:
    'Turn your winter break into a practical learning experience. Work on real projects, explore how a startup operates, and contribute to building a travel-tech platform.',
  openGraph: {
    title: 'Winter Internships at Beacon',
    description: 'Your Winter. Your Growth. Your Next Step.',
    url: SITE_URL,
    siteName: 'Beacon Careers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Winter Internships at Beacon',
    description: 'Your Winter. Your Growth. Your Next Step.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--text)]">{children}</body>
    </html>
  )
}
