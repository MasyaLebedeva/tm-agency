'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import ContactModal from '@/components/ContactModal'

export default function About() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white pt-32">
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9]">
          О нас
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#232E3C]/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-[#2AABEE]/20">
            <h2 className="text-3xl font-bold mb-6">Наша миссия</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Мы помогаем бизнесу расти в Telegram, создавая эффективные стратегии продвижения и 
              реализуя их с помощью современных инструментов и технологий.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-[#232E3C]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#2AABEE]/20">
              <h3 className="text-2xl font-bold mb-4">Наш опыт</h3>
              <p className="text-gray-300">
                Более 5 лет работы в сфере digital-маркетинга и продвижения в Telegram. 
                Мы знаем все тонкости работы с этой платформой и постоянно развиваемся.
              </p>
            </div>
            <div className="bg-[#232E3C]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#2AABEE]/20">
              <h3 className="text-2xl font-bold mb-4">Наши ценности</h3>
              <p className="text-gray-300">
                Честность, прозрачность и результат. Мы работаем только на результат 
                и всегда держим клиента в курсе всех процессов.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              Оставить заявку
            </button>
          </div>
        </div>
      </div>
    </main>
  )
} 