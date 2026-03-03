import {
  WRITING_BASE_PATH,
  WRITING_LIST_SEARCH_QUERY_PARAM,
  WRITING_LIST_TAG_QUERY_PARAM,
} from '~/constants/writing'

export interface WritingListSourceItem {
  path: string
  title?: string
  description?: string
  date?: string
  tags?: string[]
  meta?: {
    description?: string
    date?: string
    tags?: string[]
  }
}

export interface WritingListResponseItem {
  path: string
  title: string
  description: string
  date: string
  tags: string[]
}

export interface WritingListFilterOptions {
  searchQuery?: string
  tag?: string
}

interface WritingListQuery {
  [WRITING_LIST_SEARCH_QUERY_PARAM]?: unknown
  [WRITING_LIST_TAG_QUERY_PARAM]?: unknown
}

function parseDateToTimestamp(dateStr: string): number {
  const timestamp = Date.parse(dateStr)
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp
}

function normalizeQueryValue(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (Array.isArray(value)) {
    return normalizeQueryValue(value[0])
  }

  return ''
}

function normalizeFilterOptions(options: WritingListFilterOptions): Required<WritingListFilterOptions> {
  return {
    searchQuery: normalizeQueryValue(options.searchQuery),
    tag: normalizeQueryValue(options.tag),
  }
}

function matchesSearchQuery(item: WritingListResponseItem, searchQuery: string): boolean {
  if (!searchQuery) {
    return true
  }

  const searchableText = [
    item.title,
    item.description,
    ...item.tags,
  ]
    .join(' ')
    .toLocaleLowerCase()

  return searchableText.includes(searchQuery)
}

function matchesTag(item: WritingListResponseItem, tag: string): boolean {
  if (!tag) {
    return true
  }

  return item.tags.some((itemTag) => itemTag.toLocaleLowerCase() === tag)
}

export function normalizeWritingList(items: WritingListSourceItem[]): WritingListResponseItem[] {
  return [...items]
    .map((item) => ({
      path: item.path,
      title: item.title || '',
      description: item.description || item.meta?.description || '',
      date: item.date || item.meta?.date || '',
      tags: item.tags || item.meta?.tags || [],
    }))
    .filter((item) => item.path !== WRITING_BASE_PATH)
    .sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      const dateDiff = parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date)
      if (dateDiff !== 0) {
        return dateDiff
      }
      return b.date.localeCompare(a.date)
    })
}

export function buildWritingListFilterOptionsFromQuery(query: WritingListQuery): WritingListFilterOptions {
  return {
    searchQuery: normalizeQueryValue(query[WRITING_LIST_SEARCH_QUERY_PARAM]),
    tag: normalizeQueryValue(query[WRITING_LIST_TAG_QUERY_PARAM]),
  }
}

export function buildWritingListQueryParams(filters: WritingListFilterOptions): Record<string, string> {
  const normalized = normalizeFilterOptions(filters)
  const params: Record<string, string> = {}

  if (normalized.searchQuery) {
    params[WRITING_LIST_SEARCH_QUERY_PARAM] = normalized.searchQuery
  }

  if (normalized.tag) {
    params[WRITING_LIST_TAG_QUERY_PARAM] = normalized.tag
  }

  return params
}

export function filterWritingList(
  items: WritingListResponseItem[],
  filters: WritingListFilterOptions,
): WritingListResponseItem[] {
  const normalized = normalizeFilterOptions(filters)
  const normalizedSearchQuery = normalized.searchQuery.toLocaleLowerCase()
  const normalizedTag = normalized.tag.toLocaleLowerCase()

  return items.filter((item) => (
    matchesSearchQuery(item, normalizedSearchQuery)
    && matchesTag(item, normalizedTag)
  ))
}
