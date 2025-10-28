import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import ScrollToTop from '../components/ScrollToTop'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://tmads.ru'),
  title: 'T&M Agency - Рекламное агентство в Telegram',
  description: 'Первое рекламное агентство в Telegram, специализирующееся на продвижении каналов и ботов. Посевы, Telegram ADS, креативы, оптимизация.',
  keywords: 'telegram реклама, продвижение в telegram, telegram ads, посевы в telegram, telegram маркетинг, рекламное агентство telegram',
  authors: [{ name: 'T&M Agency' }],
  creator: 'T&M Agency',
  publisher: 'T&M Agency',
  robots: 'index, follow',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico'
  },
  openGraph: {
    title: 'T&M Agency - Рекламное агентство в Telegram',
    description: 'Первое рекламное агентство в Telegram, специализирующееся на продвижении каналов и ботов',
    url: 'https://tmads.ru',
    siteName: 'T&M Agency',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T&M Agency - Рекламное агентство в Telegram',
    description: 'Первое рекламное агентство в Telegram, специализирующееся на продвижении каналов и ботов',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
        <CookieBanner />
        <ScrollToTop />
      </body>
    </html>
  )
} 