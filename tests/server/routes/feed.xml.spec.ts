import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { FEED_ROUTE_PATH } from '~/constants/routes'
import { SITE_URL } from '~/constants/seo'
import {
  WRITING_FEED_CHANNEL_DESCRIPTION,
  WRITING_FEED_CHANNEL_TITLE,
} from '~/constants/writing'

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

const handlerPromise = import('~/server/routes/feed.xml').then((module) => module.default as (event: unknown) => Promise<string>)

describe('server/routes/feed.xml', () => {
  let tempDir = ''
  let cwdSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'feed-route-'))
    mkdirSync(resolve(tempDir, 'content/writing'), { recursive: true })
    cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(tempDir)
    setHeaderMock.mockClear()
    useRuntimeConfigMock.mockClear()
  })

  afterEach(() => {
    cwdSpy.mockRestore()
    rmSync(tempDir, { recursive: true, force: true })
  })

  it('builds RSS items from markdown frontmatter regardless of line endings and includes categories', async () => {
    writeFileSync(
      resolve(tempDir, 'content/writing/first-post.md'),
      [
        '---',
        'title: "First Post"',
        'description: "첫 번째 글"',
        'date: "2026-03-05"',
        'tags: ["nuxt", "rss"]',
        '---',
        '',
        '# First',
      ].join('\r\n'),
      'utf-8',
    )

    writeFileSync(
      resolve(tempDir, 'content/writing/second-post.md'),
      [
        '---',
        'title: "Second Post"',
        'description: "두 번째 글"',
        'date: "2026-03-04"',
        "tags: ['testing']",
        '---',
        '',
        '# Second',
      ].join('\n'),
      'utf-8',
    )

    const event = {}
    const handler = await handlerPromise
    const xml = await handler(event)

    expect((xml.match(/<item>/g) ?? []).length).toBe(2)
    expect(xml).toContain(`<title>${WRITING_FEED_CHANNEL_TITLE}</title>`)
    expect(xml).toContain(`<description>${WRITING_FEED_CHANNEL_DESCRIPTION}</description>`)
    expect(xml).toContain(`<atom:link href="${SITE_URL}${FEED_ROUTE_PATH}" rel="self" type="application/rss+xml"/>`)
    expect(xml).toContain('<title>First Post</title>')
    expect(xml).toContain(`<link>${SITE_URL}/writing/first-post</link>`)
    expect(xml).toContain(`<guid isPermaLink="true">${SITE_URL}/writing/first-post</guid>`)
    expect(xml).toMatch(/<pubDate>.+<\/pubDate>/)
    expect(xml).toContain('<category>nuxt</category>')
    expect(xml).toContain('<category>rss</category>')
    expect(xml).toContain('<category>testing</category>')
    expect(setHeaderMock).toHaveBeenCalledWith(event, 'content-type', 'application/rss+xml; charset=UTF-8')
  })
})
