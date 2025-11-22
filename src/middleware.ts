import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Убеждаемся, что все ответы имеют правильные заголовки для индексации
  const response = NextResponse.next()
  
  // Добавляем заголовки для предотвращения 403 и улучшения индексации
  response.headers.set('X-Robots-Tag', 'index, follow')
  
  // Не добавляем редирект для trailing slash - Next.js обрабатывает это автоматически
  // через trailingSlash: false в next.config.js
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

