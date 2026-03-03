import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  WRITING_CONTENT_COLLECTION,
  WRITING_LIST_QUERY_FIELDS,
  WRITING_LIST_SEARCH_QUERY_PARAM,
  WRITING_LIST_TAG_QUERY_PARAM,
  WRITING_PATH_LIKE_PATTERN,
} from '~/constants/writing'

interface ListQueryBuilder {
  where: ReturnType<typeof vi.fn>
  select: ReturnType<typeof vi.fn>
  all: ReturnType<typeof vi.fn>
}

const defineEventHandlerMock = vi.fn((handler) => handler)
const queryCollectionMock = vi.fn()
const getQueryMock = vi.fn((event: { query?: Record<string, unknown> }) => event.query ?? {})

vi.stubGlobal('defineEventHandler', defineEventHandlerMock)
vi.stubGlobal('queryCollection', queryCollectionMock)
vi.stubGlobal('getQuery', getQueryMock)

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

const listHandlerPromise = import('./list.get').then((module) => module.default as (event: unknown) => Promise<Array<{
  path: string
  title: string
  description: string
  date: string
  tags: string[]
}>>)

describe('server/api/writing/list.get', () => {
  beforeEach(() => {
    queryCollectionMock.mockReset()
    getQueryMock.mockClear()
  })

  it('returns mapped writing list items and excludes base writing path', async () => {
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

    expect(result).toHaveLength(2)
    expect(result).toContainEqual({
      path: '/writing/first-post',
      title: 'First Post',
      description: 'Direct description',
      date: '2025-03-01',
      tags: ['nuxt'],
    })
    expect(result).toContainEqual({
      path: '/writing/second-post',
      title: 'Second Post',
      description: 'Meta description',
      date: '2025-02-01',
      tags: ['typescript'],
    })
  })

  it('sorts items by date descending and places missing dates last', async () => {
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

    expect(result.map((item) => item.path)).toEqual([
      '/writing/newer',
      '/writing/older',
      '/writing/without-date',
    ])
  })

  it('filters by search query and tag query params', async () => {
    const event = {
      query: {
        [WRITING_LIST_SEARCH_QUERY_PARAM]: 'meta',
        [WRITING_LIST_TAG_QUERY_PARAM]: 'typescript',
      },
    }
    const queryBuilder = createListQueryBuilder([
      {
        path: '/writing/first-post',
        title: 'First Post',
        description: 'Direct description',
        tags: ['nuxt'],
      },
      {
        path: '/writing/second-post',
        title: 'Second Post',
        meta: {
          description: 'Meta description',
          tags: ['typescript'],
        },
      },
      {
        path: '/writing/third-post',
        title: 'Third Post',
        description: 'Meta description but wrong tag',
        tags: ['javascript'],
      },
    ])

    queryCollectionMock.mockReturnValue(queryBuilder)

    const handler = await listHandlerPromise
    const result = await handler(event)

    expect(getQueryMock).toHaveBeenCalledWith(event)
    expect(result).toEqual([
      {
        path: '/writing/second-post',
        title: 'Second Post',
        description: 'Meta description',
        date: '',
        tags: ['typescript'],
      },
    ])
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
