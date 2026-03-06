import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { FEED_ROUTE_PATH } from '~/constants/routes'
import {
  WRITING_FEED_AUTO_DISCOVERY_TITLE,
  WRITING_FEED_AUTO_DISCOVERY_TYPE,
} from '~/constants/writing'

const NUXT_CONFIG_SOURCE = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf-8')
const defineNuxtConfigMock = vi.fn((config) => config)

vi.stubGlobal('defineNuxtConfig', defineNuxtConfigMock)

async function loadNuxtConfig() {
  return (await import('../nuxt.config')).default as {
    app?: {
      head?: {
        link?: Array<{
          rel?: string
          type?: string
          title?: string
          href?: string
        }>
      }
    }
  }
}

describe('nuxt RSS autodiscovery link', () => {
  it('declares RSS head link with constants in nuxt config source', () => {
    expect(NUXT_CONFIG_SOURCE).toContain("rel: 'alternate'")
    expect(NUXT_CONFIG_SOURCE).toContain('FEED_ROUTE_PATH')
    expect(NUXT_CONFIG_SOURCE).toContain('WRITING_FEED_AUTO_DISCOVERY_TYPE')
    expect(NUXT_CONFIG_SOURCE).toContain('WRITING_FEED_AUTO_DISCOVERY_TITLE')
  })

  it('contains the configured RSS link values in app head links', async () => {
    const nuxtConfig = await loadNuxtConfig()
    const links = nuxtConfig.app?.head?.link ?? []
    const rssLink = links.find((link) => link.rel === 'alternate')

    expect(rssLink).toBeDefined()
    expect(rssLink?.href).toBe(FEED_ROUTE_PATH)
    expect(rssLink?.type).toBe(WRITING_FEED_AUTO_DISCOVERY_TYPE)
    expect(rssLink?.title).toBe(WRITING_FEED_AUTO_DISCOVERY_TITLE)
  })
})
