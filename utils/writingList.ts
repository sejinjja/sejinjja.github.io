import {
  WRITING_BASE_PATH,
  WRITING_LIST_DEFAULT_PAGE,
  WRITING_LIST_DEFAULT_PAGE_SIZE,
  WRITING_LIST_DEFAULT_SORT,
  WRITING_LIST_MAX_PAGE_SIZE,
  WRITING_LIST_PAGE_QUERY_PARAM,
  WRITING_LIST_PAGE_SIZE_QUERY_PARAM,
  WRITING_LIST_SEARCH_QUERY_PARAM,
  WRITING_LIST_SORT_OPTIONS,
  WRITING_LIST_SORT_QUERY_PARAM,
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

export type WritingListSort = typeof WRITING_LIST_SORT_OPTIONS[number]

export interface WritingListQueryOptions extends Required<WritingListFilterOptions> {
  sort: WritingListSort
  page: number
  pageSize: number
}

export interface WritingListPaginationMeta {
  totalCount: number
  totalPages: number
  currentPage: number
}

export interface WritingListApiResponse {
  items: WritingListResponseItem[]
  pagination: WritingListPaginationMeta
}

export interface ProcessedWritingListResult extends WritingListApiResponse {
  isPageOutOfRange: boolean
}

interface WritingListQuery {
  [WRITING_LIST_SEARCH_QUERY_PARAM]?: unknown
  [WRITING_LIST_TAG_QUERY_PARAM]?: unknown
  [WRITING_LIST_SORT_QUERY_PARAM]?: unknown
  [WRITING_LIST_PAGE_QUERY_PARAM]?: unknown
  [WRITING_LIST_PAGE_SIZE_QUERY_PARAM]?: unknown
}

interface QueryParamBuildOptions {
  includeDefaults?: boolean
}

interface WritingListQueryOptionInput {
  searchQuery?: unknown
  tag?: unknown
  sort?: unknown
  page?: unknown
  pageSize?: unknown
}

function parseDateToTimestamp(dateStr: string): number {
  const timestamp = Date.parse(dateStr)
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp
}

function normalizeQueryValue(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  if (Array.isArray(value)) {
    return normalizeQueryValue(value[0])
  }

  return ''
}

function parsePositiveInteger(value: string): number | null {
  if (!/^\d+$/.test(value)) {
    return null
  }

  const parsed = Number.parseInt(value, 10)
  return parsed > 0 ? parsed : null
}

function normalizePositiveInteger(value: unknown, fallback: number, maxValue?: number): number {
  const normalized = normalizeQueryValue(value)
  const parsed = parsePositiveInteger(normalized)

  if (!parsed) {
    return fallback
  }

  if (typeof maxValue === 'number') {
    return Math.min(parsed, maxValue)
  }

  return parsed
}

function normalizeFilterOptions(options: { searchQuery?: unknown, tag?: unknown }): Required<WritingListFilterOptions> {
  return {
    searchQuery: normalizeQueryValue(options.searchQuery),
    tag: normalizeQueryValue(options.tag),
  }
}

function normalizeSort(value: unknown): WritingListSort {
  const normalizedSort = normalizeQueryValue(value).toLocaleLowerCase()
  return WRITING_LIST_SORT_OPTIONS.find((sortOption) => sortOption === normalizedSort) || WRITING_LIST_DEFAULT_SORT
}

function normalizeQueryOptions(options: WritingListQueryOptionInput = {}): WritingListQueryOptions {
  const normalizedFilters = normalizeFilterOptions(options)

  return {
    ...normalizedFilters,
    sort: normalizeSort(options.sort),
    page: normalizePositiveInteger(options.page, WRITING_LIST_DEFAULT_PAGE),
    pageSize: normalizePositiveInteger(options.pageSize, WRITING_LIST_DEFAULT_PAGE_SIZE, WRITING_LIST_MAX_PAGE_SIZE),
  }
}

function compareByDate(a: WritingListResponseItem, b: WritingListResponseItem, sort: WritingListSort): number {
  const hasDateA = Boolean(a.date)
  const hasDateB = Boolean(b.date)

  if (!hasDateA && !hasDateB) return 0
  if (!hasDateA) return 1
  if (!hasDateB) return -1

  const timestampA = parseDateToTimestamp(a.date)
  const timestampB = parseDateToTimestamp(b.date)

  if (timestampA === Number.NEGATIVE_INFINITY && timestampB === Number.NEGATIVE_INFINITY) {
    return 0
  }
  if (timestampA === Number.NEGATIVE_INFINITY) {
    return 1
  }
  if (timestampB === Number.NEGATIVE_INFINITY) {
    return -1
  }

  if (sort === WRITING_LIST_DEFAULT_SORT) {
    const dateDiff = timestampB - timestampA
    if (dateDiff !== 0) {
      return dateDiff
    }
    return b.date.localeCompare(a.date)
  }

  const dateDiff = timestampA - timestampB
  if (dateDiff !== 0) {
    return dateDiff
  }
  return a.date.localeCompare(b.date)
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

function calculateTotalPages(totalCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalCount / pageSize))
}

function hasFacetedSignals(options: WritingListQueryOptions): boolean {
  return (
    Boolean(options.searchQuery)
    || Boolean(options.tag)
    || options.sort !== WRITING_LIST_DEFAULT_SORT
    || options.pageSize !== WRITING_LIST_DEFAULT_PAGE_SIZE
  )
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
}

export function buildWritingListQueryOptionsFromQuery(query: WritingListQuery): WritingListQueryOptions {
  return normalizeQueryOptions({
    searchQuery: query[WRITING_LIST_SEARCH_QUERY_PARAM],
    tag: query[WRITING_LIST_TAG_QUERY_PARAM],
    sort: query[WRITING_LIST_SORT_QUERY_PARAM],
    page: query[WRITING_LIST_PAGE_QUERY_PARAM],
    pageSize: query[WRITING_LIST_PAGE_SIZE_QUERY_PARAM],
  })
}

export function buildWritingListFilterOptionsFromQuery(query: WritingListQuery): WritingListFilterOptions {
  const normalized = buildWritingListQueryOptionsFromQuery(query)

  return {
    searchQuery: normalized.searchQuery,
    tag: normalized.tag,
  }
}

export function buildWritingListQueryParams(
  options: Partial<WritingListQueryOptions>,
  config: QueryParamBuildOptions = {},
): Record<string, string> {
  const includeDefaults = config.includeDefaults ?? false
  const normalized = normalizeQueryOptions(options)
  const params: Record<string, string> = {}

  if (normalized.searchQuery) {
    params[WRITING_LIST_SEARCH_QUERY_PARAM] = normalized.searchQuery
  }

  if (normalized.tag) {
    params[WRITING_LIST_TAG_QUERY_PARAM] = normalized.tag
  }

  if (includeDefaults || normalized.sort !== WRITING_LIST_DEFAULT_SORT) {
    params[WRITING_LIST_SORT_QUERY_PARAM] = normalized.sort
  }

  if (includeDefaults || normalized.page !== WRITING_LIST_DEFAULT_PAGE) {
    params[WRITING_LIST_PAGE_QUERY_PARAM] = String(normalized.page)
  }

  if (includeDefaults || normalized.pageSize !== WRITING_LIST_DEFAULT_PAGE_SIZE) {
    params[WRITING_LIST_PAGE_SIZE_QUERY_PARAM] = String(normalized.pageSize)
  }

  return params
}

export function buildWritingListCanonicalQueryParams(options: Partial<WritingListQueryOptions>): Record<string, string> {
  const normalized = normalizeQueryOptions(options)

  if (hasFacetedSignals(normalized)) {
    return {}
  }

  if (normalized.page === WRITING_LIST_DEFAULT_PAGE) {
    return {}
  }

  return {
    [WRITING_LIST_PAGE_QUERY_PARAM]: String(normalized.page),
  }
}

export function isWritingListFacetedVariant(options: Partial<WritingListQueryOptions>): boolean {
  const normalized = normalizeQueryOptions(options)

  return hasFacetedSignals(normalized)
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

export function sortWritingList(
  items: WritingListResponseItem[],
  sort: WritingListSort,
): WritingListResponseItem[] {
  return [...items].sort((a, b) => compareByDate(a, b, sort))
}

export function paginateWritingList(
  items: WritingListResponseItem[],
  page: number,
  pageSize: number,
): ProcessedWritingListResult {
  const normalizedPage = normalizePositiveInteger(page, WRITING_LIST_DEFAULT_PAGE)
  const normalizedPageSize = normalizePositiveInteger(pageSize, WRITING_LIST_DEFAULT_PAGE_SIZE, WRITING_LIST_MAX_PAGE_SIZE)
  const totalCount = items.length
  const totalPages = calculateTotalPages(totalCount, normalizedPageSize)
  const isPageOutOfRange = normalizedPage > totalPages
  const startIndex = (normalizedPage - 1) * normalizedPageSize
  const endIndex = startIndex + normalizedPageSize

  return {
    items: isPageOutOfRange ? [] : items.slice(startIndex, endIndex),
    pagination: {
      totalCount,
      totalPages,
      currentPage: normalizedPage,
    },
    isPageOutOfRange,
  }
}

export function buildWritingListApiResponse(
  items: WritingListResponseItem[],
  options: Partial<WritingListQueryOptions>,
): ProcessedWritingListResult {
  const normalizedQuery = normalizeQueryOptions(options)
  const filteredItems = filterWritingList(items, normalizedQuery)
  const sortedItems = sortWritingList(filteredItems, normalizedQuery.sort)

  return paginateWritingList(sortedItems, normalizedQuery.page, normalizedQuery.pageSize)
}
