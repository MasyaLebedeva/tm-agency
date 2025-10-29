import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Кейсы — T&M Agency',
  description: 'Результаты наших кампаний в Telegram: рост каналов, лидогенерация, продажи.',
  alternates: { canonical: '/cases' },
  openGraph: {
    title: 'Кейсы — T&M Agency',
    description: 'Подборка кейсов по Telegram-маркетингу.',
    url: 'https://tmads.ru/cases',
    type: 'website',
  },
}

export default function CasesLayout({ children }: { children: React.ReactNode }) {
  return children
}


