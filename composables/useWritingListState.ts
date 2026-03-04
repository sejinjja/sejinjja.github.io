import { computed } from 'vue'
import { useRoute } from '#imports'
import { SEO_ROBOTS_INDEX_FOLLOW, SEO_ROBOTS_NOINDEX_FOLLOW } from '~/constants/seo'
import {
  WRITING_BASE_PATH,
  WRITING_LIST_ASYNC_DATA_KEY,
  WRITING_LIST_DEFAULT_PAGE,
  WRITING_LIST_ENABLE_FACETED_NOINDEX,
  WRITING_LIST_PAGINATION_WINDOW_SIZE,
} from '~/constants/writing'
import {
  buildWritingListCanonicalQueryParams,
  buildWritingListQueryOptionsFromQuery,
  buildWritingListQueryParams,
  isWritingListFacetedVariant,
  type WritingListQueryOptions,
} from '~/utils/writingList'

export interface WritingListPageLink {
  page: number
  isCurrent: boolean
  to: {
    path: string
    query: Record<string, string>
  }
}

function buildCanonicalPathFromQuery(query: Record<string, string>): string {
  const searchParams = new URLSearchParams(query).toString()
  return searchParams ? `${WRITING_BASE_PATH}?${searchParams}` : WRITING_BASE_PATH
}

function createPaginationPageRange(currentPage: number, totalPages: number): number[] {
  const normalizedTotalPages = Math.max(1, totalPages)
  const halfWindowSize = Math.floor(WRITING_LIST_PAGINATION_WINDOW_SIZE / 2)
  let startPage = Math.max(1, currentPage - halfWindowSize)
  let endPage = Math.min(normalizedTotalPages, startPage + WRITING_LIST_PAGINATION_WINDOW_SIZE - 1)

  startPage = Math.max(1, endPage - WRITING_LIST_PAGINATION_WINDOW_SIZE + 1)

  const pages: number[] = []
  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page)
  }

  return pages
}

function applyPageReset(
  baseQuery: WritingListQueryOptions,
  overrides: Partial<WritingListQueryOptions>,
): WritingListQueryOptions {
  const nextQuery = {
    ...baseQuery,
    ...overrides,
  }
  const shouldResetPage = (
    (overrides.searchQuery !== undefined && overrides.searchQuery !== baseQuery.searchQuery)
    || (overrides.tag !== undefined && overrides.tag !== baseQuery.tag)
    || (overrides.sort !== undefined && overrides.sort !== baseQuery.sort)
    || (overrides.pageSize !== undefined && overrides.pageSize !== baseQuery.pageSize)
  )

  if (shouldResetPage) {
    nextQuery.page = WRITING_LIST_DEFAULT_PAGE
  }

  return nextQuery
}

export function useWritingListState() {
  const route = useRoute()

  const queryState = computed(() => buildWritingListQueryOptionsFromQuery(route.query))
  const fetchQuery = computed(() => buildWritingListQueryParams(queryState.value))
  const canonicalQuery = computed(() => buildWritingListCanonicalQueryParams(queryState.value))
  const canonicalPath = computed(() => buildCanonicalPathFromQuery(canonicalQuery.value))
  const isFacetedVariant = computed(() => isWritingListFacetedVariant(queryState.value))
  const robots = computed(() => (
    WRITING_LIST_ENABLE_FACETED_NOINDEX && isFacetedVariant.value
      ? SEO_ROBOTS_NOINDEX_FOLLOW
      : SEO_ROBOTS_INDEX_FOLLOW
  ))
  const asyncDataKey = computed(() => {
    const normalizedQuery = buildWritingListQueryParams(queryState.value, { includeDefaults: true })
    const keySuffix = new URLSearchParams(normalizedQuery).toString()
    return `${WRITING_LIST_ASYNC_DATA_KEY}:${keySuffix}`
  })
  const clearFilterLink = computed(() => ({ path: WRITING_BASE_PATH }))
  const isFiltered = computed(() => Boolean(queryState.value.searchQuery || queryState.value.tag))

  function buildLink(overrides: Partial<WritingListQueryOptions> = {}) {
    const nextQuery = applyPageReset(queryState.value, overrides)

    return {
      path: WRITING_BASE_PATH,
      query: buildWritingListQueryParams(nextQuery),
    }
  }

  function buildTagFilterLink(tag: string) {
    return buildLink({ tag })
  }

  function buildPaginationLink(page: number) {
    return buildLink({ page })
  }

  function buildPaginationLinks(totalPages: number): WritingListPageLink[] {
    return createPaginationPageRange(queryState.value.page, totalPages).map((page) => ({
      page,
      isCurrent: page === queryState.value.page,
      to: buildPaginationLink(page),
    }))
  }

  return {
    asyncDataKey,
    buildLink,
    buildPaginationLink,
    buildPaginationLinks,
    buildTagFilterLink,
    canonicalPath,
    canonicalQuery,
    clearFilterLink,
    fetchQuery,
    isFacetedVariant,
    isFiltered,
    queryState,
    robots,
  }
}
