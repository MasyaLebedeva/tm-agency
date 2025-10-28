import { NextResponse } from 'next/server'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Простая RSS обработка без внешних зависимостей
async function fetchRss(url: string): Promise<Array<{ title: string; link: string; summary?: string }>> {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    const xml = await res.text()
    // Примитивный парсинг RSS (item -> title/link/description) без matchAll
    const itemRegex = /<item>[\s\S]*?<\/item>/g
    const items: RegExpExecArray[] = []
    let match: RegExpExecArray | null
    while ((match = itemRegex.exec(xml)) !== null) {
      items.push(match)
    }
    return items.slice(0, 8).map((m) => {
      const block = m[0]
      const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)
      const linkMatch = block.match(/<link>(.*?)<\/link>/)
      const descMatch = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/)
      const title = (titleMatch?.[1] || titleMatch?.[2] || '').trim()
      const link = (linkMatch?.[1] || '').trim()
      const summary = (descMatch?.[1] || descMatch?.[2] || '').replace(/<[^>]+>/g, '').trim()
      return { title, link, summary }
    })
  } catch (e) {
    return []
  }
}

function buildPrompt(topic: string, source: { title: string; link: string; summary?: string }) {
  return `Сгенерируй SEO-статью на русском языке (1200-1600 слов) по теме: ${topic}.
  Основа: заголовок и краткая выжимка из источника. Ссылка на источник: ${source.link}
  Требования: h2/h3 подзаголовки, списки, примеры, блок «Выводы», CTA к услугам T&M Agency.
  Не используй точные цитаты, сделай переработку. Укажи релевантные ключевые слова по теме Telegram/TON/Ads/боты.
  `
}

async function generateArticle(openaiKey: string, topic: string, source: { title: string; link: string; summary?: string }) {
  const prompt = buildPrompt(topic, source)
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Ты опытный редактор маркетингового блога T&M Agency.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    }),
  })
  const data = await resp.json()
  const content = data?.choices?.[0]?.message?.content || ''
  return content
}

async function getFileFromGithub(token: string, repo: string, path: string, branch: string) {
  const api = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`
  const res = await fetch(api, { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github+json' } })
  if (!res.ok) throw new Error('GH get file failed')
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

function buildPostObject(id: number, title: string, content: string, keywords: string[]) {
  const date = new Date().toISOString().slice(0, 10)
  const readTime = Math.max(3, Math.min(12, Math.round(content.split(/\s+/).length / 180)))
  return `{
    id: ${id},
    title: ${JSON.stringify(title)},
    description: ${JSON.stringify(title)},
    date: '${date}',
    readTime: ${readTime},
    category: 'Telegram',
    keywords: ${JSON.stringify(keywords)},
    content: ${JSON.stringify(content)}
  }`
}

export async function GET() {
  const openaiKey = process.env.OPENAI_API_KEY || ''
  const ghToken = process.env.GITHUB_TOKEN || ''
  const repo = process.env.GITHUB_REPO || ''
  const branch = process.env.GITHUB_BRANCH || 'main'
  const authorName = process.env.GITHUB_AUTHOR_NAME || 'T&M Bot'
  const authorEmail = process.env.GITHUB_AUTHOR_EMAIL || 'bot@tmads.ru'

  if (!openaiKey || !ghToken || !repo) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 400 })
  }

  // Тематики и источники
  const topics = [
    'Продвижение в Телеграм',
    'Telegram ADS — кейсы и стратегии',
    'TON и экосистема Telegram для бизнеса',
    'Боты для Телеграм: автоматизация и лидогенерация',
    'Лучшие практики ведения Телеграм-каналов',
    'Приложения и мини‑аппы в Telegram (Web Apps)',
  ]
  const rssList = [
    'https://telegram.org/blog?setln=ru&format=rss',
    'https://habr.com/ru/rss/all/all/?fl=ru',
    'https://vc.ru/rss/all',
  ]

  // Собираем кандидатные источники
  const allItems: Array<{ title: string; link: string; summary?: string }> = []
  for (const url of rssList) {
    const items = await fetchRss(url)
    allItems.push(...items)
  }

  // Берём 3 статьи
  const picked = allItems.slice(0, 3)

  // Генерация статей
  const articles: Array<{ title: string; content: string }> = []
  for (let i = 0; i < picked.length; i++) {
    const t = topics[i % topics.length]
    const content = await generateArticle(openaiKey, t, picked[i])
    const title = picked[i].title || `${t}: обзор и рекомендации`
    articles.push({ title, content })
  }

  // Получаем текущий blog-data.ts из GitHub
  const path = 'src/app/blog/blog-data.ts'
  const fileJson = await getFileFromGithub(ghToken, repo, path, branch)
  const sha = fileJson.sha
  const current = Buffer.from(fileJson.content, 'base64').toString('utf8')

  // Определяем следующий id
  const idRegex = /id:\s*(\d+)/g
  const idArr: number[] = []
  let idm: RegExpExecArray | null
  while ((idm = idRegex.exec(current)) !== null) {
    idArr.push(parseInt(idm[1]))
  }
  const idMatch = idArr.sort((a, b) => b - a)
  const nextIdStart = (idMatch[0] || 0) + 1

  const postsTs = articles
    .map((a, idx) => buildPostObject(nextIdStart + idx, a.title, a.content, ['Telegram', 'TON', 'реклама', 'боты']))
    .join(',\n')

  const updated = insertPostsIntoSource(current, postsTs)

  await putFileToGithub({
    token: ghToken,
    repo,
    path,
    branch,
    message: 'Автопубликация: 3 новых статьи (RSS→AI)',
    content: updated,
    sha,
    authorName,
    authorEmail,
  })

  return NextResponse.json({ ok: true, added: articles.length })
}


