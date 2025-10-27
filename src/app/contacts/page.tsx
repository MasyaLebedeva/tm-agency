'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import ContactModal from '@/components/ContactModal'

export default function Contacts() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white pt-32">
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9]">
          Контакты
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-[#232E3C]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#2AABEE]/20">
              <h2 className="text-2xl font-bold mb-6">Свяжитесь с нами</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-[#2AABEE] mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
                  </svg>
                  <a href="mailto:info@tm-agency.ru" className="text-gray-300 hover:text-[#2AABEE] transition-colors">
                    info@tm-agency.ru
                  </a>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-[#2AABEE] mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                  <a href="https://t.me/TM_agency_TG_bot" target="_blank" rel="noopener noreferrer" 
                     className="text-gray-300 hover:text-[#2AABEE] transition-colors">
                    @TM_agency_TG_bot
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#232E3C]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#2AABEE]/20">
              <h2 className="text-2xl font-bold mb-6">Наш канал-визитка</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-[#2AABEE] mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.2647 2.42778C21.98 2.19091 21.5894 2.16961 21.2371 2.38112L2.45882 14.2811C2.08235 14.5074 1.87882 14.9291 1.93764 15.3543C1.99647 15.7796 2.30764 16.1297 2.72 16.2511L7.47529 17.5777L18.9247 7.51508C19.1776 7.29543 19.5553 7.31673 19.7776 7.56432C20 7.81191 20.0212 8.18867 19.8 8.43626L10.3576 19.3491V22.5154C10.3576 22.9194 10.6141 23.2749 10.9953 23.3963C11.0753 23.4176 11.1553 23.428 11.2353 23.428C11.5235 23.428 11.8012 23.2962 11.9741 23.0558L14.3835 19.8363L19.4788 21.2799C19.6306 21.3225 19.7871 21.3437 19.9435 21.3437C20.1953 21.3437 20.4424 21.2692 20.6541 21.1265C20.9682 20.9199 21.1671 20.5748 21.1953 20.1921L22.9835 3.39867C23.0235 2.94749 22.7541 2.52002 22.2647 2.42778Z"/>
                  </svg>
                  <a href="https://t.me/TM_Agency" target="_blank" rel="noopener noreferrer" 
                     className="text-gray-300 hover:text-[#2AABEE] transition-colors">
                    @TM_Agency
                  </a>
                </div>
              </div>
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