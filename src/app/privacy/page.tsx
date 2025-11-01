import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности - T&M Agency',
  description: 'Политика конфиденциальности T&M Agency. Защита персональных данных клиентов.',
  keywords: 'политика конфиденциальности, защита данных, персональные данные',
  alternates: {
    canonical: 'https://tmads.ru/privacy',
  },
  robots: 'index, follow',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center">
            Политика конфиденциальности
          </h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="bg-[#232E3C]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#2AABEE]/20">
              <p className="text-lg text-gray-300 mb-6">
                <strong>Дата последнего обновления:</strong> {new Date().toLocaleDateString('ru-RU')}
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">1. Общие положения</h2>
              <p className="text-gray-300 mb-6">
                Настоящая Политика конфиденциальности определяет порядок обработки персональных данных 
                пользователей сайта tm-agency.ru (далее — «Сайт») и описывает, как T&M Agency 
                (далее — «Агентство», «мы») собирает, использует и защищает вашу личную информацию.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">2. Сбор персональных данных</h2>
              <p className="text-gray-300 mb-4">
                Мы собираем следующие типы персональных данных:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Имя и контактная информация (телефон, email, Telegram)</li>
                <li>Информация о вашем проекте и требованиях</li>
                <li>Данные о взаимодействии с нашим сайтом</li>
                <li>Техническая информация (IP-адрес, браузер, устройство)</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">3. Цели обработки данных</h2>
              <p className="text-gray-300 mb-4">
                Мы используем ваши персональные данные для:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Предоставления наших услуг по продвижению в Telegram</li>
                <li>Связи с вами по вопросам сотрудничества</li>
                <li>Улучшения качества наших услуг</li>
                <li>Соблюдения правовых обязательств</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">4. Защита данных</h2>
              <p className="text-gray-300 mb-6">
                Мы принимаем все необходимые технические и организационные меры для защиты 
                ваших персональных данных от несанкционированного доступа, изменения, 
                раскрытия или уничтожения.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">5. Передача данных третьим лицам</h2>
              <p className="text-gray-300 mb-6">
                Мы не передаем ваши персональные данные третьим лицам, за исключением случаев, 
                когда это необходимо для предоставления услуг или требуется по закону.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">6. Ваши права</h2>
              <p className="text-gray-300 mb-4">
                Вы имеете право:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                <li>Получать информацию о том, какие данные мы обрабатываем</li>
                <li>Требовать исправления неточных данных</li>
                <li>Требовать удаления ваших данных</li>
                <li>Ограничить обработку ваших данных</li>
                <li>Отозвать согласие на обработку данных</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">7. Cookies</h2>
              <p className="text-gray-300 mb-6">
                Наш сайт использует файлы cookie для улучшения пользовательского опыта. 
                Вы можете отключить cookies в настройках вашего браузера.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">8. Изменения в политике</h2>
              <p className="text-gray-300 mb-6">
                Мы можем обновлять данную Политику конфиденциальности. О существенных изменениях 
                мы уведомим вас через наш сайт или по электронной почте.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-[#2AABEE]">9. Контакты</h2>
              <p className="text-gray-300 mb-6">
                Если у вас есть вопросы по данной Политике конфиденциальности, 
                свяжитесь с нами:
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
