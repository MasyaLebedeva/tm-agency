import { NextResponse } from 'next/server'
import { getQueriesByIndex } from '../seo-queries'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Функция для генерации байтового SEO-заголовка (50-60 символов оптимально)
function generateByteOptimizedTitle(query: string): string {
  // Базовый заголовок на основе запроса
  const baseTitle = query.charAt(0).toUpperCase() + query.slice(1)
  
  // Добавляем ключевые слова для SEO
  const seoKeywords = ['в Telegram', 'для бизнеса', '2025', 'руководство', 'как', 'что такое']
  
  // Формируем заголовок длиной 50-60 символов
  let title = baseTitle
  if (title.length < 50) {
    // Добавляем контекст для SEO
    if (!title.includes('Telegram') && !title.includes('телеграм')) {
      title = title + ' в Telegram'
    }
    if (title.length < 50 && !title.includes('2025')) {
      title = title + ' в 2025 году'
    }
  }
  
  // Обрезаем до 60 символов если нужно
  if (title.length > 60) {
    title = title.substring(0, 57) + '...'
  }
  
  return title
}

function buildPrompt(query: string) {
  return `Ты опытный копирайтер и SEO-специалист. Напиши максимально полезную, человекоподобную и продающую статью на русском языке по теме: "${query}".

СТРУКТУРА СТАТЬИ (обязательно соблюдай):

1. ЗАГОЛОВОК (H1):
   - SEO-оптимизированный заголовок длиной 50-60 символов
   - Должен точно отвечать на запрос пользователя
   - Включай ключевые слова естественным образом
   - Пример хорошего заголовка: "Как продвинуть канал в Telegram: полное руководство 2025"

2. ВВОДНАЯ ЧАСТЬ (2-3 абзаца):
   - Захватывающее введение, которое сразу отвечает на вопрос пользователя
   - Объясни, почему эта тема важна
   - Дай краткий обзор того, что читатель узнает из статьи

3. ОСНОВНОЙ КОНТЕНТ (раздели на логические блоки с подзаголовками H2/H3):
   - Детально раскрой тему запроса
   - Дай практические советы, примеры, кейсы
   - Используй списки, таблицы, выделения для лучшей читаемости
   - Пиши простым, понятным языком, как эксперт объясняет другу
   - Объем: 1500-2500 слов (главное - качество и полезность, не гонись за количеством)

4. БЛОК ПРОДАЖИ T&M AGENCY (обязательно включи естественно в текст):
   - После основной полезной информации добавь блок о том, как T&M Agency помогает решать эти задачи
   - Упомяни конкретные услуги: настройка Telegram ADS, создание ботов, оптимизация каналов, посевы
   - Приведи примеры успешных кейсов (можно обобщенные)
   - Подчеркни экспертизу агентства (5+ лет на рынке, 100+ довольных клиентов, 200+ успешных проектов)
   - НЕ делай это навязчиво - это должно быть естественным продолжением полезного контента

5. ПРИЗЫВ К ДЕЙСТВИЮ (CTA):
   - В конце статьи добавь призыв к действию
   - Текст: "Хотите получить бесплатную консультацию и расчет продвижения вашего канала? Оставьте заявку в T&M Agency, и мы поможем вам построить прибыльный бизнес в Telegram."
   - Сделай это естественно, как дружеский совет

ТРЕБОВАНИЯ К СТИЛЮ:
- Пиши живым, понятным языком
- Избегай шаблонных фраз и "воды"
- Используй конкретные примеры и цифры где возможно
- Структурируй текст подзаголовками, списками, выделениями
- Пиши так, как будто ты реальный эксперт, который делится опытом

ТРЕБОВАНИЯ К SEO:
- Естественно вплетай ключевые слова: Telegram, продвижение, реклама, боты, TON, канал
- Используй LSI-слова (синонимы и связанные термины)
- Структурируй контент для лучшего понимания поисковыми системами

ВАЖНО:
- Статья должна быть максимально полезной для читателя
- Продажа агентства должна быть естественной, не навязчивой
- Текст должен читаться как написанный человеком, а не роботом
- Дай реальную ценность, а не просто рекламу

Начни писать статью прямо сейчас, следуя этой структуре.`
}

async function generateArticle(openaiKey: string, query: string): Promise<{ title: string; content: string }> {
  const prompt = buildPrompt(query)
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'Ты опытный копирайтер и SEO-специалист, который пишет полезные, продающие статьи для маркетингового блога T&M Agency - первого рекламного агентства, специализирующегося на продвижении в Telegram. Ты пишешь максимально человекоподобно, даешь реальную ценность читателям и естественно интегрируешь информацию об агентстве.' 
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8, // Увеличил для более естественного текста
    }),
  })
  const data = await resp.json()
  const fullContent = data?.choices?.[0]?.message?.content || ''
  
  // Извлекаем заголовок из контента (первая строка с # или первый H1)
  let title = generateByteOptimizedTitle(query)
  const titleMatch = fullContent.match(/^#\s+(.+)$/m) || fullContent.match(/<h1[^>]*>(.+?)<\/h1>/i)
  if (titleMatch && titleMatch[1]) {
    const extractedTitle = titleMatch[1].trim()
    // Проверяем длину заголовка в байтах
    const titleBytes = Buffer.from(extractedTitle, 'utf8').length
    if (titleBytes >= 40 && titleBytes <= 70) {
      title = extractedTitle
    }
  }
  
  // Убираем заголовок из контента, если он там есть
  let content = fullContent
    .replace(/^#\s+.+$/m, '') // Убираем markdown заголовок
    .replace(/<h1[^>]*>.*?<\/h1>/i, '') // Убираем HTML заголовок
    .trim()
  
  // Если контент пустой, используем полный контент
  if (!content) {
    content = fullContent
  }
  
  return { title, content }
}

async function getFileFromGithub(token: string, repo: string, path: string, branch: string) {
  const api = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`
  const res = await fetch(api, { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github+json' } })
  if (!res.ok) {
    const errorText = await res.text()
    console.error(`GitHub API error: ${res.status} ${res.statusText}`)
    console.error(`URL: ${api}`)
    console.error(`Response: ${errorText}`)
    throw new Error(`GH get file failed: ${res.status} ${res.statusText} - ${errorText}`)
  }
  return await res.json()
}

async function putFileToGithub(params: {
  token: string
  repo: string
  path: string
  branch: string
  message: string
  content: string
  sha: string
  authorName: string
  authorEmail: string
}) {
  const api = `https://api.github.com/repos/${params.repo}/contents/${encodeURIComponent(params.path)}`
  const body = {
    message: params.message,
    branch: params.branch,
    content: Buffer.from(params.content, 'utf8').toString('base64'),
    sha: params.sha,
    committer: { name: params.authorName, email: params.authorEmail },
    author: { name: params.authorName, email: params.authorEmail },
  }
  const res = await fetch(api, {
    method: 'PUT',
    headers: { Authorization: `token ${params.token}`, Accept: 'application/vnd.github+json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error('GH put failed: ' + t)
  }
}

// Вставка новых статей в начало массива blogPosts
function insertPostsIntoSource(sourceTs: string, newPostsTs: string) {
  const marker = 'export const blogPosts = ['
  const idx = sourceTs.indexOf(marker)
  if (idx === -1) return sourceTs
  const before = sourceTs.slice(0, idx + marker.length)
  const after = sourceTs.slice(idx + marker.length)
  // добавляем новые посты в начало
  return `${before}\n${newPostsTs},${after}`
}

function createSlug(title: string, id: number): string {
  const base = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${base}-${id}`
}

function buildPostObject(id: number, title: string, content: string, keywords: string[]) {
  const date = new Date().toISOString().slice(0, 10)
  const readTime = Math.max(3, Math.min(12, Math.round(content.split(/\s+/).length / 180)))
  const slug = createSlug(title, id)
  const escaped = content.replace(/`/g, '\\`')
  return `{
    id: ${id},
    slug: '${slug}',
    title: ${JSON.stringify(title)},
    description: ${JSON.stringify(title)},
    date: '${date}',
    readTime: '${readTime} мин',
    category: 'Telegram',
    keywords: ${JSON.stringify(keywords)},
    content: \`${escaped}\`
  }`
}

export async function GET(request: Request) {
  const openaiKey = process.env.OPENAI_API_KEY || ''
  const ghToken = process.env.GITHUB_TOKEN || ''
  const repo = process.env.GITHUB_REPO || ''
  const branch = process.env.GITHUB_BRANCH || 'main'
  const authorName = process.env.GITHUB_AUTHOR_NAME || 'T&M Bot'
  const authorEmail = process.env.GITHUB_AUTHOR_EMAIL || 'bot@tmads.ru'

  // Детальная проверка переменных окружения
  if (!ghToken) {
    return NextResponse.json({ 
      error: 'Missing GITHUB_TOKEN env var',
      hint: 'Add GITHUB_TOKEN to Vercel environment variables'
    }, { status: 400 })
  }

  if (!repo) {
    return NextResponse.json({ 
      error: 'Missing GITHUB_REPO env var',
      hint: 'Add GITHUB_REPO in format: username/repo (e.g., MasyaLebedeva/tm-agency)'
    }, { status: 400 })
  }

  if (!openaiKey) {
    return NextResponse.json({ 
      error: 'OPENAI_API_KEY is required for SEO article generation',
      hint: 'Add OPENAI_API_KEY to Vercel environment variables'
    }, { status: 400 })
  }

  // Валидация формата репозитория
  if (!repo.includes('/')) {
    return NextResponse.json({ 
      error: 'Invalid GITHUB_REPO format',
      hint: 'GITHUB_REPO should be in format: username/repo (e.g., MasyaLebedeva/tm-agency)',
      received: repo
    }, { status: 400 })
  }

  // Получаем параметр count из query string (по умолчанию 3)
  const url = new URL(request.url)
  const countParam = url.searchParams.get('count')
  const articleCount = countParam ? Math.max(1, Math.min(10, parseInt(countParam) || 3)) : 3

  // Получаем текущий blog-data.ts из GitHub для определения индекса
  const path = 'src/app/blog/blog-data.ts'
  let fileJson
  let current
  
  try {
    fileJson = await getFileFromGithub(ghToken, repo, path, branch)
    current = Buffer.from(fileJson.content, 'base64').toString('utf8')
  } catch (error: any) {
    console.error('Error fetching file from GitHub:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch blog-data.ts from GitHub',
      details: error.message,
      hint: 'Check GITHUB_TOKEN permissions and GITHUB_REPO format',
      repo: repo,
      path: path,
      branch: branch
    }, { status: 500 })
  }
  
  // Определяем индекс для получения запросов (на основе даты или последнего ID)
  const idRegex = /id:\s*(\d+)/g
  const idArr: number[] = []
  let idm: RegExpExecArray | null
  while ((idm = idRegex.exec(current)) !== null) {
    idArr.push(parseInt(idm[1]))
  }
  const lastId = idArr.length > 0 ? Math.max(...idArr) : 0
  const startIndex = Math.floor(lastId / 3) // Примерно 3 статьи в день
  
  // Получаем SEO-запросы для генерации статей (количество зависит от параметра count)
  const queries = getQueriesByIndex(startIndex, articleCount)

  // Генерация статей на основе SEO-запросов
  const articles: Array<{ title: string; content: string }> = []
  for (const query of queries) {
    try {
      const article = await generateArticle(openaiKey, query)
      articles.push(article)
    } catch (error) {
      console.error(`Error generating article for query "${query}":`, error)
      // В случае ошибки создаем базовую статью
      articles.push({
        title: generateByteOptimizedTitle(query),
        content: `<p>Статья по запросу: ${query}</p><p>Ошибка генерации контента. Пожалуйста, попробуйте позже.</p>`
      })
    }
  }

  // Определяем следующий id
  const sha = fileJson.sha
  const idMatch = idArr.sort((a, b) => b - a)
  const nextIdStart = (idMatch[0] || 0) + 1

  // Извлекаем ключевые слова из запросов для каждой статьи
  const extractKeywords = (query: string): string[] => {
    const keywords = ['Telegram', 'продвижение']
    if (query.includes('бот') || query.includes('bot')) keywords.push('боты')
    if (query.includes('реклам') || query.includes('ads')) keywords.push('реклама')
    if (query.includes('ton') || query.includes('блокчейн')) keywords.push('TON')
    if (query.includes('канал')) keywords.push('каналы')
    if (query.includes('посев')) keywords.push('посевы')
    return keywords
  }

  const postsTs = articles
    .map((a, idx) => {
      const query = queries[idx]
      const keywords = extractKeywords(query)
      return buildPostObject(nextIdStart + idx, a.title, a.content, keywords)
    })
    .join(',\n')

  const updated = insertPostsIntoSource(current, postsTs)

  await putFileToGithub({
    token: ghToken,
    repo,
    path,
    branch,
    message: `Автопубликация: ${articles.length} новых SEO-статей на основе популярных запросов`,
    content: updated,
    sha,
    authorName,
    authorEmail,
  })

  return NextResponse.json({ 
    ok: true, 
    added: articles.length, 
    queries: queries,
    ai: true 
  })
}


