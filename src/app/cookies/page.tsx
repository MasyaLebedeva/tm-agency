import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика использования cookie - T&M Agency',
  description: 'Политика использования файлов cookie на сайте T&M Agency',
}

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-1 mb-8">
            Политика использования cookie
          </h1>
          
          <div className="space-y-8 body-medium text-muted">
            <section>
              <h2 className="heading-3 mb-4 text-white">Что такое cookie?</h2>
              <p>
                Cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве 
                при посещении веб-сайтов. Они помогают сайтам запоминать информацию о ваших 
                предпочтениях и улучшать пользовательский опыт.
              </p>
            </section>

            <section>
              <h2 className="heading-3 mb-4 text-white">Как мы используем cookie?</h2>
              <p>
                Мы используем файлы cookie для следующих целей:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Улучшения работы сайта и его функциональности</li>
                <li>Анализа сетевого трафика и поведения пользователей</li>
                <li>Запоминания ваших предпочтений и настроек</li>
                <li>Обеспечения безопасности сайта</li>
                <li>Персонализации контента и рекламы</li>
              </ul>
            </section>

            <section>
              <h2 className="heading-3 mb-4 text-white">Типы cookie</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="heading-4 mb-2 text-white">Необходимые cookie</h3>
                  <p>
                    Эти cookie необходимы для базовой работы сайта и не могут быть отключены. 
                    Они обеспечивают безопасность и основные функции сайта.
                  </p>
                </div>
                <div>
                  <h3 className="heading-4 mb-2 text-white">Аналитические cookie</h3>
                  <p>
                    Помогают нам понять, как посетители взаимодействуют с сайтом, 
                    собирая и передавая информацию анонимно.
                  </p>
                </div>
                <div>
                  <h3 className="heading-4 mb-2 text-white">Функциональные cookie</h3>
                  <p>
                    Позволяют сайту запоминать сделанные вами выборы и предоставлять 
                    улучшенные, более персонализированные функции.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="heading-3 mb-4 text-white">Управление cookie</h2>
              <p>
                Вы можете управлять cookie через настройки вашего браузера. Большинство 
                браузеров позволяют:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Просматривать, какие cookie сохранены на вашем устройстве</li>
                <li>Удалять отдельные cookie или все cookie сразу</li>
                <li>Блокировать cookie от определенных сайтов</li>
                <li>Блокировать cookie третьих лиц</li>
                <li>Очищать все cookie при закрытии браузера</li>
              </ul>
            </section>

            <section>
              <h2 className="heading-3 mb-4 text-white">Cookie третьих лиц</h2>
              <p>
                Наш сайт может содержать cookie от сторонних сервисов, таких как:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Google Analytics — для анализа трафика</li>
                <li>Социальные сети — для интеграции с платформами</li>
                <li>Рекламные сети — для показа релевантной рекламы</li>
              </ul>
            </section>

            <section>
              <h2 className="heading-3 mb-4 text-white">Изменения в политике</h2>
              <p>
                Мы можем обновлять эту политику использования cookie время от времени. 
                Любые изменения будут опубликованы на этой странице с указанием даты 
                последнего обновления.
              </p>
            </section>

            <section>
              <h2 className="heading-3 mb-4 text-white">Контакты</h2>
              <p>
                Если у вас есть вопросы относительно использования cookie, 
                пожалуйста, свяжитесь с нами через{' '}
                <a href="/contacts" className="text-accent hover:underline">
                  страницу контактов
                </a>
                .
              </p>
            </section>

            <div className="pt-8 border-t border-white/10">
              <p className="body-small text-white/50">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
