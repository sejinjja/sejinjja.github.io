import {
  DEFAULT_CANONICAL_PATH,
  DEFAULT_META_DESCRIPTION,
  DEFAULT_META_IMAGE,
  DEFAULT_META_KEYWORDS,
  DEFAULT_META_TITLE,
  SEO_KEYWORD_DELIMITER,
  SEO_TYPE_WEBSITE,
  SEO_TYPES,
  type SeoType,
} from '~/constants/seo'

export interface SeoState {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  type: SeoType
  keywords: string[]
  canonicalPath: string
  image: string
}

export interface SeoStateInput {
  title?: unknown
  description?: unknown
  ogTitle?: unknown
  ogDescription?: unknown
  type?: unknown
  keywords?: unknown
  canonicalPath?: unknown
  image?: unknown
}

const SEO_STATE_FIELDS = [
  'title',
  'description',
  'ogTitle',
  'ogDescription',
  'type',
  'keywords',
  'canonicalPath',
  'image',
] as const

type SeoStateField = typeof SEO_STATE_FIELDS[number]

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value === 'string') {
    const trimmedValue = value.trim()
    return trimmedValue || fallback
  }

  return fallback
}

function hasOwnField(input: SeoStateInput, field: SeoStateField): boolean {
  return Object.prototype.hasOwnProperty.call(input, field)
}

export function normalizeSeoType(value: unknown): SeoType {
  if (typeof value !== 'string') {
    return SEO_TYPE_WEBSITE
  }

  const normalizedType = value.trim().toLocaleLowerCase()
  return SEO_TYPES.some((seoType) => seoType === normalizedType)
    ? normalizedType as SeoType
    : SEO_TYPE_WEBSITE
}

export function normalizeSeoKeywords(value: unknown): string[] {
  const sourceValues = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(SEO_KEYWORD_DELIMITER)
      : []

  const keywords: string[] = []
  const seen = new Set<string>()

  for (const sourceValue of sourceValues) {
    if (typeof sourceValue !== 'string') {
      continue
    }

    for (const keywordToken of sourceValue.split(SEO_KEYWORD_DELIMITER)) {
      const normalizedKeyword = keywordToken.trim()
      const normalizedKey = normalizedKeyword.toLocaleLowerCase()

      if (!normalizedKeyword || seen.has(normalizedKey)) {
        continue
      }

      seen.add(normalizedKey)
      keywords.push(normalizedKeyword)
    }
  }

  return keywords
}

export function buildSeoState(input: SeoStateInput = {}): SeoState {
  const title = normalizeText(input.title, DEFAULT_META_TITLE)
  const description = normalizeText(input.description, DEFAULT_META_DESCRIPTION)

  return {
    title,
    description,
    ogTitle: normalizeText(input.ogTitle, title),
    ogDescription: normalizeText(input.ogDescription, description),
    type: normalizeSeoType(input.type),
    keywords: normalizeSeoKeywords(input.keywords ?? DEFAULT_META_KEYWORDS),
    canonicalPath: normalizeText(input.canonicalPath, DEFAULT_CANONICAL_PATH),
    image: normalizeText(input.image, DEFAULT_META_IMAGE),
  }
}

export function mergeSeoState(baseState: SeoState, nextInput: SeoStateInput = {}): SeoState {
  const mergedInput: SeoStateInput = { ...baseState }

  for (const field of SEO_STATE_FIELDS) {
    if (hasOwnField(nextInput, field)) {
      mergedInput[field] = nextInput[field]
    }
  }

  return buildSeoState(mergedInput)
}
