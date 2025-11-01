import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Страница не найдена - 404 - T&M Agency',
  description: 'Запрашиваемая страница не найдена.',
  robots: 'noindex, follow',
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9]">
          404
        </h1>
        <h2 className="text-3xl font-bold mb-4">Страница не найдена</h2>
        <p className="text-gray-300 mb-8 text-lg">
          Извините, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            На главную
          </Link>
          <Link 
            href="/contacts"
            className="border border-[#2AABEE] text-[#2AABEE] px-8 py-4 rounded-full font-semibold hover:bg-[#2AABEE] hover:text-white transition-all duration-300"
          >
            Связаться с нами
          </Link>
        </div>
      </div>
    </main>
  )
}

