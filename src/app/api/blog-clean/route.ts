import { NextResponse } from 'next/server'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

function normalizeReadTime(contentHtml: string): string {
  const words = contentHtml.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean)
  const minutes = Math.max(3, Math.min(12, Math.round(words.length / 180)))
  return `${minutes} мин`
}

export async function GET() {
  const ghToken = process.env.GITHUB_TOKEN || ''
  const repo = process.env.GITHUB_REPO || ''
  const branch = process.env.GITHUB_BRANCH || 'main'
  const authorName = process.env.GITHUB_AUTHOR_NAME || 'T&M Bot'
  const authorEmail = process.env.GITHUB_AUTHOR_EMAIL || 'bot@tmads.ru'

  if (!ghToken || !repo) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 400 })
  }

  const path = 'src/app/blog/blog-data.ts'
  const fileJson = await getFileFromGithub(ghToken, repo, path, branch)
  const sha = fileJson.sha
  const current = Buffer.from(fileJson.content, 'base64').toString('utf8')

  // Выделяем массив постов
  const startMarker = 'export const blogPosts = ['
  const sIdx = current.indexOf(startMarker)
  const eIdx = current.lastIndexOf(']')
  if (sIdx === -1 || eIdx === -1) {
    return NextResponse.json({ error: 'blogPosts array not found' }, { status: 500 })
  }
  const head = current.slice(0, sIdx + startMarker.length)
  const body = current.slice(sIdx + startMarker.length, eIdx)
  const tail = current.slice(eIdx)

  // Грубое разбиение объектов по строке "},\n" (контент в бэктиках не содержит "},\n" на новой строке обычно)
  const chunks = body
    .split(/\n\s*},\s*\n/)
    .map((c) => c.trim())
    .filter(Boolean)

  type Post = { raw: string; id?: number; title?: string; date?: string; content?: string; readTime?: string }
  const parsed: Post[] = chunks.map((raw) => {
    const idMatch = raw.match(/id:\s*(\d+)/)
    const titleMatch = raw.match(/title:\s*("[\s\S]*?"|'[\s\S]*?')/)
    const dateMatch = raw.match(/date:\s*([^,]+)/)
    const contentMatch = raw.match(/content:\s*`([\s\S]*?)`/)
    const rtMatch = raw.match(/readTime:\s*([^,]+)/)
    return {
      raw,
      id: idMatch ? parseInt(idMatch[1]) : undefined,
      title: titleMatch ? JSON.parse(titleMatch[1].replace(/'/g, '"')) : undefined,
      date: dateMatch ? dateMatch[1].trim().replace(/(^'|^"|"$|'$)/g, '') : undefined,
      content: contentMatch ? contentMatch[1] : undefined,
      readTime: rtMatch ? rtMatch[1].trim().replace(/(^'|^"|"$|'$)/g, '') : undefined,
    }
  })

  // Фильтруем пустые/дубли (контент < 80 символов) и дубликаты title+date
  const seen = new Set<string>()
  const cleaned: string[] = []
  for (const p of parsed) {
    const key = `${p.title || ''}__${p.date || ''}`
    // Удаляем повторы заголовка внутри контента
    const rawHtml = (p.content || '').trim()
    const titleEsc = (p.title || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const removeTitleOnce = (s: string) => s
      .replace(new RegExp(`<h1[^>]*>\\s*${titleEsc}\\s*</h1>`, 'gi'), '')
      .replace(new RegExp(`<h2[^>]*>\\s*${titleEsc}\\s*</h2>`, 'gi'), '')
      .replace(new RegExp(`<p[^>]*>\\s*${titleEsc}\\s*</p>`, 'gi'), '')
      .replace(new RegExp(`(^|\\n)\\s*${titleEsc}\\s*(?=\\n|$)`, 'g'), '')
    let html = removeTitleOnce(rawHtml)
    html = removeTitleOnce(html).trim()
    if (html.length < 80) continue
    if (seen.has(key)) continue
    seen.add(key)
    // Обновляем readTime в сыром куске
    const newRt = normalizeReadTime(html)
    let updated = p.raw
    // Обновляем содержимое контента
    updated = updated.replace(/content:\s*`([\s\S]*?)`/, (m, g1) => {
      return `content: ` + '`' + html + '`'
    })
    if (/readTime:\s*[^,]+/.test(updated)) {
      updated = updated.replace(/readTime:\s*[^,]+/, `readTime: '${newRt}'`)
    } else {
      updated = updated.replace(/date:\s*[^,]+,/, (m) => `${m}\n    readTime: '${newRt}',`)
    }
    cleaned.push(updated.endsWith('}') ? updated : updated + '}')
  }

  const newBody = '\n' + cleaned.join(',\n') + '\n'
  const updatedFile = head + newBody + tail

  if (updatedFile === current) {
    return NextResponse.json({ ok: true, changed: 0 })
  }

  await putFileToGithub({
    token: ghToken,
    repo,
    path,
    branch,
    message: 'Очистка блога: удалены дубли и пустые статьи, обновлено время чтения',
    content: updatedFile,
    sha,
    authorName,
    authorEmail,
  })

  return NextResponse.json({ ok: true, removed: parsed.length - cleaned.length, kept: cleaned.length })
}


