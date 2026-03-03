import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(CURRENT_DIR, '..')

const USE_THEME_IMPORT_PATTERN = /import\s+\{\s*useTheme\s*\}\s+from\s+['"]~\/composables\/useTheme['"]/
const USE_PAGE_SEO_IMPORT_PATTERN = /import\s+\{\s*usePageSeo\s*\}\s+from\s+['"]~\/composables\/usePageSeo['"]/

const THEME_FILES = [
  'layouts/default.vue',
  'components/common/ThemeToggle.vue',
]

const SEO_FILES = [
  'pages/index.vue',
  'pages/about.vue',
  'pages/projects.vue',
  'pages/work-schedule-manager.vue',
  'pages/writing/index.vue',
  'pages/writing/[...slug].vue',
]

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT_DIR, relativePath), 'utf-8')
}

describe('composable import consistency', () => {
  it('uses explicit useTheme import in files that call useTheme', () => {
    for (const file of THEME_FILES) {
      const source = readSource(file)

      expect(source).toContain('useTheme(')
      expect(source).toMatch(USE_THEME_IMPORT_PATTERN)
    }
  })

  it('uses explicit usePageSeo import in files that call usePageSeo', () => {
    for (const file of SEO_FILES) {
      const source = readSource(file)

      expect(source).toContain('usePageSeo(')
      expect(source).toMatch(USE_PAGE_SEO_IMPORT_PATTERN)
    }
  })
})

describe('about page style consistency', () => {
  it('does not override CommonContentCard border radius with rounded-lg', () => {
    const source = readSource('pages/about.vue')

    expect(source).not.toMatch(/<CommonContentCard[\s\S]*class="rounded-lg"/)
  })
})
