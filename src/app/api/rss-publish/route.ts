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
  return `Ты опытный эксперт по продвижению в Telegram с 5+ лет практического опыта. Напиши ГЛУБОКУЮ, МАКСИМАЛЬНО ПОЛЕЗНУЮ статью на русском языке по теме: "${query}".

КРИТИЧЕСКИ ВАЖНО - статья должна быть НЕ ПОВЕРХНОСТНОЙ, а давать РЕАЛЬНУЮ ЦЕННОСТЬ:

СТРУКТУРА СТАТЬИ (строго соблюдай):

1. ЗАГОЛОВОК (H1):
   - SEO-оптимизированный заголовок длиной 50-60 символов
   - Должен точно отвечать на запрос пользователя
   - Включай ключевые слова естественным образом

2. ВВОДНАЯ ЧАСТЬ (3-4 абзаца, минимум 200 слов):
   - Начни с конкретной проблемы или ситуации, с которой сталкивается читатель
   - Приведи реальный пример или кейс
   - Объясни, почему эта тема критически важна СЕЙЧАС (в 2025 году)
   - Обещай конкретную пользу, которую получит читатель
   - НЕ используй общие фразы типа "это важно" - дай конкретику

3. ОСНОВНОЙ КОНТЕНТ (минимум 2000-3000 слов, раздели на логические блоки с подзаголовками H2/H3):
   
   ОБЯЗАТЕЛЬНО ВКЛЮЧИ:
   
   a) ПОШАГОВЫЕ ИНСТРУКЦИИ:
      - Детальные шаги с конкретными действиями
      - Что делать, в какой последовательности
      - Какие инструменты использовать (назови конкретные сервисы, боты, платформы)
      - Примеры команд, настроек, формул
   
   b) КОНКРЕТНЫЕ ПРИМЕРЫ И КЕЙСЫ:
      - Реальные цифры и результаты (например: "канал вырос с 1000 до 5000 подписчиков за 3 месяца")
      - Конкретные примеры постов, креативов, текстов
      - Примеры ошибок и как их избежать
      - Сравнение "до" и "после"
   
   c) ПРАКТИЧЕСКИЕ ИНСТРУМЕНТЫ И МЕТОДЫ:
      - Конкретные сервисы, боты, платформы с названиями
      - Формулы расчета (например, ROI, стоимость подписчика)
      - Чек-листы и шаблоны
      - Таблицы сравнения методов/инструментов
   
   d) ГЛУБОКИЙ АНАЛИЗ:
      - Почему одни методы работают, а другие нет
      - Подводные камни и как их обойти
      - Альтернативные подходы и когда их использовать
      - Связь с другими аспектами продвижения
   
   e) ЭКСПЕРТНЫЕ ИНСАЙТЫ:
      - Малоизвестные фишки и лайфхаки
      - Тренды 2025 года
      - Ошибки, которые делают 90% новичков
      - Что работает только в Telegram и нигде больше

4. БЛОК ПРОДАЖИ T&M AGENCY (включи естественно, НЕ навязчиво):
   - После основной полезной информации добавь 1-2 абзаца о том, как T&M Agency помогает решать эти задачи
   - Упомяни конкретные услуги: настройка Telegram ADS, создание ботов, оптимизация каналов, посевы, аналитика
   - Приведи обобщенный кейс (например: "один из наших клиентов увеличил конверсию с 2% до 8% за месяц")
   - Подчеркни экспертизу: 5+ лет на рынке, 100+ довольных клиентов, 200+ успешных проектов
   - Это должно быть естественным продолжением полезного контента, а не отдельной рекламой

5. ПРИЗЫВ К ДЕЙСТВИЮ (CTA):
   - В конце статьи добавь призыв к действию
   - Текст: "Хотите получить бесплатную консультацию и расчет продвижения вашего канала? Оставьте заявку в T&M Agency, и мы поможем вам построить прибыльный бизнес в Telegram."
   - Сделай это естественно, как дружеский совет

СТРОГИЕ ТРЕБОВАНИЯ К КАЧЕСТВУ:

1. ГЛУБИНА, НЕ ПОВЕРХНОСТНОСТЬ:
   - НЕ пиши общие фразы типа "важно выбрать правильный канал"
   - ВМЕСТО ЭТОГО: "Проверь охват последних 10 постов. Если он меньше 15% от подписчиков - канал мертвый. Формула: средний охват / количество подписчиков × 100%"
   
2. КОНКРЕТИКА, НЕ АБСТРАКЦИИ:
   - НЕ: "используй качественный контент"
   - ВМЕСТО: "публикуй посты в формате: проблема (1 абзац) → решение (2-3 абзаца) → призыв к действию (1 предложение). Оптимальная длина: 800-1200 символов"
   
3. ЦИФРЫ И ФАКТЫ:
   - Используй конкретные цифры везде, где возможно
   - Примеры: "средний CTR в Telegram 3-5%", "стоимость подписчика от 5 до 50 рублей", "оптимальное время публикации 8-10 утра и 18-20 вечера"
   
4. ПРАКТИЧЕСКИЕ ИНСТРУКЦИИ:
   - Дай пошаговые действия, которые можно выполнить СЕЙЧАС
   - Включи примеры команд, настроек, формул
   - Добавь чек-листы и шаблоны

5. ЭКСПЕРТНЫЙ УРОВЕНЬ:
   - Пиши как человек, который реально работал с этим
   - Делись инсайтами, которые не найдешь в первой ссылке Google
   - Покажи, что ты знаешь подводные камни и нюансы

ТРЕБОВАНИЯ К SEO:
- Естественно вплетай ключевые слова: Telegram, продвижение, реклама, боты, TON, канал, монетизация
- Используй LSI-слова (синонимы и связанные термины)
- Структурируй контент подзаголовками H2/H3

ОБЪЕМ:
- Минимум 2500-3500 слов качественного контента
- Каждое предложение должно нести ценность
- НИКАКОЙ "воды" и общих фраз

ВАЖНО:
- Статья должна быть настолько полезной, что читатель захочет сохранить её и вернуться к ней
- После прочтения читатель должен понимать КОНКРЕТНО, что делать дальше
- Продажа агентства должна быть естественной, не навязчивой
- Текст должен читаться как написанный реальным экспертом с опытом

Начни писать статью прямо сейчас, следуя этой структуре. Помни: ГЛУБИНА и КОНКРЕТИКА - это главное.`
}

async function generateArticle(openaiKey: string, query: string): Promise<{ title: string; content: string }> {
  const prompt = buildPrompt(query)
  
  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'Ты опытный копирайтер и SEO-специалист, который пишет полезные, продающие статьи для маркетингового блога T&M Agency - первого рекламного агентства, специализирующегося на продвижении в Telegram. Ты пишешь максимально человекоподобно, даешь реальную ценность читателям и естественно интегрируешь информацию об агентстве.' 
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
      }),
    })
    
    if (!resp.ok) {
      const errorText = await resp.text()
      console.error(`OpenAI API error: ${resp.status} ${resp.statusText}`)
      console.error(`Response: ${errorText}`)
      throw new Error(`OpenAI API failed: ${resp.status} ${resp.statusText} - ${errorText}`)
    }
    
    const data = await resp.json()
    
    if (!data?.choices?.[0]?.message?.content) {
      console.error('OpenAI response structure:', JSON.stringify(data, null, 2))
      throw new Error('OpenAI returned empty content')
    }
    
    const fullContent = data.choices[0].message.content.trim()
    
    // Минимальная длина контента - 2000 символов (примерно 1500-2000 слов)
    if (!fullContent || fullContent.length < 2000) {
      console.error(`Generated content too short: ${fullContent.length} chars`)
      console.error(`Content preview: ${fullContent.substring(0, 500)}`)
      throw new Error(`Generated content is too short: ${fullContent.length} characters (minimum required: 2000)`)
    }
    
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
    
    // Если контент пустой после удаления заголовка, используем полный контент
    if (!content || content.length < 100) {
      console.warn('Content was empty after removing title, using full content')
      content = fullContent
    }
    
    // Проверяем финальный контент - минимум 2000 символов
    if (!content || content.length < 2000) {
      throw new Error(`Final content is too short: ${content.length} characters (minimum required: 2000)`)
    }
    
    console.log(`✅ Generated article for "${query}": title="${title.substring(0, 50)}...", content length=${content.length}`)
    
    return { title, content }
  } catch (error: any) {
    console.error(`❌ Error generating article for query "${query}":`, error.message)
    throw error
  }
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
    const errorText = await res.text()
    console.error(`GitHub API PUT error: ${res.status} ${res.statusText}`)
    console.error(`URL: ${api}`)
    console.error(`Response: ${errorText}`)
    throw new Error(`GH put failed: ${res.status} ${res.statusText} - ${errorText}`)
  }
  return await res.json()
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

  try {
    const result = await putFileToGithub({
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
    
    console.log('Successfully published to GitHub:', result.commit?.html_url)
    
    return NextResponse.json({ 
      ok: true, 
      added: articles.length, 
      queries: queries,
      ai: true,
      commitUrl: result.commit?.html_url,
      message: 'Статьи успешно добавлены в GitHub. Сайт будет пересобран автоматически.'
    })
  } catch (error: any) {
    console.error('Error publishing to GitHub:', error)
    return NextResponse.json({ 
      error: 'Failed to publish articles to GitHub',
      details: error.message,
      hint: 'Check GITHUB_TOKEN permissions and GITHUB_REPO format',
      repo: repo,
      path: path,
      branch: branch,
      articlesGenerated: articles.length
    }, { status: 500 })
  }
}


