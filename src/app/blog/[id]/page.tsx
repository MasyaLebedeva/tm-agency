import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { blogPosts } from '../blog-data'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = blogPosts.find(p => p.id === parseInt(params.id))
  
  if (!post) {
    return {
      title: 'Статья не найдена - T&M Agency',
    }
  }

  return {
    title: `${post.title} - T&M Agency`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://tm-agency.ru/blog/${post.id}`,
      type: 'article',
    },
  }
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = blogPosts.find(p => p.id === parseInt(params.id))
  
  if (!post) {
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
              <span className="text-gray-400">{post.readTime} чтения</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              {post.description}
            </p>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div 
              className="text-lg leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
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
                    href={`/blog/${relatedPost.id}`}
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