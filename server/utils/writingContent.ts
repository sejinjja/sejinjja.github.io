/// <reference types="node" />
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import type { Dirent } from 'node:fs'
import { WRITING_BASE_PATH } from '~/constants/writing'

const FRONTMATTER_BLOCK_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/

export interface WritingMeta {
  title?: string
  description?: string
  date?: string
  tags: string[]
}

export interface WritingContentEntry {
  filePath: string
  route: string
  slug: string
  meta: WritingMeta
}

export interface RouteEntry {
  loc: string
  lastmod?: string
}

export function normalizeSiteUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function parseDateToIso(date?: string): string | undefined {
  if (!date) {
    return undefined
  }

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed.toISOString()
}

export function parseDateToUtc(date?: string, fallback = new Date()): string {
  const parsed = date ? new Date(date) : fallback
  if (Number.isNaN(parsed.getTime())) {
    return fallback.toUTCString()
  }

  return parsed.toUTCString()
}

function extractFrontmatter(content: string): string | undefined {
  return content.match(FRONTMATTER_BLOCK_PATTERN)?.[1]
}

function extractFrontmatterValue(frontmatter: string, key: string): string | undefined {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`^${escapedKey}:\\s*(?:"([^"]*)"|'([^']*)'|(.+))$`, 'm')
  const match = frontmatter.match(pattern)
  return (match?.[1] ?? match?.[2] ?? match?.[3])?.trim()
}

function parseTags(rawTags?: string): string[] {
  if (!rawTags) {
    return []
  }

  if (rawTags.startsWith('[') && rawTags.endsWith(']')) {
    return rawTags
      .slice(1, -1)
      .split(',')
      .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  return rawTags
    .split(',')
    .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}

export async function extractWritingMeta(filePath: string): Promise<WritingMeta> {
  const content = await readFile(filePath, 'utf-8')
  const frontmatter = extractFrontmatter(content)
  if (!frontmatter) {
    return { tags: [] }
  }

  return {
    title: extractFrontmatterValue(frontmatter, 'title'),
    description: extractFrontmatterValue(frontmatter, 'description'),
    date: extractFrontmatterValue(frontmatter, 'date'),
    tags: parseTags(extractFrontmatterValue(frontmatter, 'tags')),
  }
}

export async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry: Dirent) => {
      const fullPath = resolve(dir, entry.name)
      if (entry.isDirectory()) {
        return collectMarkdownFiles(fullPath)
      }
      if (entry.isFile() && entry.name.endsWith('.md')) {
        return [fullPath]
      }
      return []
    }),
  )

  return nested.flat()
}

export function toWritingRoute(filePath: string, contentRoot: string): string | null {
  const relativePath = relative(contentRoot, filePath).replaceAll('\\', '/')
  const withoutExtension = relativePath.replace(/\.md$/, '')

  const segments = withoutExtension
    .split('/')
    .map((segment) => segment.replace(/^\d+\./, ''))
    .filter(Boolean)

  if (segments.some((segment) => segment.startsWith('_'))) {
    return null
  }

  const slug = segments.join('/').replace(/\/index$/, '')
  if (!slug) {
    return null
  }

  return `${WRITING_BASE_PATH}/${slug}`
}

export async function getWritingContentEntries(contentRoot: string): Promise<WritingContentEntry[]> {
  if (!existsSync(contentRoot)) {
    return []
  }

  const files = await collectMarkdownFiles(contentRoot)
  const entries = await Promise.all(
    files.map(async (filePath): Promise<WritingContentEntry | null> => {
      const route = toWritingRoute(filePath, contentRoot)
      if (!route) {
        return null
      }

      const slug = route.slice(`${WRITING_BASE_PATH}/`.length)
      const meta = await extractWritingMeta(filePath)
      return {
        filePath,
        route,
        slug,
        meta,
      }
    }),
  )

  return entries.filter((entry): entry is WritingContentEntry => entry !== null)
}
