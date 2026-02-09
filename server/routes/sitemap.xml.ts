/// <reference types="node" />
import { existsSync } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import type { Dirent } from 'node:fs'

interface SitemapEntry {
  loc: string
  lastmod?: string
}

const STATIC_ROUTES = ['/', '/about', '/projects', '/writing']

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

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry: Dirent) => {
    const fullPath = resolve(dir, entry.name)
    if (entry.isDirectory()) {
      return collectMarkdownFiles(fullPath)
    }
    if (entry.isFile() && entry.name.endsWith('.md')) {
      return [fullPath]
    }
    return []
  }))

  return nested.flat()
}

function toWritingRoute(filePath: string, contentRoot: string): string | null {
  const relativePath = relative(contentRoot, filePath).replaceAll('\\', '/')
  const withoutExtension = relativePath.replace(/\.md$/, '')

  const segments = withoutExtension
    .split('/')
    .map((segment: string) => segment.replace(/^\d+\./, ''))
    .filter(Boolean)

  if (segments.some((segment: string) => segment.startsWith('_'))) {
    return null
  }

  const slug = segments.join('/').replace(/\/index$/, '')
  if (!slug) {
    return null
  }

  return `/writing/${slug}`
}

async function getWritingEntries(contentRoot: string, siteUrl: string): Promise<SitemapEntry[]> {
  if (!existsSync(contentRoot)) {
    return []
  }

  const files = await collectMarkdownFiles(contentRoot)
  const entries = await Promise.all(files.map(async (filePath): Promise<SitemapEntry | null> => {
    const route = toWritingRoute(filePath, contentRoot)
    if (!route) {
      return null
    }

    const fileStats = await stat(filePath)
    return {
      loc: `${siteUrl}${route}`,
      lastmod: fileStats.mtime.toISOString(),
    } satisfies SitemapEntry
  }))

  return entries.filter((entry): entry is SitemapEntry => entry !== null)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(config.public.siteUrl || 'https://sejinjja.github.io')
  const writingRoot = resolve(process.cwd(), 'content', 'writing')

  const staticEntries: SitemapEntry[] = STATIC_ROUTES.map((route) => ({
    loc: `${siteUrl}${route}`,
  }))

  const writingEntries = await getWritingEntries(writingRoot, siteUrl)
  const allEntries = [...staticEntries, ...writingEntries]

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allEntries.map(({ loc, lastmod }) => (
      `<url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
    )),
    '</urlset>',
  ].join('')

  setHeader(event, 'content-type', 'application/xml; charset=UTF-8')
  return xml
})
