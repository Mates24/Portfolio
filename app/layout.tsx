import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
  preload: false,
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
})

const BASE_URL = 'https://portfolio-eight-brown-77.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Mathias Matejčík — Engineer & Designer',
    template: '%s | Mathias Matejčík',
  },
  description:
    'Software Engineer and Designer crafting precise, intentional digital experiences. Based in Liptovský Mikuláš, open to remote work.',
  keywords: [
    'software engineer',
    'UI designer',
    'UX designer',
    'full-stack developer',
    'Next.js',
    'React',
    'freelance developer',
    'Slovakia',
    'web design',
    'frontend engineer',
  ],
  authors: [{ name: 'Mathias Matejčík', url: BASE_URL }],
  creator: 'Mathias Matejčík',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Mathias Matejčík',
    title: 'Mathias Matejčík — Engineer & Designer',
    description:
      'Software Engineer and Designer crafting precise, intentional digital experiences. Based in Liptovský Mikuláš, open to remote work.',
    images: [
      {
        url: '/og-image.png', // 1200×630 — create this!
        width: 1200,
        height: 630,
        alt: 'Mathias Matejčík — Engineer & Designer',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Mathias Matejčík — Engineer & Designer',
    description:
      'Software Engineer and Designer crafting precise, intentional digital experiences.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
  },
}

export const viewport: Viewport = {
  themeColor: '#060d1f',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-grid-overlay antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}