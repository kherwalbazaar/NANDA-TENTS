import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NANDA TENT HOUSE - Professional Tent Rental Services',
  description: 'Complete tent rental management system for weddings, parties, and events. Book quality tents at affordable prices in Odisha.',
  keywords: ['tent rental', 'wedding tent', 'party tent', 'event rental', 'odisha tent', 'nanda tent'],
  authors: [{ name: 'NANDA TENT HOUSE' }],
  creator: 'NANDA TENT HOUSE',
  publisher: 'NANDA TENT HOUSE',
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NANDA TENT HOUSE - Professional Tent Rental Services',
    description: 'Complete tent rental management system for weddings, parties, and events. Book quality tents at affordable prices in Odisha.',
    url: '/',
    siteName: 'NANDA TENT HOUSE',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'NANDA TENT HOUSE Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NANDA TENT HOUSE - Professional Tent Rental Services',
    description: 'Complete tent rental management system for weddings, parties, and events.',
    images: ['/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#10b981',
  colorScheme: 'light',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    title: 'NANDA TENT HOUSE',
    statusBarStyle: 'default',
  },
  other: {
    'msapplication-TileColor': '#10b981',
    'msapplication-TileImage': '/icon-144x144.png',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'NANDA TENT',
    'mobile-web-app-capable': 'yes',
    'application-name': 'NANDA TENT HOUSE',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
