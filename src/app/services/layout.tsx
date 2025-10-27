import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Услуги - T&M Agency | Продвижение в Telegram',
  description: 'Полный спектр услуг для продвижения в Telegram: посевы, Telegram ADS, креативы, оптимизация каналов и ботов. Профессиональное продвижение с гарантией результата.',
  keywords: 'услуги telegram, продвижение telegram каналов, telegram ads настройка, креативы telegram, оптимизация telegram',
  openGraph: {
    title: 'Услуги - T&M Agency | Продвижение в Telegram',
    description: 'Полный спектр услуг для продвижения в Telegram: посевы, Telegram ADS, креативы, оптимизация каналов и ботов.',
    url: 'https://tm-agency.ru/services',
    type: 'website',
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


