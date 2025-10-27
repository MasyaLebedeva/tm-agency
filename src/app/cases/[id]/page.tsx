import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { casesData } from '../cases-data'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const caseItem = casesData.find(c => c.id === parseInt(params.id))
  
  if (!caseItem) {
    return {
      title: 'Кейс не найден - T&M Agency',
    }
  }

  return {
    title: `${caseItem.title} - Кейс T&M Agency`,
    description: caseItem.description,
    keywords: `кейс telegram, ${caseItem.category.toLowerCase()}, продвижение telegram, маркетинг telegram`,
    openGraph: {
      title: caseItem.title,
      description: caseItem.description,
      url: `https://tm-agency.ru/cases/${caseItem.id}`,
      type: 'article',
    },
  }
}

export default function CaseDetail({ params }: { params: { id: string } }) {
  const caseItem = casesData.find(c => c.id === parseInt(params.id))
  
  if (!caseItem) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-gray-400">
              <Link href="/" className="hover:text-[#2AABEE] transition-colors">Главная</Link>
              <span>/</span>
              <Link href="/cases" className="hover:text-[#2AABEE] transition-colors">Кейсы</Link>
              <span>/</span>
              <span className="text-white">{caseItem.title}</span>
            </div>
          </nav>

          {/* Case Header */}
          <header className="mb-12">
            <div className="flex items-center mb-6">
              <span className="bg-[#2AABEE] text-white px-4 py-2 rounded-full text-sm font-semibold mr-4">
                {caseItem.category}
              </span>
              <span className="text-gray-400">Бюджет: {caseItem.budget}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {caseItem.title}
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              {caseItem.description}
            </p>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2AABEE]">{caseItem.stats}</div>
                <div className="text-sm text-gray-400">ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#229ED9]">{caseItem.result}</div>
                <div className="text-sm text-gray-400">Результат</div>
              </div>
            </div>
          </header>

          {/* Case Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div 
              className="text-lg leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: caseItem.content }}
            />
          </article>

          {/* CTA Section */}
          <div className="mt-16 p-8 bg-gradient-to-r from-[#2AABEE]/10 to-[#229ED9]/10 rounded-2xl border border-[#2AABEE]/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Хотите такой же результат?</h3>
              <p className="text-gray-300 mb-6">
                Мы поможем вам создать эффективную систему продвижения в Telegram
              </p>
              <Link 
                href="https://t.me/TM_agency_TG_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Получить консультацию
              </Link>
            </div>
          </div>

          {/* Related Cases */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8">Похожие кейсы</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {casesData
                .filter(c => c.id !== caseItem.id)
                .slice(0, 2)
                .map((relatedCase) => (
                  <Link 
                    key={relatedCase.id}
                    href={`/cases/${relatedCase.id}`}
                    className="group block p-6 bg-[#232E3C]/50 rounded-2xl border border-[#2AABEE]/20 hover:border-[#2AABEE]/40 transition-all duration-300 hover-lift"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#2AABEE] font-semibold text-sm">{relatedCase.category}</span>
                      <span className="text-gray-400 text-sm">{relatedCase.budget}</span>
                    </div>
                    <h4 className="text-xl font-bold mb-3 group-hover:text-[#2AABEE] transition-colors">
                      {relatedCase.title}
                    </h4>
                    <p className="text-gray-300 text-sm mb-3">
                      {relatedCase.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#2AABEE] font-bold">{relatedCase.stats}</span>
                      <span className="text-gray-400 text-sm">{relatedCase.result}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}