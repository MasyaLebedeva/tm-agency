import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2AABEE]/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <svg className="w-8 h-8 text-white mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.2647 2.42778C21.98 2.19091 21.5894 2.16961 21.2371 2.38112L2.45882 14.2811C2.08235 14.5074 1.87882 14.9291 1.93764 15.3543C1.99647 15.7796 2.30764 16.1297 2.72 16.2511L7.47529 17.5777L18.9247 7.51508C19.1776 7.29543 19.5553 7.31673 19.7776 7.56432C20 7.81191 20.0212 8.18867 19.8 8.43626L10.3576 19.3491V22.5154C10.3576 22.9194 10.6141 23.2749 10.9953 23.3963C11.0753 23.4176 11.1553 23.428 11.2353 23.428C11.5235 23.428 11.8012 23.2962 11.9741 23.0558L14.3835 19.8363L19.4788 21.2799C19.6306 21.3225 19.7871 21.3437 19.9435 21.3437C20.1953 21.3437 20.4424 21.2692 20.6541 21.1265C20.9682 20.9199 21.1671 20.5748 21.1953 20.1921L22.9835 3.39867C23.0235 2.94749 22.7541 2.52002 22.2647 2.42778Z" fill="currentColor"/>
              </svg>
              <span className="text-2xl font-bold text-white">T&M Agency</span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed mb-6 max-w-md">
              Первое рекламное агентство, которое оказывает полный спектр услуг для эффективного продвижения в Telegram.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://t.me/TM_Agency" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#2AABEE] rounded-full flex items-center justify-center hover:bg-[#229ED9] transition-colors"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.2647 2.42778C21.98 2.19091 21.5894 2.16961 21.2371 2.38112L2.45882 14.2811C2.08235 14.5074 1.87882 14.9291 1.93764 15.3543C1.99647 15.7796 2.30764 16.1297 2.72 16.2511L7.47529 17.5777L18.9247 7.51508C19.1776 7.29543 19.5553 7.31673 19.7776 7.56432C20 7.81191 20.0212 8.18867 19.8 8.43626L10.3576 19.3491V22.5154C10.3576 22.9194 10.6141 23.2749 10.9953 23.3963C11.0753 23.4176 11.1553 23.428 11.2353 23.428C11.5235 23.428 11.8012 23.2962 11.9741 23.0558L14.3835 19.8363L19.4788 21.2799C19.6306 21.3225 19.7871 21.3437 19.9435 21.3437C20.1953 21.3437 20.4424 21.2692 20.6541 21.1265C20.9682 20.9199 21.1671 20.5748 21.1953 20.1921L22.9835 3.39867C23.0235 2.94749 22.7541 2.52002 22.2647 2.42778Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Навигация</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#2AABEE] transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-[#2AABEE] transition-colors">
                  Услуги
                </Link>
              </li>
              <li>
                <Link href="/cases" className="text-gray-400 hover:text-[#2AABEE] transition-colors">
                  Кейсы
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#2AABEE] transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-[#2AABEE] transition-colors">
                  Блог
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-400 hover:text-[#2AABEE] transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Контакты</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[#2AABEE] mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
                </svg>
                <a href="mailto:info@tm-agency.ru" className="text-gray-400 hover:text-[#2AABEE] transition-colors">
                  info@tm-agency.ru
                </a>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[#2AABEE] mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.2647 2.42778C21.98 2.19091 21.5894 2.16961 21.2371 2.38112L2.45882 14.2811C2.08235 14.5074 1.87882 14.9291 1.93764 15.3543C1.99647 15.7796 2.30764 16.1297 2.72 16.2511L7.47529 17.5777L18.9247 7.51508C19.1776 7.29543 19.5553 7.31673 19.7776 7.56432C20 7.81191 20.0212 8.18867 19.8 8.43626L10.3576 19.3491V22.5154C10.3576 22.9194 10.6141 23.2749 10.9953 23.3963C11.0753 23.4176 11.1553 23.428 11.2353 23.428C11.5235 23.428 11.8012 23.2962 11.9741 23.0558L14.3835 19.8363L19.4788 21.2799C19.6306 21.3225 19.7871 21.3437 19.9435 21.3437C20.1953 21.3437 20.4424 21.2692 20.6541 21.1265C20.9682 20.9199 21.1671 20.5748 21.1953 20.1921L22.9835 3.39867C23.0235 2.94749 22.7541 2.52002 22.2647 2.42778Z"/>
                </svg>
                <a href="https://t.me/TM_agency_TG_bot" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#2AABEE] transition-colors">
                  @TM_agency_TG_bot
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2AABEE]/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2026 T&M Agency. Все права защищены.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-400 hover:text-[#2AABEE] transition-colors text-sm">
                Политика конфиденциальности
              </a>
              <a href="/terms" className="text-gray-400 hover:text-[#2AABEE] transition-colors text-sm">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
