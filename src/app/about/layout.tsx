import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'О нас — T&M Agency',
  description: 'T&M Agency — первое рекламное агентство в Telegram. Команда экспертов по продвижению каналов, ботов и сообществ.',
  alternates: { canonical: 'https://tmads.ru/about' },
  openGraph: {
    title: 'О нас — T&M Agency',
    description: 'Эксперты по Telegram-маркетингу: посевы, Telegram Ads, креативы.',
    url: 'https://tmads.ru/about',
    type: 'website',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}


