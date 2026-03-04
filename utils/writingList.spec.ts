import { describe, expect, it } from 'vitest'
import {
  WRITING_LIST_DEFAULT_PAGE,
  WRITING_LIST_DEFAULT_PAGE_SIZE,
  WRITING_LIST_DEFAULT_SORT,
  WRITING_LIST_MAX_PAGE_SIZE,
  WRITING_LIST_SORT_LATEST,
  WRITING_LIST_SORT_OLDEST,
} from '~/constants/writing'
import {
  buildWritingListApiResponse,
  buildWritingListCanonicalQueryParams,
  buildWritingListQueryOptionsFromQuery,
  buildWritingListQueryParams,
  normalizeWritingList,
  paginateWritingList,
  sortWritingList,
  type WritingListResponseItem,
} from '~/utils/writingList'

describe('utils/writingList', () => {
  it('normalizes query values from route/server payload and clamps page size', () => {
    expect(buildWritingListQueryOptionsFromQuery({
      q: '  Nuxt  ',
      tag: ['  TypeScript  '],
      sort: 'OLDEST',
      page: '3',
      pageSize: '999',
    })).toEqual({
      searchQuery: 'Nuxt',
      tag: 'TypeScript',
      sort: WRITING_LIST_SORT_OLDEST,
      page: 3,
      pageSize: WRITING_LIST_MAX_PAGE_SIZE,
    })
  })

  it('falls back to defaults when query params are invalid', () => {
    expect(buildWritingListQueryOptionsFromQuery({
      sort: 'not-supported',
      page: '-1',
      pageSize: '0',
    })).toEqual({
      searchQuery: '',
      tag: '',
      sort: WRITING_LIST_DEFAULT_SORT,
      page: WRITING_LIST_DEFAULT_PAGE,
      pageSize: WRITING_LIST_DEFAULT_PAGE_SIZE,
    })
  })

  it('builds query params while omitting default values', () => {
    expect(buildWritingListQueryParams({
      searchQuery: 'Nuxt Content',
      tag: '',
      sort: WRITING_LIST_SORT_OLDEST,
      page: 2,
      pageSize: 20,
    })).toEqual({
      q: 'Nuxt Content',
      sort: WRITING_LIST_SORT_OLDEST,
      page: '2',
      pageSize: '20',
    })
  })

  it('keeps canonical query on pagination-only routes and drops faceted combinations', () => {
    expect(buildWritingListCanonicalQueryParams({
      page: 2,
      sort: WRITING_LIST_SORT_LATEST,
    })).toEqual({
      page: '2',
    })

    expect(buildWritingListCanonicalQueryParams({
      page: 2,
      sort: WRITING_LIST_SORT_OLDEST,
    })).toEqual({})
  })

  it('sorts list by selected date order and keeps missing date entries last', () => {
    const items: WritingListResponseItem[] = [
      {
        path: '/writing/without-date',
        title: 'Without Date',
        description: '',
        date: '',
        tags: [],
      },
      {
        path: '/writing/older',
        title: 'Older',
        description: '',
        date: '2024-01-01',
        tags: [],
      },
      {
        path: '/writing/newer',
        title: 'Newer',
        description: '',
        date: '2025-01-01',
        tags: [],
      },
    ]

    expect(sortWritingList(items, WRITING_LIST_SORT_LATEST).map((item) => item.path)).toEqual([
      '/writing/newer',
      '/writing/older',
      '/writing/without-date',
    ])

    expect(sortWritingList(items, WRITING_LIST_SORT_OLDEST).map((item) => item.path)).toEqual([
      '/writing/older',
      '/writing/newer',
      '/writing/without-date',
    ])
  })

  it('returns out-of-range metadata for invalid page requests', () => {
    const paginated = paginateWritingList([
      {
        path: '/writing/first',
        title: 'First',
        description: '',
        date: '',
        tags: [],
      },
    ], 3, 1)

    expect(paginated.items).toEqual([])
    expect(paginated.pagination).toEqual({
      totalCount: 1,
      totalPages: 1,
      currentPage: 3,
    })
    expect(paginated.isPageOutOfRange).toBe(true)
  })

  it('builds filtered, sorted, paginated api response metadata', () => {
    const normalized = normalizeWritingList([
      {
        path: '/writing/first-post',
        title: 'First Post',
        description: 'Nuxt metadata',
        date: '2025-02-01',
        tags: ['nuxt'],
      },
      {
        path: '/writing/second-post',
        title: 'Second Post',
        description: 'Nuxt metadata',
        date: '2025-03-01',
        tags: ['nuxt'],
      },
      {
        path: '/writing/third-post',
        title: 'Third Post',
        description: 'TypeScript only',
        date: '2025-01-01',
        tags: ['typescript'],
      },
    ])

    const result = buildWritingListApiResponse(normalized, {
      searchQuery: 'nuxt',
      tag: 'nuxt',
      sort: WRITING_LIST_SORT_LATEST,
      page: 1,
      pageSize: 1,
    })

    expect(result.items).toEqual([
      {
        path: '/writing/second-post',
        title: 'Second Post',
        description: 'Nuxt metadata',
        date: '2025-03-01',
        tags: ['nuxt'],
      },
    ])
    expect(result.pagination).toEqual({
      totalCount: 2,
      totalPages: 2,
      currentPage: 1,
    })
    expect(result.isPageOutOfRange).toBe(false)
  })
})
