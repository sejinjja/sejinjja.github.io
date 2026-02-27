/// <reference types="node" />
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

interface FeedItem {
  title: string
  description: string
  link: string
  pubDate: string
  guid: string
}

interface ArticleMeta {
  title?: string
  description?: string
  date?: string
}

function normalizeSiteUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

async function extractMetaFromFrontmatter(filePath: string): Promise<ArticleMeta> {
  const content = await readFile(filePath, 'utf-8')
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  const fm = frontmatterMatch?.[1]
  if (!fm) return {}

  const titleMatch = fm.match(/^title:\s*"?([^"\n]+)"?/m)
  const descriptionMatch = fm.match(/^description:\s*"?([^"\n]+)"?/m)
  const dateMatch = fm.match(/^date:\s*"?([^"\n]+)"?/m)

  return {
    title: titleMatch?.[1]?.trim(),
    description: descriptionMatch?.[1]?.trim(),
    date: dateMatch?.[1]?.trim(),
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(config.public.siteUrl || 'https://sejinjja.github.io')
  const writingRoot = resolve(process.cwd(), 'content', 'writing')

  const items: FeedItem[] = []

  if (existsSync(writingRoot)) {
    const files = await readdir(writingRoot)
    const mdFiles = files.filter((f) => f.endsWith('.md'))

    const parsed = await Promise.all(
      mdFiles.map(async (file) => {
        const slug = file.slice(0, -3)
        const meta = await extractMetaFromFrontmatter(resolve(writingRoot, file))
        return { slug, meta }
      }),
    )

    const sorted = parsed
      .filter(({ meta }) => meta.date)
      .sort((a, b) => (b.meta.date ?? '').localeCompare(a.meta.date ?? ''))

    for (const { slug, meta } of sorted) {
      if (!meta.title) continue
      const link = `${siteUrl}/writing/${slug}`
      const pubDate = meta.date ? new Date(meta.date).toUTCString() : ''
      items.push({
        title: meta.title,
        description: meta.description ?? '',
        link,
        pubDate,
        guid: link,
      })
    }
  }

  const buildDate = new Date().toUTCString()
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml('조세진 | 글')}</title>`,
    `<link>${escapeXml(siteUrl)}</link>`,
    `<description>${escapeXml('실무에서 부딪힌 문제와 해결 과정을 기록합니다.')}</description>`,
    '<language>ko</language>',
    `<lastBuildDate>${buildDate}</lastBuildDate>`,
    `<atom:link href="${escapeXml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml"/>`,
    ...items.map(({ title, description, link, pubDate, guid }) => [
      '<item>',
      `<title>${escapeXml(title)}</title>`,
      `<link>${escapeXml(link)}</link>`,
      description ? `<description>${escapeXml(description)}</description>` : '',
      pubDate ? `<pubDate>${pubDate}</pubDate>` : '',
      `<guid isPermaLink="true">${escapeXml(guid)}</guid>`,
      '</item>',
    ].filter(Boolean).join('')),
    '</channel>',
    '</rss>',
  ].join('')

  setHeader(event, 'content-type', 'application/rss+xml; charset=UTF-8')
  return xml
})
