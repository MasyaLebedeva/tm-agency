'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { blogPosts } from './blog-data'
import ContactModal from '@/components/ContactModal'

export default function Blog() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Удаляем дубли по title+date, чтобы не показывать повторяющиеся авто-посты
  const unique = React.useMemo(() => {
    const seen = new Set<string>()
    const result: typeof blogPosts = [] as any
    for (const p of blogPosts) {
      const key = `${p.title}__${p.date}`
      if (!seen.has(key)) {
        seen.add(key)
        result.push(p)
      }
    }
    return result
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white pt-32">
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#2AABEE] to-[#229ED9]">
          Блог
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-8 mb-16">
            {unique.map((post, index) => (
              <Link 
                key={index}
                href={`/blog/${post.id}`}
                className="group relative overflow-hidden rounded-2xl bg-[#232E3C]/50 backdrop-blur-sm border border-[#2AABEE]/20 hover:border-[#2AABEE]/40 transition-all duration-300 hover-lift animate-fade-in-up block"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <span className="text-[#2AABEE] font-semibold">{post.category}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-gray-400">{post.date}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-gray-400">{typeof post.readTime === 'number' ? `${post.readTime} мин` : (post.readTime || '—')} чтения</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4 group-hover:text-[#2AABEE] transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {post.description}
                  </p>
                  
                  <div className="inline-flex items-center text-[#2AABEE] hover:text-[#229ED9] transition-colors font-semibold">
                    Читать далее
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              Оставить заявку
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}