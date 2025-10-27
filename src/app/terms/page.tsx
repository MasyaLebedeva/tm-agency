import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Условия использования - T&M Agency',
  description: 'Условия использования сайта T&M Agency. Правила и условия предоставления услуг.',
  keywords: 'условия использования, правила сайта, пользовательское соглашение',
}

export default function TermsOfUse() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center">
            Условия использования
          </h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="bg-[#232E3C]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#2AABEE]/20">
              <p className="text-lg text-gray-300 mb-6">
                <strong>Дата последнего обновления:</strong> {new Date().toLocaleDateString('ru-RU')}
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">1. Общие положения</h2>
              <p className="text-gray-300 mb-6">
                Настоящие Условия использования (далее — «Условия») регулируют отношения между 
                T&M Agency (далее — «Агентство», «мы») и пользователями сайта tm-agency.ru 
                (далее — «Сайт», «Пользователь»).
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">2. Принятие условий</h2>
              <p className="text-gray-300 mb-6">
                Используя наш Сайт, вы соглашаетесь с данными Условиями. Если вы не согласны 
                с какими-либо положениями, пожалуйста, не используйте наш Сайт.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">3. Описание услуг</h2>
              <p className="text-gray-300 mb-4">
                T&M Agency предоставляет следующие услуги:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Продвижение в Telegram (посевы, реклама)</li>
                <li>Создание и настройка Telegram-ботов</li>
                <li>Разработка креативов для рекламы</li>
                <li>Оптимизация Telegram-каналов</li>
                <li>Консультации по продвижению в Telegram</li>
                <li>Маркировка рекламы через ЕРИР</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">4. Обязанности пользователя</h2>
              <p className="text-gray-300 mb-4">
                Пользователь обязуется:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Предоставлять достоверную информацию</li>
                <li>Соблюдать законодательство РФ</li>
                <li>Не использовать Сайт для незаконных целей</li>
                <li>Не нарушать права третьих лиц</li>
                <li>Своевременно оплачивать услуги согласно договору</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">5. Интеллектуальная собственность</h2>
              <p className="text-gray-300 mb-6">
                Все материалы Сайта, включая тексты, изображения, дизайн, являются 
                интеллектуальной собственностью T&M Agency и защищены авторским правом.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">6. Ограничение ответственности</h2>
              <p className="text-gray-300 mb-6">
                Агентство не несет ответственности за:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Временные технические сбои Сайта</li>
                <li>Действия третьих лиц</li>
                <li>Ущерб, причиненный неправильным использованием услуг</li>
                <li>Результаты продвижения, не гарантированные договором</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">7. Конфиденциальность</h2>
              <p className="text-gray-300 mb-6">
                Мы обязуемся сохранять конфиденциальность информации о вашем проекте 
                и не разглашать ее третьим лицам без вашего согласия.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">8. Изменение условий</h2>
              <p className="text-gray-300 mb-6">
                Мы оставляем за собой право изменять данные Условия в любое время. 
                Изменения вступают в силу с момента их публикации на Сайте.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">9. Разрешение споров</h2>
              <p className="text-gray-300 mb-6">
                Все споры решаются путем переговоров. При невозможности достижения 
                соглашения споры рассматриваются в суде по месту нахождения Агентства.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">10. Контактная информация</h2>
              <p className="text-gray-300 mb-6">
                По всем вопросам, связанным с данными Условиями, обращайтесь:
              </p>
              <div className="bg-[#2AABEE]/10 rounded-lg p-4">
                <p className="text-gray-300 mb-2">
                  <strong>Email:</strong> <a href="mailto:info@tm-agency.ru" className="text-[#2AABEE] hover:underline">info@tm-agency.ru</a>
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Telegram:</strong> <a href="https://t.me/TM_agency_TG_bot" target="_blank" rel="noopener noreferrer" className="text-[#2AABEE] hover:underline">@TM_agency_TG_bot</a>
                </p>
                <p className="text-gray-300">
                  <strong>Канал:</strong> <a href="https://t.me/TM_Agency" target="_blank" rel="noopener noreferrer" className="text-[#2AABEE] hover:underline">@TM_Agency</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
