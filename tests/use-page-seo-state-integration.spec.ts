import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(CURRENT_DIR, '..')

const USE_PAGE_SEO_SOURCE = readFileSync(resolve(ROOT_DIR, 'composables/usePageSeo.ts'), 'utf-8')

describe('usePageSeo and useSeoState integration', () => {
  it('updates formatter-backed seo state through useSeoState in a watch effect', () => {
    expect(USE_PAGE_SEO_SOURCE).toContain("from '~/composables/useSeoState'")
    expect(USE_PAGE_SEO_SOURCE).toContain('const { setSeo } = useSeoState()')
    expect(USE_PAGE_SEO_SOURCE).toContain('watchEffect(() => {')
    expect(USE_PAGE_SEO_SOURCE).toContain('setSeo({')
    expect(USE_PAGE_SEO_SOURCE).toContain('resolvedCanonicalPath')
    expect(USE_PAGE_SEO_SOURCE).toContain('canonicalPath: resolvedCanonicalPath.value')
  })
})
