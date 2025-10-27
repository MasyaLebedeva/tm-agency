import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://tm-agency.ru'),
  title: 'T&M Agency - Рекламное агентство в Telegram',
  description: 'Первое рекламное агентство в Telegram, специализирующееся на продвижении каналов и ботов. Посевы, Telegram ADS, креативы, оптимизация.',
  keywords: 'telegram реклама, продвижение в telegram, telegram ads, посевы в telegram, telegram маркетинг, рекламное агентство telegram',
  authors: [{ name: 'T&M Agency' }],
  creator: 'T&M Agency',
  publisher: 'T&M Agency',
  robots: 'index, follow',
  openGraph: {
    title: 'T&M Agency - Рекламное агентство в Telegram',
    description: 'Первое рекламное агентство в Telegram, специализирующееся на продвижении каналов и ботов',
    url: 'https://tm-agency.ru',
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
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
} 