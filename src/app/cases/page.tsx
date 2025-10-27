'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { casesData } from './cases-data'
import ContactModal from '@/components/ContactModal'

const cases = casesData

export default function Cases() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white py-32">
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9]">
          Наши кейсы
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem, index) => (
            <Link 
              key={index}
              href={`/cases/${caseItem.id}`}
              className="group relative overflow-hidden rounded-2xl bg-[#232E3C]/50 backdrop-blur-sm border border-[#2AABEE]/20 hover:border-[#2AABEE]/40 transition-all duration-300 hover-lift animate-fade-in-up block"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300" 
                   style={{ backgroundImage: `linear-gradient(to right, ${caseItem.gradient})` }}>
              </div>
              <div className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-[#2AABEE] bg-[#2AABEE]/10 px-3 py-1 rounded-full">
                    {caseItem.category}
                  </span>
                  <span className="text-sm text-gray-400">{caseItem.budget}</span>
                </div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-[#2AABEE] transition-colors">
                  {caseItem.title}
                </h2>
                <p className="text-gray-300 mb-4 text-sm">{caseItem.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[#2AABEE] font-bold text-lg">{caseItem.stats}</p>
                  <p className="text-gray-400 text-sm">{caseItem.result}</p>
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            Оставить заявку
          </button>
        </div>
      </div>
    </main>
  )
} 