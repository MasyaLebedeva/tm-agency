'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { casesData } from './cases-data'
import ContactModal from '@/components/ContactModal'

export default function Cases() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cases, setCases] = useState(casesData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Имитируем загрузку данных (в реальности может быть API запрос)
      const timer = setTimeout(() => {
        setCases(casesData)
        setIsLoading(false)
      }, 100)
      
      return () => clearTimeout(timer)
    } catch (err) {
      setError('Ошибка загрузки кейсов')
      setIsLoading(false)
    }
  }, [])

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-400">Ошибка загрузки</h1>
          <p className="text-gray-300 mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Попробовать снова
          </button>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2AABEE] mx-auto mb-4"></div>
          <p className="text-gray-300">Загружаем кейсы...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white py-32">
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9]">
          Наши кейсы
        </h1>

        {/* Сетка квадратных карточек с изображением и оверлеем */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem, index) => (
            <Link
              key={index}
              href={`/cases/${caseItem.id}`}
              className="group relative block overflow-hidden rounded-2xl bg-[#1A2230] border border-white/10 hover:border-[#2AABEE]/40 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Карточка 1:1 */}
              <div className="relative aspect-square">
                {/* Фон для минималистичности */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/4 to-white/0" />

                {/* Изображение объекта кейса */}
                <Image
                  src={caseItem.image || '/founders.png'}
                  alt={caseItem.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                  priority={index < 6}
                />

                {/* Оверлей с ключевой информацией */}
                <div className="absolute inset-0 bg-[#0A0A0A]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7 lg:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#2AABEE] bg-[#2AABEE]/10 px-2 py-1 rounded-full">
                      {caseItem.category}
                    </span>
                    <span className="text-xs text-gray-300">{caseItem.budget}</span>
                  </div>
                  <h3 className="text-lg font-bold">{caseItem.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-2 mt-1">{caseItem.description}</p>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-[#2AABEE] font-semibold">{caseItem.stats}</span>
                    <span className="text-gray-300">{caseItem.result}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            Оставить заявку
          </button>
        </div>
      </div>
    </main>
  )
}