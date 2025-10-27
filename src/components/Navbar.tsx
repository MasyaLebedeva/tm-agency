'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import ContactModal from './ContactModal'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#2AABEE]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.2647 2.42778C21.98 2.19091 21.5894 2.16961 21.2371 2.38112L2.45882 14.2811C2.08235 14.5074 1.87882 14.9291 1.93764 15.3543C1.99647 15.7796 2.30764 16.1297 2.72 16.2511L7.47529 17.5777L18.9247 7.51508C19.1776 7.29543 19.5553 7.31673 19.7776 7.56432C20 7.81191 20.0212 8.18867 19.8 8.43626L10.3576 19.3491V22.5154C10.3576 22.9194 10.6141 23.2749 10.9953 23.3963C11.0753 23.4176 11.1553 23.428 11.2353 23.428C11.5235 23.428 11.8012 23.2962 11.9741 23.0558L14.3835 19.8363L19.4788 21.2799C19.6306 21.3225 19.7871 21.3437 19.9435 21.3437C20.1953 21.3437 20.4424 21.2692 20.6541 21.1265C20.9682 20.9199 21.1671 20.5748 21.1953 20.1921L22.9835 3.39867C23.0235 2.94749 22.7541 2.52002 22.2647 2.42778Z" fill="currentColor"/>
            </svg>
            <span className="ml-3 text-2xl font-bold text-white">
              T&M
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-white hover:text-[#2AABEE] transition-colors font-bold text-lg">
              Услуги
            </Link>
            <Link href="/cases" className="text-white hover:text-[#2AABEE] transition-colors font-bold text-lg">
              Кейсы
            </Link>
            <Link href="/about" className="text-white hover:text-[#2AABEE] transition-colors font-bold text-lg">
              О нас
            </Link>
            <Link href="/contacts" className="text-white hover:text-[#2AABEE] transition-colors font-bold text-lg">
              Контакты
            </Link>
            <Link href="/blog" className="text-white hover:text-[#2AABEE] transition-colors font-bold text-lg">
              Блог
            </Link>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white px-6 py-2 rounded-full font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              Оставить заявку
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-[#2AABEE] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/services" className="block text-white hover:text-[#2AABEE] transition-colors font-bold text-lg">
              Услуги
            </Link>
            <Link href="/cases" className="block text-white hover:text-[#2AABEE] transition-colors font-bold text-lg">
              Кейсы
            </Link>
            <Link href="/about" className="block text-white hover:text-[#2AABEE] transition-colors font-bold text-lg">
              О нас
            </Link>
            <Link href="/contacts" className="block text-white hover:text-[#2AABEE] transition-colors font-bold text-lg">
              Контакты
            </Link>
            <Link href="/blog" className="block text-white hover:text-[#2AABEE] transition-colors font-bold text-lg">
              Блог
            </Link>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="block bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white px-6 py-2 rounded-full font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              Оставить заявку
            </button>
          </div>
        )}
      </div>
      </nav>
      {isModalOpen && <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  )
} 