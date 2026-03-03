import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(CURRENT_DIR, '..')

const WRITING_DETAIL_SOURCE = readFileSync(resolve(ROOT_DIR, 'pages/writing/[...slug].vue'), 'utf-8')

describe('writing detail seo consistency', () => {
  it('uses usePageSeo and writing constants instead of hardcoded seo values', () => {
    expect(WRITING_DETAIL_SOURCE).toContain("from '~/composables/usePageSeo'")
    expect(WRITING_DETAIL_SOURCE).toContain("from '~/constants/writing'")
    expect(WRITING_DETAIL_SOURCE).toContain('WRITING_NOT_FOUND_MESSAGE')
    expect(WRITING_DETAIL_SOURCE).toContain('WRITING_NOT_FOUND_STATUS_CODE')
    expect(WRITING_DETAIL_SOURCE).toContain('WRITING_DETAIL_DEFAULT_DESCRIPTION')
    expect(WRITING_DETAIL_SOURCE).toContain('WRITING_DETAIL_FALLBACK_TITLE')
    expect(WRITING_DETAIL_SOURCE).toContain('WRITING_DETAIL_JSON_LD_AUTHOR_NAME')
    expect(WRITING_DETAIL_SOURCE).toContain('WRITING_DETAIL_JSON_LD_PUBLISHER_NAME')
    expect(WRITING_DETAIL_SOURCE).toContain('usePageSeo({')
    expect(WRITING_DETAIL_SOURCE).not.toContain("'Post not found'")
    expect(WRITING_DETAIL_SOURCE).not.toContain("name: '조세진'")
    expect(WRITING_DETAIL_SOURCE).not.toContain("'실무에서 부딪힌 문제를 구조적으로 해결한 과정을 기록한 글입니다.'")
  })
})
