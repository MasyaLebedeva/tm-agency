import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import ScrollToTop from '../components/ScrollToTop'
import Script from 'next/script'

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
  alternates: {
    canonical: 'https://tmads.ru/',
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'T&M Agency',
              url: 'https://tmads.ru',
              logo: 'https://tmads.ru/favicon.svg',
              sameAs: [
                'https://t.me/',
              ],
              contactPoint: [{
                '@type': 'ContactPoint',
                contactType: 'customer support',
                availableLanguage: ['Russian'],
              }],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'T&M Agency',
              url: 'https://tmads.ru',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://tmads.ru/blog?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Yandex.Metrika */}
        <Script id="ym-tag" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=104928194', 'ym');

            ym(104928194, 'init', { ssr: true, webvisor: true, clickmap: true, ecommerce: 'dataLayer', accurateTrackBounce: true, trackLinks: true });
          `}
        </Script>
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/104928194" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
        {/* /Yandex.Metrika */}
        <Navbar />
        {children}
        <Footer />
        <CookieBanner />
        <ScrollToTop />
      </body>
    </html>
  )
} 