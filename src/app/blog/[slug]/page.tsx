import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { blogPosts } from '../blog-data'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug)
  
  if (!post) {
    return {
      title: 'Статья не найдена - T&M Agency',
    }
  }

  return {
    title: `${post.title} - T&M Agency`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://tmads.ru/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://tmads.ru/blog/${post.slug}`,
      type: 'article',
    },
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#17212B] text-white pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* JSON-LD: Breadcrumbs + BlogPosting */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://tmads.ru/' },
                  { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://tmads.ru/blog' },
                  { '@type': 'ListItem', position: 3, name: post.title, item: `https://tmads.ru/blog/${post.slug}` },
                ],
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.title,
                description: post.description,
                mainEntityOfPage: `https://tmads.ru/blog/${post.slug}`,
                author: { '@type': 'Organization', name: 'T&M Agency' },
                publisher: { '@type': 'Organization', name: 'T&M Agency', logo: { '@type': 'ImageObject', url: 'https://tmads.ru/favicon.svg' } },
                datePublished: post.date,
                articleSection: post.category,
                inLanguage: 'ru-RU',
              }),
            }}
          />
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-gray-400">
              <Link href="/" className="hover:text-[#2AABEE] transition-colors">Главная</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-[#2AABEE] transition-colors">Блог</Link>
              <span>/</span>
              <span className="text-white">{post.title}</span>
            </div>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center mb-6">
              <span className="bg-[#2AABEE] text-white px-4 py-2 rounded-full text-sm font-semibold mr-4">
                {post.category}
              </span>
              <span className="text-gray-400">{post.date}</span>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-gray-400">{typeof post.readTime === 'number' ? `${post.readTime} мин` : (post.readTime || '—')} чтения</span>
            </div>
            
            {(() => {
              const displayTitle = post.title.replace(/^\[Перевод\]\s*/i, '')
              return (
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  {displayTitle}
                </h1>
              )
            })()}
            
            {(() => {
              const displayDescription = (post.description || '').replace(/^\[Перевод\]\s*/i, '')
              return (
                <p className="text-xl text-gray-300 leading-relaxed">
                  {displayDescription}
                </p>
              )
            })()}
          </header>

          {/* Article Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            {(() => {
              // Берём HTML контент и убираем дубли заголовка из текста статьи
              const raw = (post.content || '').trim()
              const displayTitle = post.title.replace(/^\[Перевод\]\s*/i, '')
              const titleEsc = displayTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
              const removeTitleOnce = (s: string) => s
                .replace(new RegExp(`<h1[^>]*>\\s*${titleEsc}\\s*</h1>`, 'gi'), '')
                .replace(new RegExp(`<p[^>]*>\\s*${titleEsc}\\s*</p>`, 'gi'), '')
                .replace(new RegExp(`(^|\\n)\\s*${titleEsc}\\s*(?=\\n|$)`, 'g'), '')
              let html = removeTitleOnce(raw)
              // Повторно на случай двойного дублирования
              html = removeTitleOnce(html).trim()

              const hasContent = html.length > 80
              const fallback = `
                <h2>${post.title}</h2>
                <p>${post.description || 'Статья будет дополнена в ближайшее время. Мы уже готовим подробный материал по теме.'}</p>
                <h3>Ключевые тезисы</h3>
                <ul>
                  <li>Актуальность темы для продвижения в Telegram</li>
                  <li>Практические рекомендации и лучшие практики</li>
                  <li>Инструменты и метрики, на которые стоит опираться</li>
                </ul>
                <h3>Что дальше</h3>
                <p>Если вам нужна консультация по теме «${post.title}», оставьте заявку — подскажем, как применить это к вашему проекту.</p>
              `
              const contentHtml = hasContent ? html : fallback
              return (
                <div
                  className="text-lg leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              )
            })()}
          </article>

          {/* Related Articles */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8">Похожие статьи</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts
                .filter(p => p.id !== post.id)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link 
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block p-6 bg-[#232E3C]/50 rounded-2xl border border-[#2AABEE]/20 hover:border-[#2AABEE]/40 transition-all duration-300 hover-lift"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#2AABEE] font-semibold text-sm">{relatedPost.category}</span>
                      <span className="text-gray-400 text-sm">{relatedPost.date}</span>
                    </div>
                    <h4 className="text-xl font-bold mb-3 group-hover:text-[#2AABEE] transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {relatedPost.description}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}