import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  FOOTER_COPYRIGHT_NAME,
  FOOTER_FEED_TO,
  FOOTER_GITHUB_URL,
  FOOTER_SITEMAP_TO,
} from '~/constants/navigation'
import { FEED_ROUTE_PATH, SITEMAP_ROUTE_PATH } from '~/constants/routes'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const SOURCE = readFileSync(resolve(CURRENT_DIR, 'TheFooter.vue'), 'utf-8')

describe('TheFooter.vue', () => {
  it('imports constants from navigation and removes hardcoded values', () => {
    expect(SOURCE).toContain("from '~/constants/navigation'")
    expect(SOURCE).toContain('FOOTER_COPYRIGHT_NAME')
    expect(SOURCE).toContain('FOOTER_GITHUB_URL')
    expect(SOURCE).toContain('FOOTER_FEED_TO')
    expect(SOURCE).toContain('FOOTER_SITEMAP_TO')
    expect(SOURCE).not.toContain("https://github.com/sejinjja")
    expect(SOURCE).not.toContain("조세진")
  })

  it('includes feed and sitemap links in template', () => {
    expect(SOURCE).toContain('FOOTER_FEED_TO')
    expect(SOURCE).toContain('FOOTER_FEED_LABEL')
    expect(SOURCE).toContain('FOOTER_SITEMAP_TO')
    expect(SOURCE).toContain('FOOTER_SITEMAP_LABEL')
  })

  it('footer constants resolve to correct values', () => {
    expect(FOOTER_COPYRIGHT_NAME).toBeTruthy()
    expect(FOOTER_FEED_TO).toBe(FEED_ROUTE_PATH)
    expect(FOOTER_SITEMAP_TO).toBe(SITEMAP_ROUTE_PATH)
    expect(FOOTER_GITHUB_URL).toContain('github.com')
  })
})
