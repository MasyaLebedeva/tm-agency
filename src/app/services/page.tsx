'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import ContactModal from '@/components/ContactModal'

const services = [
  {
    title: 'Telegram ADS',
    description: 'Настройка и ведение рекламных кампаний в Telegram',
    price: 'от 150 000 ₽',
    features: [
      'Создание рекламных кампаний',
      'Настройка таргетинга',
      'A/B тестирование креативов',
      'Оптимизация бюджета',
      'Аналитика и отчеты'
    ],
    icon: '📢'
  },
  {
    title: 'Посевы',
    description: 'Продвижение через посевы в тематических каналах',
    price: 'от 100 000 ₽',
    features: [
      'Анализ целевой аудитории',
      'Подбор релевантных каналов',
      'Создание креативов для посевов',
      'Мониторинг результатов',
      'Отчетность по эффективности'
    ],
    icon: '🌱'
  },
  {
    title: 'Креативы',
    description: 'Создание эффективных рекламных креативов',
    price: 'от 3 000 ₽',
    features: [
      'Дизайн баннеров и постов',
      'Создание видео-контента',
      'Адаптация под разные форматы',
      'Брендинг и стилизация',
      'Техническая поддержка'
    ],
    icon: '🎨'
  },
  {
    title: 'Оптимизация Telegram-канала',
    description: 'Оформление, контент, лид-магниты и воронки продаж',
    price: 'от 90 000 ₽',
    features: [
      'Аудит канала/бота',
      'Создание контент-плана',
      'Настройка воронок продаж',
      'Создание лид-магнитов',
      'Техническая оптимизация'
    ],
    icon: '⚡'
  },
  {
    title: 'Разработка Telegram-ботов',
    description: 'Создание функциональных ботов для автоматизации',
    price: 'от 15 000 ₽',
    features: [
      'Разработка бота под ключ',
      'Интеграция с CRM',
      'Автоматизация процессов',
      'Настройка уведомлений',
      'Техническая поддержка'
    ],
    icon: '🤖'
  },
  {
    title: 'Ведение контента',
    description: 'Создание и публикация контента для канала',
    price: 'от 20 000 ₽',
    features: [
      'Создание контент-плана',
      'Написание постов',
      'Создание визуалов',
      'Планирование публикаций',
      'Анализ эффективности'
    ],
    icon: '📝'
  },
  {
    title: 'Маркировка рекламы',
    description: 'Оформление рекламы через ЕРИР',
    price: 'от 500 ₽',
    features: [
      'Регистрация в ЕРИР',
      'Получение маркировки',
      'Консультации по рекламе',
      'Правовая поддержка',
      'Отчетность'
    ],
    icon: '📋'
  },
  {
    title: 'Консультирование',
    description: 'Экспертная консультация по продвижению',
    price: 'Бесплатно',
    features: [
      'Аудит текущей стратегии',
      'Рекомендации по улучшению',
      'Анализ конкурентов',
      'Планирование кампаний',
      'Ответы на вопросы'
    ],
    icon: '💡'
  }
]

const process = [
  {
    step: '01',
    title: 'Консультация',
    description: 'Анализируем ваш проект и определяем цели'
  },
  {
    step: '02', 
    title: 'Стратегия',
    description: 'Разрабатываем индивидуальную стратегию продвижения'
  },
  {
    step: '03',
    title: 'Реализация',
    description: 'Запускаем кампании и отслеживаем результаты'
  },
  {
    step: '04',
    title: 'Оптимизация',
    description: 'Улучшаем показатели на основе аналитики'
  }
]

export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white pt-32">
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8">
              НАШИ
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9]">
                УСЛУГИ
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Полный спектр услуг для эффективного продвижения в Telegram
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-[#232E3C]/50 backdrop-blur-sm border border-[#2AABEE]/20 hover:border-[#2AABEE]/40 transition-all duration-300 hover:bg-[#232E3C]/70"
              >
                <div className="aspect-square p-6 sm:p-8 flex flex-col">
                  <div className="flex items-center mb-6">
                    <span className="text-3xl sm:text-4xl mr-3 sm:mr-4">{service.icon}</span>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-2 group-hover:text-[#2AABEE] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-lg sm:text-xl text-gray-300">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6 flex-1">
                    <h4 className="text-lg font-semibold mb-4 text-white">Что входит в услугу:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-[#2AABEE] mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <span className="text-2xl sm:text-3xl font-bold text-[#2AABEE]">{service.price}</span>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-center"
                    >
                      Заказать
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Process Section */}
          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16">
              КАК МЫ
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9]">
                РАБОТАЕМ
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {process.map((step, index) => (
                <div 
                  key={index}
                  className="text-center group"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-[#2AABEE] to-[#229ED9] rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-8 sm:top-10 left-full w-full h-0.5 bg-gradient-to-r from-[#2AABEE] to-transparent transform translate-x-4"></div>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-4 group-hover:text-[#2AABEE] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-[#2AABEE]/10 to-[#229ED9]/10 rounded-2xl p-8 sm:p-12 border border-[#2AABEE]/20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              ГОТОВЫ НАЧАТЬ?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Свяжитесь с нами для консультации и разработки индивидуальной стратегии продвижения
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Получить консультацию
              </button>
              <Link 
                href="/contacts"
                className="border border-[#2AABEE] text-[#2AABEE] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-[#2AABEE] hover:text-white transition-all duration-300"
              >
                Наши контакты
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
