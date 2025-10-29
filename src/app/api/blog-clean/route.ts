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

export async function GET(request: Request) {
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

  type Post = { raw: string; id?: number; slug?: string; title?: string; date?: string; content?: string; readTime?: string }
  const parsed: Post[] = chunks.map((raw) => {
    const idMatch = raw.match(/id:\s*(\d+)/)
    const slugMatch = raw.match(/slug:\s*(['\"])(.*?)\1/)
    const titleMatch = raw.match(/title:\s*("[\s\S]*?"|'[\s\S]*?')/)
    const dateMatch = raw.match(/date:\s*([^,]+)/)
    // поддерживаем и шаблонные строки, и обычные кавычки
    const contentMatch = raw.match(/content:\s*(?:`([\s\S]*?)`|"([\s\S]*?)"|'([\s\S]*?)')/)
    const rtMatch = raw.match(/readTime:\s*([^,]+)/)
    return {
      raw,
      id: idMatch ? parseInt(idMatch[1]) : undefined,
      slug: slugMatch ? slugMatch[2] : undefined,
      title: titleMatch ? JSON.parse(titleMatch[1].replace(/'/g, '"')) : undefined,
      date: dateMatch ? dateMatch[1].trim().replace(/(^'|^"|"$|'$)/g, '') : undefined,
      content: contentMatch ? (contentMatch[1] || contentMatch[2] || contentMatch[3]) : undefined,
      readTime: rtMatch ? rtMatch[1].trim().replace(/(^'|^"|"$|'$)/g, '') : undefined,
    }
  })

  // Недеструктивная нормализация: никого не удаляем, только добавляем slug и/или обновляем readTime
  const cleaned: string[] = []
  let changedCount = 0
  for (const p of parsed) {
    let updated = p.raw
    // добавить slug при отсутствии
    const createSlug = (t: string, id?: number) => t
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '') + (id ? `-${id}` : '')
    if (!/\bslug:\s*['\"]/i.test(updated)) {
      const computed = createSlug(p.title || 'post', p.id)
      const nu = updated.replace(/id:\s*\d+\s*,/, (m) => `${m}\n    slug: '${computed}',`)
      if (nu !== updated) {
        updated = nu
        changedCount++
      }
    }
    // обновить readTime, если есть контент
    if (p.content && p.content.trim().length > 0) {
      const newRt = normalizeReadTime(p.content)
      if (/readTime:\s*[^,]+/.test(updated)) {
        const nu = updated.replace(/readTime:\s*[^,]+/, `readTime: '${newRt}'`)
        if (nu !== updated) {
          updated = nu
          changedCount++
        }
      } else {
        const nu = updated.replace(/date:\s*[^,]+,/, (m) => `${m}\n    readTime: '${newRt}',`)
        if (nu !== updated) {
          updated = nu
          changedCount++
        }
      }
    }
    cleaned.push(updated.endsWith('}') ? updated : updated + '}' )
  }

  const newBody = '\n' + cleaned.join(',\n') + '\n'
  const updatedFile = head + newBody + tail

  // DRY RUN через query ?dry=1 или env BLOG_CLEAN_DRY_RUN=1
  const isDry = (() => {
    try {
      const url = new URL(request.url)
      return url.searchParams.get('dry') === '1' || process.env.BLOG_CLEAN_DRY_RUN === '1'
    } catch {
      return process.env.BLOG_CLEAN_DRY_RUN === '1'
    }
  })()

  if (updatedFile === current || changedCount === 0) {
    return NextResponse.json({ ok: true, changed: 0, dryRun: isDry })
  }

  if (isDry) {
    return NextResponse.json({ ok: true, changed: changedCount, dryRun: true })
  }

  await putFileToGithub({
    token: ghToken,
    repo,
    path,
    branch,
    message: 'Нормализация блога: добавлены slug/readTime (без удалений)',
    content: updatedFile,
    sha,
    authorName,
    authorEmail,
  })

  return NextResponse.json({ ok: true, changed: changedCount, dryRun: false })
}


