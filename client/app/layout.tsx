import type { Metadata, Viewport } from 'next'
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Solana Wallet Tracker | Real-Time Balance & Transaction Monitor',
  description: 'Track Solana wallet balances, token holdings, and transactions in real-time. Monitor your SOL assets with live activity feeds and detailed transaction history.',
  generator: 'v0.app',
  keywords: ['Solana', 'Wallet', 'Tracker', 'Blockchain', 'Crypto', 'SOL'],
  authors: [{ name: 'Solana Tracker' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Solana Wallet Tracker',
    description: 'Real-time Solana wallet tracking and monitoring',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1e293b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased dark">
        {children}
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
