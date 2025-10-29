import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика использования файлов cookie - T&M Agency',
  description: 'Политика использования файлов cookie на сайте T&M Agency',
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Политика использования файлов cookie</h1>
          
          <div className="prose prose-lg prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Что такое файлы cookie</h2>
              <p className="text-gray-300 leading-relaxed">
                Файлы cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве 
                при посещении веб-сайтов. Они помогают сайтам запоминать информацию о ваших предпочтениях 
                и настройках для улучшения пользовательского опыта.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Как мы используем cookie</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                На нашем сайте мы используем файлы cookie для:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Запоминания вашего согласия на использование cookie</li>
                <li>Анализа посещаемости сайта и поведения пользователей</li>
                <li>Улучшения функциональности и производительности сайта</li>
                <li>Персонализации контента и рекламы</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Типы используемых cookie</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#2AABEE]">Необходимые cookie</h3>
                  <p className="text-gray-300">
                    Эти файлы cookie необходимы для работы сайта и не могут быть отключены. 
                    Они обеспечивают базовую функциональность и безопасность сайта.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#2AABEE]">Аналитические cookie</h3>
                  <p className="text-gray-300">
                    Помогают нам понять, как посетители взаимодействуют с сайтом, 
                    собирая и передавая информацию анонимно.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#2AABEE]">Функциональные cookie</h3>
                  <p className="text-gray-300">
                    Позволяют сайту запоминать сделанные вами выборы и предоставлять 
                    улучшенные, более личные функции.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Управление cookie</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Вы можете управлять файлами cookie через настройки вашего браузера. 
                Большинство браузеров позволяют:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Просматривать, какие cookie сохранены на вашем устройстве</li>
                <li>Удалять отдельные cookie или все cookie сразу</li>
                <li>Блокировать cookie от определенных сайтов</li>
                <li>Блокировать сторонние cookie</li>
                <li>Очищать все cookie при закрытии браузера</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Сторонние сервисы</h2>
              <p className="text-gray-300 leading-relaxed">
                Наш сайт может использовать сторонние сервисы (например, Google Analytics, 
                Яндекс.Метрика), которые также могут устанавливать свои файлы cookie. 
                Мы не контролируем использование cookie этими сторонними сервисами.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Изменения в политике</h2>
              <p className="text-gray-300 leading-relaxed">
                Мы можем обновлять эту политику использования cookie время от времени. 
                Любые изменения будут опубликованы на этой странице с указанием даты последнего обновления.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Контакты</h2>
              <p className="text-gray-300 leading-relaxed">
                Если у вас есть вопросы относительно использования файлов cookie, 
                пожалуйста, свяжитесь с нами через форму обратной связи или по email.
              </p>
            </section>

            <div className="mt-8 p-4 bg-[#232E3C]/50 rounded-lg border border-[#2AABEE]/20">
              <p className="text-sm text-gray-400">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}