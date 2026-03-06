import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STATIC_SITE_ROUTES } from '~/constants/routes'
import { SITE_URL } from '~/constants/seo'
import { WORK_SCHEDULE_MANAGER_ROUTE_PATH } from '~/constants/workScheduleManager'

const defineEventHandlerMock = vi.fn((handler) => handler)
const setHeaderMock = vi.fn()
const useRuntimeConfigMock = vi.fn(() => ({
  public: {
    siteUrl: SITE_URL,
  },
}))

vi.stubGlobal('defineEventHandler', defineEventHandlerMock)
vi.stubGlobal('setHeader', setHeaderMock)
vi.stubGlobal('useRuntimeConfig', useRuntimeConfigMock)

const handlerPromise = import('~/server/routes/sitemap.xml').then((module) => module.default as (event: unknown) => Promise<string>)

describe('server/routes/sitemap.xml', () => {
  let tempDir = ''
  let cwdSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'sitemap-route-'))
    mkdirSync(resolve(tempDir, 'content/writing/nested'), { recursive: true })
    cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(tempDir)
    setHeaderMock.mockClear()
    useRuntimeConfigMock.mockClear()
  })

  afterEach(() => {
    cwdSpy.mockRestore()
    rmSync(tempDir, { recursive: true, force: true })
  })

  it('includes static routes and writing entries with lastmod values', async () => {
    writeFileSync(
      resolve(tempDir, 'content/writing/nested/post.md'),
      [
        '---',
        'title: "Nested Post"',
        'description: "중첩 경로 테스트"',
        'date: "2026-03-01"',
        '---',
        '',
        '# Nested Post',
      ].join('\n'),
      'utf-8',
    )

    const event = {}
    const handler = await handlerPromise
    const xml = await handler(event)

    for (const route of STATIC_SITE_ROUTES) {
      expect(xml).toContain(`<loc>${SITE_URL}${route}</loc>`)
    }

    expect(xml).toContain(`<loc>${SITE_URL}${WORK_SCHEDULE_MANAGER_ROUTE_PATH}</loc>`)
    expect(xml).toContain(`<loc>${SITE_URL}/writing/nested/post</loc>`)
    expect(xml).toContain('<lastmod>2026-03-01T00:00:00.000Z</lastmod>')
    expect(setHeaderMock).toHaveBeenCalledWith(event, 'content-type', 'application/xml; charset=UTF-8')
  })
})
