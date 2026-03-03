import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  WRITING_CONTENT_COLLECTION,
  WRITING_NOT_FOUND_MESSAGE,
} from '~/constants/writing'

interface NotFoundError extends Error {
  statusCode: number
  statusMessage: string
}

interface DetailQueryBuilder {
  path: ReturnType<typeof vi.fn>
  first: ReturnType<typeof vi.fn>
}

const defineEventHandlerMock = vi.fn((handler) => handler)
const createErrorMock = vi.fn(({ statusCode, statusMessage }: { statusCode: number, statusMessage: string }) => {
  const error = new Error(statusMessage) as NotFoundError
  error.statusCode = statusCode
  error.statusMessage = statusMessage
  return error
})
const getRouterParamMock = vi.fn()
const queryCollectionMock = vi.fn()

vi.stubGlobal('defineEventHandler', defineEventHandlerMock)
vi.stubGlobal('createError', createErrorMock)
vi.stubGlobal('getRouterParam', getRouterParamMock)
vi.stubGlobal('queryCollection', queryCollectionMock)

function createDetailQueryBuilder(article: unknown): DetailQueryBuilder {
  const builder = {
    path: vi.fn(),
    first: vi.fn().mockResolvedValue(article),
  } as DetailQueryBuilder

  builder.path.mockReturnValue(builder)

  return builder
}

const detailHandlerPromise = import('./[...slug].get').then((module) => module.default as (event: unknown) => Promise<{
  path: string
}>)

describe('server/api/writing/[...slug].get', () => {
  beforeEach(() => {
    createErrorMock.mockClear()
    getRouterParamMock.mockReset()
    queryCollectionMock.mockReset()
  })

  it('returns an article for a valid slug', async () => {
    const event = {}
    const article = { path: '/writing/hello-world', title: 'Hello World' }
    const queryBuilder = createDetailQueryBuilder(article)

    getRouterParamMock.mockReturnValue('hello-world')
    queryCollectionMock.mockReturnValue(queryBuilder)

    const handler = await detailHandlerPromise
    const result = await handler(event)

    expect(getRouterParamMock).toHaveBeenCalledWith(event, 'slug')
    expect(queryCollectionMock).toHaveBeenCalledWith(event, WRITING_CONTENT_COLLECTION)
    expect(queryBuilder.path).toHaveBeenCalledWith('/writing/hello-world')
    expect(result).toEqual(article)
  })

  it('throws 404 when slug is missing', async () => {
    const event = {}
    getRouterParamMock.mockReturnValue(undefined)

    const handler = await detailHandlerPromise

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: 404,
      statusMessage: WRITING_NOT_FOUND_MESSAGE,
    })
    expect(queryCollectionMock).not.toHaveBeenCalled()
  })

  it('throws 404 when article does not exist', async () => {
    const event = {}
    const queryBuilder = createDetailQueryBuilder(null)

    getRouterParamMock.mockReturnValue(['missing', 'post'])
    queryCollectionMock.mockReturnValue(queryBuilder)

    const handler = await detailHandlerPromise

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: 404,
      statusMessage: WRITING_NOT_FOUND_MESSAGE,
    })
    expect(queryBuilder.path).toHaveBeenCalledWith('/writing/missing/post')
  })
})
