'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: '',
    type: 'telegram', // telegram, whatsapp
    privacyConsent: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Закрытие по клавише Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Блокируем скролл страницы когда модальное окно открыто
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Проверяем согласие на обработку персональных данных
    if (!formData.privacyConsent) {
      alert('Необходимо дать согласие на обработку персональных данных')
      return
    }
    
    setIsSubmitting(true)

    try {
      // Отправляем заявку на email через API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name || 'Не указано',
          contact: formData.contact,
          messenger: formData.type === 'telegram' ? 'Telegram' : 'WhatsApp',
          message: formData.message || 'Не указано',
          timestamp: new Date().toLocaleString('ru-RU')
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message || 'Благодарим за обращение. В ближайшее время мы с вами свяжемся')
        setFormData({ name: '', contact: '', message: '', type: 'telegram', privacyConsent: false })
        onClose()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка отправки')
      }
    } catch (error) {
      console.error('Ошибка отправки заявки:', error)
      alert('Произошла ошибка при отправке заявки. Попробуйте позже или свяжитесь с нами напрямую.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  // Проверяем, что мы в браузере
  if (typeof window === 'undefined') return null

  return createPortal(
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#232E3C] rounded-2xl p-4 max-w-xl w-full mx-4 border border-[#2AABEE]/20 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Заголовок и подзаголовок убраны для уменьшения высоты */}

        <div className="space-y-4">
          {/* Option 1: We contact you */}
          <div className="bg-[#2AABEE]/10 rounded-xl p-4 border border-[#2AABEE]/20">
            <h3 className="text-lg font-bold mb-2 text-[#2AABEE]">
              Мы сами напишем вам
            </h3>
            {/* Текст о сроках связи убран для уменьшения высоты */}
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Ваше имя</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Иван Иванов"
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2AABEE]/30 rounded-lg text-white focus:border-[#2AABEE] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Способ связи</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="telegram"
                      checked={formData.type === 'telegram'}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="mr-2"
                    />
                    <span className="text-sm">Telegram</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="whatsapp"
                      checked={formData.type === 'whatsapp'}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="mr-2"
                    />
                    <span className="text-sm">WhatsApp</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {formData.type === 'telegram' ? 'Ваш Telegram' : 'Номер телефона'}
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  placeholder={formData.type === 'telegram' ? '@username' : '+7 (999) 123-45-67'}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2AABEE]/30 rounded-lg text-white focus:border-[#2AABEE] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Сообщение (необязательно)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Расскажите о вашем проекте..."
                  rows={2}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2AABEE]/30 rounded-lg text-white focus:border-[#2AABEE] focus:outline-none resize-none"
                />
              </div>

              {/* Чекбокс согласия на обработку персональных данных */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="privacyConsent"
                  checked={formData.privacyConsent}
                  onChange={(e) => setFormData({...formData, privacyConsent: e.target.checked})}
                  className="mt-1 h-4 w-4 text-[#2AABEE] border-gray-300 rounded focus:ring-[#2AABEE] focus:ring-2"
                  required
                />
                <label htmlFor="privacyConsent" className="text-sm text-gray-300 leading-relaxed">
                  Я даю согласие на обработку моих персональных данных в соответствии с{' '}
                  <Link href="/privacy" target="_blank" className="text-[#2AABEE] hover:underline">
                    Политикой конфиденциальности
                  </Link>
                  {' '}и{' '}
                  <Link href="/terms" target="_blank" className="text-[#2AABEE] hover:underline">
                    Пользовательским соглашением
                  </Link>
                  . Согласие может быть отозвано в любое время.
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || !formData.privacyConsent}
                className="w-full bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
              </button>
            </form>
          </div>

          {/* Option 2: Bot */}
          <div className="bg-[#229ED9]/10 rounded-xl p-4 sm:p-6 border border-[#229ED9]/20">
            <h3 className="text-xl font-bold mb-4 text-[#229ED9]">
              Оставить заявку в боте
            </h3>
            <p className="text-gray-300 mb-4">
              Перейдите в наш Telegram-бот для быстрой заявки
            </p>
            <Link
              href="https://t.me/TM_agency_TG_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-[#229ED9] to-[#2AABEE] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.2647 2.42778C21.98 2.19091 21.5894 2.16961 21.2371 2.38112L2.45882 14.2811C2.08235 14.5074 1.87882 14.9291 1.93764 15.3543C1.99647 15.7796 2.30764 16.1297 2.72 16.2511L7.47529 17.5777L18.9247 7.51508C21.1776 7.29543 19.5553 7.31673 19.7776 7.56432C20 7.81191 20.0212 8.18867 19.8 8.43626L10.3576 19.3491V22.5154C10.3576 22.9194 10.6141 23.2749 10.9953 23.3963C11.0753 23.4176 11.1553 23.428 11.2353 23.428C11.5235 23.428 11.8012 23.2962 11.9741 23.0558L14.3835 19.8363L19.4788 21.2799C19.6306 21.3225 19.7871 21.3437 19.9435 21.3437C20.1953 21.3437 20.4424 21.2692 20.6541 21.1265C20.9682 20.9199 21.1671 20.5748 21.1953 20.1921L22.9835 3.39867C23.0235 2.94749 22.7541 2.52002 22.2647 2.42778Z"/>
              </svg>
              Перейти в бот
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
