import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Блог — T&M Agency',
  description: 'Практики и кейсы по Telegram‑маркетингу: посевы, Telegram Ads, контент и рост каналов.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Блог — T&M Agency',
    description: 'Статьи и гайды по продвижению в Telegram.',
    url: 'https://tmads.ru/blog',
    type: 'website',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}


