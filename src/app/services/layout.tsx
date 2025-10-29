import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Услуги — T&M Agency',
  description: 'Полный спектр услуг по Telegram-маркетингу: посевы, Telegram Ads, креативы, стратегический консалтинг.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Услуги — T&M Agency',
    description: 'Эффективное продвижение в Telegram под ключ.',
    url: 'https://tmads.ru/services',
    type: 'website',
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
