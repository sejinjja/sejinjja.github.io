import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  WRITING_CONTENT_COLLECTION,
  WRITING_LIST_DEFAULT_PAGE,
  WRITING_LIST_PAGE_OUT_OF_RANGE_MESSAGE,
  WRITING_LIST_PAGE_OUT_OF_RANGE_STATUS_CODE,
  WRITING_LIST_PAGE_QUERY_PARAM,
  WRITING_LIST_PAGE_SIZE_QUERY_PARAM,
  WRITING_LIST_QUERY_FIELDS,
  WRITING_LIST_SEARCH_QUERY_PARAM,
  WRITING_LIST_SORT_OLDEST,
  WRITING_LIST_SORT_QUERY_PARAM,
  WRITING_LIST_TAG_QUERY_PARAM,
  WRITING_PATH_LIKE_PATTERN,
} from '~/constants/writing'
import type { WritingListApiResponse } from '~/utils/writingList'

interface ListQueryBuilder {
  where: ReturnType<typeof vi.fn>
  select: ReturnType<typeof vi.fn>
  all: ReturnType<typeof vi.fn>
}

const defineEventHandlerMock = vi.fn((handler) => handler)
const queryCollectionMock = vi.fn()
const getValidatedQueryMock = vi.fn(async (
  event: { query?: Record<string, unknown> },
  validate: (query: unknown) => Record<string, unknown>,
) => validate(event.query ?? {}))
const createErrorMock = vi.fn((payload: { statusCode: number, statusMessage: string, data?: unknown }) => {
  const error = new Error(payload.statusMessage) as Error & {
    statusCode: number
    statusMessage: string
    data?: unknown
  }

  error.statusCode = payload.statusCode
  error.statusMessage = payload.statusMessage
  if (payload.data !== undefined) {
    error.data = payload.data
  }

  return error
})

vi.stubGlobal('defineEventHandler', defineEventHandlerMock)
vi.stubGlobal('queryCollection', queryCollectionMock)
vi.stubGlobal('getValidatedQuery', getValidatedQueryMock)
vi.stubGlobal('createError', createErrorMock)

const ROOT_DIR = process.cwd()
const WRITING_INDEX_OUTPUT_PATH = resolve(ROOT_DIR, '.output/public/writing/index.html')
const PRERENDER_TIMEOUT_MS = 240_000

function createListQueryBuilder(items: unknown[]): ListQueryBuilder {
  const builder = {
    where: vi.fn(),
    select: vi.fn(),
    all: vi.fn().mockResolvedValue(items),
  } as ListQueryBuilder

  builder.where.mockReturnValue(builder)
  builder.select.mockReturnValue(builder)

  return builder
}

const listHandlerPromise = import('./list.get').then((module) => module.default as (event: unknown) => Promise<WritingListApiResponse>)

describe('server/api/writing/list.get', () => {
  beforeEach(() => {
    queryCollectionMock.mockReset()
    getValidatedQueryMock.mockClear()
    createErrorMock.mockClear()
  })

  it('returns mapped items with pagination and excludes base writing path', async () => {
    const event = {}
    const queryBuilder = createListQueryBuilder([
      {
        path: '/writing',
        title: 'Root',
      },
      {
        path: '/writing/first-post',
        title: 'First Post',
        description: 'Direct description',
        date: '2025-03-01',
        tags: ['nuxt'],
      },
      {
        path: '/writing/second-post',
        title: 'Second Post',
        meta: {
          description: 'Meta description',
          date: '2025-02-01',
          tags: ['typescript'],
        },
      },
    ])

    queryCollectionMock.mockReturnValue(queryBuilder)

    const handler = await listHandlerPromise
    const result = await handler(event)

    expect(queryCollectionMock).toHaveBeenCalledWith(event, WRITING_CONTENT_COLLECTION)
    expect(queryBuilder.where).toHaveBeenCalledWith('path', 'LIKE', WRITING_PATH_LIKE_PATTERN)
    expect(queryBuilder.select).toHaveBeenCalledWith(...WRITING_LIST_QUERY_FIELDS)
    expect(getValidatedQueryMock).toHaveBeenCalledWith(event, expect.any(Function))

    expect(result).toEqual({
      items: [
        {
          path: '/writing/first-post',
          title: 'First Post',
          description: 'Direct description',
          date: '2025-03-01',
          tags: ['nuxt'],
        },
        {
          path: '/writing/second-post',
          title: 'Second Post',
          description: 'Meta description',
          date: '2025-02-01',
          tags: ['typescript'],
        },
      ],
      pagination: {
        totalCount: 2,
        totalPages: 1,
        currentPage: WRITING_LIST_DEFAULT_PAGE,
      },
    })
  })

  it('sorts items by date descending by default and places missing dates last', async () => {
    const event = {}
    const queryBuilder = createListQueryBuilder([
      {
        path: '/writing/without-date',
        title: 'Without Date',
      },
      {
        path: '/writing/older',
        title: 'Older',
        date: '2024-04-01',
      },
      {
        path: '/writing/newer',
        title: 'Newer',
        date: '2025-04-01',
      },
    ])

    queryCollectionMock.mockReturnValue(queryBuilder)

    const handler = await listHandlerPromise
    const result = await handler(event)

    expect(result.items.map((item) => item.path)).toEqual([
      '/writing/newer',
      '/writing/older',
      '/writing/without-date',
    ])
    expect(result.pagination.totalCount).toBe(3)
  })

  it('filters by search/tag and supports sort/page/pageSize query params', async () => {
    const event = {
      query: {
        [WRITING_LIST_SEARCH_QUERY_PARAM]: 'meta',
        [WRITING_LIST_TAG_QUERY_PARAM]: 'typescript',
        [WRITING_LIST_SORT_QUERY_PARAM]: WRITING_LIST_SORT_OLDEST,
        [WRITING_LIST_PAGE_QUERY_PARAM]: '1',
        [WRITING_LIST_PAGE_SIZE_QUERY_PARAM]: '1',
      },
    }
    const queryBuilder = createListQueryBuilder([
      {
        path: '/writing/first-post',
        title: 'First Post',
        description: 'Meta description',
        date: '2025-05-01',
        tags: ['typescript'],
      },
      {
        path: '/writing/second-post',
        title: 'Second Post',
        description: 'Meta description',
        date: '2024-05-01',
        tags: ['typescript'],
      },
      {
        path: '/writing/third-post',
        title: 'Third Post',
        description: 'Meta description',
        date: '2023-05-01',
        tags: ['javascript'],
      },
    ])

    queryCollectionMock.mockReturnValue(queryBuilder)

    const handler = await listHandlerPromise
    const result = await handler(event)

    expect(result).toEqual({
      items: [
        {
          path: '/writing/second-post',
          title: 'Second Post',
          description: 'Meta description',
          date: '2024-05-01',
          tags: ['typescript'],
        },
      ],
      pagination: {
        totalCount: 2,
        totalPages: 2,
        currentPage: 1,
      },
    })
  })

  it('throws 404 when requested page is out of range', async () => {
    const event = {
      query: {
        [WRITING_LIST_PAGE_QUERY_PARAM]: '5',
        [WRITING_LIST_PAGE_SIZE_QUERY_PARAM]: '1',
      },
    }
    const queryBuilder = createListQueryBuilder([
      {
        path: '/writing/first-post',
        title: 'First Post',
      },
    ])

    queryCollectionMock.mockReturnValue(queryBuilder)

    const handler = await listHandlerPromise

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: WRITING_LIST_PAGE_OUT_OF_RANGE_STATUS_CODE,
      statusMessage: WRITING_LIST_PAGE_OUT_OF_RANGE_MESSAGE,
      data: {
        totalCount: 1,
        totalPages: 1,
        currentPage: 5,
      },
    })
    expect(createErrorMock).toHaveBeenCalled()
  })

  it('prerender smoke: writing payload does not contain NuxtError', () => {
    try {
      execSync(
        'pnpm generate',
        {
          cwd: ROOT_DIR,
          encoding: 'utf-8',
          env: {
            ...process.env,
            NUXT_TELEMETRY_DISABLED: '1',
          },
          maxBuffer: 20 * 1024 * 1024,
        },
      )
    } catch (error) {
      const { stdout, stderr } = error as {
        stdout?: string
        stderr?: string
      }

      throw new Error([
        'pnpm generate failed during prerender smoke test.',
        `stdout:\n${stdout || '(empty)'}`,
        `stderr:\n${stderr || '(empty)'}`,
      ].join('\n'))
    }

    expect(existsSync(WRITING_INDEX_OUTPUT_PATH)).toBe(true)

    const payload = readFileSync(WRITING_INDEX_OUTPUT_PATH, 'utf-8')

    expect(payload).toContain('__NUXT_DATA__')
    expect(payload).not.toContain('500 Server Error')
    expect(payload).not.toContain('Cannot read properties of undefined (reading \'req\')')
    expect(payload).not.toContain('NuxtError')
  }, PRERENDER_TIMEOUT_MS)
})
