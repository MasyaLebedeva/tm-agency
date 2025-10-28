'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import ContactModal from '@/components/ContactModal'

const services = [
  {
    title: 'Telegram ADS',
    description: 'Настройка и ведение рекламных кампаний в Telegram',
    price: 'от 150 000 ₽'
  },
  {
    title: 'Посевы',
    description: 'Продвижение через посевы в тематических каналах',
    price: 'от 100 000 ₽'
  },
  {
    title: 'Креативы',
    description: 'Создание эффективных рекламных креативов',
    price: 'от 3 000 ₽'
  },
  {
    title: 'Оптимизация Telegram-канала',
    description: 'Оформление, контент, лид-магниты и воронки продаж',
    price: 'от 90 000 ₽'
  },
  {
    title: 'Разработка Telegram-ботов',
    description: 'Создание функциональных ботов для автоматизации',
    price: 'от 15 000 ₽'
  },
  {
    title: 'Ведение контента',
    description: 'Создание и публикация контента для канала',
    price: 'от 20 000 ₽'
  },
  {
    title: 'Маркировка рекламы',
    description: 'Оформление рекламы через ЕРИР',
    price: 'от 500 ₽'
  },
  {
    title: 'Консультация',
    description: 'Экспертная консультация по продвижению',
    price: 'Бесплатно'
  }
]

const stats = [
  { number: '5+', label: 'лет на рынке' },
  { number: '100+', label: 'довольных клиентов' },
  { number: '200+', label: 'успешных проектов' }
]

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A] z-10"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-5xl mx-auto">
            <h1 className="heading-1 mb-8 animate-fade-in-up">
              DIGITAL
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9] animate-gradient">
                TELEGRAM
              </span>
              <br />
              АГЕНТСТВО
            </h1>
            <p className="body-large text-white/90 mb-12 max-w-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              T&M — первое рекламное агентство, которое оказывает полный спектр услуг для эффективного продвижения в Telegram
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#2AABEE] text-white px-6 sm:px-8 py-3 sm:py-4 body-medium font-medium hover:bg-[#229ED9] transition-colors text-center hover-lift hover-glow"
              >
                Оставить заявку
              </button>
              <Link 
                href="/cases"
                className="border border-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 body-medium font-medium hover:bg-white/5 transition-colors text-center hover-lift"
              >
                Смотреть кейсы
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9]">
                  {stat.number}
                </div>
                <div className="body-medium text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="heading-2 mb-8 sm:mb-12">
            НАШИ
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9]">
              УСЛУГИ
            </span>
            {/* Telegram ADS теперь первый! */}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group border border-white/10 p-6 sm:p-8 hover:bg-white/5 transition-colors hover-lift animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <h3 className="heading-4 mb-4 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="body-medium text-muted mb-6">{service.description}</p>
                <p className="body-medium text-accent">{service.price}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-block bg-[#2AABEE] text-white px-12 py-6 body-medium font-medium hover:bg-[#229ED9] transition-colors hover-lift hover-glow animate-glow"
            >
              Оставить заявку
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="animate-slide-in-left">
              <h2 className="heading-2 mb-8 sm:mb-12">
                О
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9] animate-gradient">
                  НАС
                </span>
              </h2>
              <div className="space-y-4 sm:space-y-6 body-medium text-muted">
                <p>
                  Телеграм-агентство Т&М – первое рекламное агентство, которое оказывает полный спектр услуг для эффективного продвижения в Telegram.
                </p>
                <p>
                  Татьяна Сысуева и Мария Лебедева — основатели агентства. Татьяна – руководит производством. Мария – отвечает за маркетинг и продажи.
                </p>
                <blockquote className="text-white border-l-4 border-[#2AABEE] pl-6 my-8">
                  «Мы лично гарантируем квалифицированную разработку, прозрачность сотрудничества, вдумчивое обслуживание и порядок в документах. На связи!»
                </blockquote>
              </div>
            </div>
            <div className="relative animate-slide-in-right">
              <div className="flex gap-4 justify-center items-end">
                {/* Фото Марии */}
                <div className="relative group">
                  <Image
                    src="/maria.PNG"
                    alt="Мария Лебедева - основатель T&M Agency"
                    width={166}
                    height={300}
                    className="w-full h-auto rounded-2xl"
                    style={{ background: 'transparent' }}
                    quality={100}
                    priority
                  />
                </div>
                
                {/* Фото Татьяны */}
                <div className="relative group">
                  <Image
                    src="/tatyana.PNG"
                    alt="Татьяна Сысуева - основатель T&M Agency"
                    width={168}
                    height={300}
                    className="w-full h-auto rounded-2xl"
                    style={{ background: 'transparent' }}
                    quality={100}
                    priority
                  />
                </div>
              </div>
              
              {/* Подпись */}
              <div className="text-center mt-6">
                <p className="body-medium font-semibold text-white mb-2">Татьяна Сысуева & Мария Лебедева</p>
                <p className="body-medium text-accent">Основатели T&M Agency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="heading-2 mb-12 sm:mb-16 lg:mb-20">
            ПРЕИМУЩЕСТВА
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9]">
              T&M
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="group border border-white/10 p-6 sm:p-8 hover:bg-white/5 transition-colors hover-lift animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <h3 className="heading-4 mb-4 group-hover:text-accent transition-colors">
                Гарантии
              </h3>
              <p className="body-medium text-muted">
                Закрепленная рабочая группа и гарантированное наличие ресурсов для развития канала.
              </p>
            </div>
            <div className="group border border-white/10 p-6 sm:p-8 hover:bg-white/5 transition-colors hover-lift animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h3 className="heading-4 mb-4 group-hover:text-accent transition-colors">
                Планирование
              </h3>
              <p className="body-medium text-muted">
                План значимых работ на неделю вперед. Прогнозировать что будет в ближайшую неделю проще простого.
              </p>
            </div>
            <div className="group border border-white/10 p-6 sm:p-8 hover:bg-white/5 transition-colors hover-lift animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <h3 className="heading-4 mb-4 group-hover:text-accent transition-colors">
                Отчетность
              </h3>
              <p className="body-medium text-muted">
                Как пожелаете: ежедневно, еженедельно или ежемесячно.
              </p>
            </div>
            <div className="group border border-white/10 p-6 sm:p-8 hover:bg-white/5 transition-colors hover-lift animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <h3 className="heading-4 mb-4 group-hover:text-accent transition-colors">
                Консультирование
              </h3>
              <p className="body-medium text-muted">
                Консультации и обсуждение всех возникающих вопросов на постоянной основе. Наши специалисты всегда на связи.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl animate-fade-in-up">
            <h2 className="heading-2 mb-8 sm:mb-12">
              НАША
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9] animate-gradient">
                МИССИЯ
              </span>
            </h2>
            <p className="body-medium text-muted">
              Миссия Телеграм-агентства T&M помочь каждому желающему построить прибыльный бизнес в Телеграм.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
} 