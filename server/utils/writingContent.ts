/// <reference types="node" />
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import type { Dirent } from 'node:fs'
import {
  fileRelativePathToWritingRoute,
  resolveWritingRouteCandidates,
} from '~/utils/writingRoute'

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
  const entries = (await readdir(dir, { withFileTypes: true }))
    .sort((a, b) => a.name.localeCompare(b.name))
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
  return fileRelativePathToWritingRoute(relativePath)
}

export async function getWritingContentEntries(contentRoot: string): Promise<WritingContentEntry[]> {
  if (!existsSync(contentRoot)) {
    return []
  }

  const files = await collectMarkdownFiles(contentRoot)
  const routeResolution = resolveWritingRouteCandidates(
    files.map((filePath) => ({
      sourcePath: filePath,
      relativePath: relative(contentRoot, filePath),
    })),
  )
  for (const collision of routeResolution.collisions) {
    console.warn(
      `[writing-route] Duplicate route "${collision.route}" detected. `
      + `Keeping "${collision.keptSourcePath}" and skipping: ${collision.skippedSourcePaths.join(', ')}`,
    )
  }

  const entries = await Promise.all(
    routeResolution.entries.map(async ({ sourcePath, route, slug }): Promise<WritingContentEntry> => {
      const meta = await extractWritingMeta(sourcePath)
      return {
        filePath: sourcePath,
        route,
        slug,
        meta,
      }
    }),
  )

  return entries
}
