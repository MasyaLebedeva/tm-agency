import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Контакты — T&M Agency',
  description: 'Свяжитесь с T&M Agency: консультация по Telegram-маркетингу, рекламе и росту каналов.',
  alternates: { canonical: 'https://tmads.ru/contacts' },
  openGraph: {
    title: 'Контакты — T&M Agency',
    description: 'Напишите нам — поможем с продвижением в Telegram.',
    url: 'https://tmads.ru/contacts',
    type: 'website',
  },
}

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children
}


