import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(CURRENT_DIR, '..')
const WRITING_PAGE_SOURCE = readFileSync(resolve(ROOT_DIR, 'pages/writing/index.vue'), 'utf-8')
const WRITING_CONSTANTS_SOURCE = readFileSync(resolve(ROOT_DIR, 'constants/writing.ts'), 'utf-8')

describe('writing page filters', () => {
  it('provides a GET search form and clear filter link', () => {
    expect(WRITING_PAGE_SOURCE).toContain('<form method="get"')
    expect(WRITING_PAGE_SOURCE).toContain('clearFilterLink')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_SEARCH_QUERY_PARAM')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_TAG_QUERY_PARAM')
  })

  it('keeps tag links query-aware and refreshes async data when query changes', () => {
    expect(WRITING_PAGE_SOURCE).toContain('buildTagFilterLink')
    expect(WRITING_PAGE_SOURCE).toContain('watch: [')
    expect(WRITING_PAGE_SOURCE).toContain('route.query[WRITING_LIST_SEARCH_QUERY_PARAM]')
    expect(WRITING_PAGE_SOURCE).toContain('route.query[WRITING_LIST_TAG_QUERY_PARAM]')
  })

  it('exposes selected state for the filter submit button', () => {
    expect(WRITING_PAGE_SOURCE).toContain(':aria-pressed="isFiltered ? \'true\' : \'false\'"')
  })

  it('uses writing constants for list copy and seo metadata without hardcoding', () => {
    expect(WRITING_CONSTANTS_SOURCE).toContain("export const WRITING_LIST_ASYNC_DATA_KEY = 'writing:list'")
    expect(WRITING_CONSTANTS_SOURCE).toContain("export const WRITING_LIST_SEARCH_LABEL = '검색어'")
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_TITLE')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_SUBTITLE')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_META_DESCRIPTION')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_OG_TITLE')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_SEARCH_LABEL')
    expect(WRITING_PAGE_SOURCE).toContain('{{ WRITING_LIST_TITLE }}')
    expect(WRITING_PAGE_SOURCE).toContain('{{ WRITING_LIST_SUBTITLE }}')
    expect(WRITING_PAGE_SOURCE).toContain('title: WRITING_LIST_TITLE')
    expect(WRITING_PAGE_SOURCE).toContain('description: WRITING_LIST_META_DESCRIPTION')
    expect(WRITING_PAGE_SOURCE).toContain('ogTitle: WRITING_LIST_OG_TITLE')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_ASYNC_DATA_KEY')
    expect(WRITING_PAGE_SOURCE).not.toContain("ogTitle: '글 | 조세진'")
    expect(WRITING_PAGE_SOURCE).not.toContain('>검색어<')
    expect(WRITING_PAGE_SOURCE).not.toContain("'writing:list'")
  })

  it('keeps writing og title in korean for seo consistency', () => {
    expect(WRITING_CONSTANTS_SOURCE).toContain('export const WRITING_LIST_OG_TITLE = `${WRITING_LIST_TITLE} | ${SITE_OWNER_NAME}`')
    expect(WRITING_PAGE_SOURCE).not.toContain("ogTitle: 'Writing | Sejin Jo'")
  })
})
