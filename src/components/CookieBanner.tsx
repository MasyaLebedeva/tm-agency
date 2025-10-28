'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Проверяем, принял ли пользователь cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted')
    if (!cookiesAccepted) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true')
    setIsVisible(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookiesAccepted', 'false')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#232E3C] border-t border-[#2AABEE]/20 p-4 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="body-medium text-white">
              Мы используем файлы cookie для улучшения работы сайта и анализа сетевого трафика. 
              Продолжая пользоваться сайтом, вы соглашаетесь с{' '}
              <Link href="/cookies" className="text-accent hover:underline">
                политикой использования cookie
              </Link>
              .
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors body-small"
            >
              Отклонить
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 bg-[#2AABEE] text-white rounded-lg hover:bg-[#229ED9] transition-colors body-small font-medium"
            >
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
