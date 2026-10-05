import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import './globals.css'
import SmoothScroll from '@/components/fx/SmoothScroll'
import Cursor from '@/components/fx/Cursor'

const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--nf-display',
  display: 'swap',
})
const serif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--nf-serif',
  display: 'swap',
})
const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--nf-mono',
  display: 'swap',
  preload: false,
})

const BASE_URL = 'https://portfolio-eight-brown-77.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Mathias Matejčík — Engineer, Designer & Skipper',
    template: '%s | Mathias Matejčík',
  },
  description:
    'Software engineer and designer building websites, iOS apps and brands, from first sketch to App Store. Licensed skipper and maker of LogBook. Based in Liptovský Mikuláš, Slovakia.',
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
    'webstránky na mieru',
    'digitálny dizajn',
    'web dizajn',
    'webstránky',
    'Tvorba webových stránok',
    'Dizajn webových stránok',
    'Vývoj webových aplikácií',
    'Tvorba loga',
    'Grafický dizajn',
    'Tvorba vizuálnej identity',
    'Liptovský Mikuláš',
    'Slovensko',
    'e-shop na mieru',
    'React Native',
    'iOS app developer',
    'LogBook yacht log',
    'Postele Liptov',
    'skipper',
  ],
  authors: [{ name: 'Mathias Matejčík', url: BASE_URL }],
  creator: 'Mathias Matejčík',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Mathias Matejčík',
    title: 'Mathias Matejčík — Engineer, Designer & Skipper',
    description:
      'Software engineer and designer building websites, iOS apps and brands, from first sketch to App Store. Licensed skipper and maker of LogBook. Based in Liptovský Mikuláš, Slovakia.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mathias Matejčík — Engineer, Designer & Skipper',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Mathias Matejčík — Engineer, Designer & Skipper',
    description:
      'Websites, iOS apps and brands, from first sketch to App Store. Licensed skipper and maker of LogBook.',
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
  themeColor: '#02050b',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <body className="antialiased">
        <SmoothScroll />
        <Cursor />
        <div className="grain" aria-hidden />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}