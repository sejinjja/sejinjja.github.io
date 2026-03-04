import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(CURRENT_DIR, '..')
const WRITING_PAGE_SOURCE = readFileSync(resolve(ROOT_DIR, 'pages/writing/index.vue'), 'utf-8')
const WRITING_CONSTANTS_SOURCE = readFileSync(resolve(ROOT_DIR, 'constants/writing.ts'), 'utf-8')

describe('writing page filters', () => {
  it('keeps GET-based query controls for search, tag, sort, page and page size', () => {
    expect(WRITING_PAGE_SOURCE).toContain('<form method="get"')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_SEARCH_QUERY_PARAM')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_TAG_QUERY_PARAM')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_SORT_QUERY_PARAM')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_PAGE_QUERY_PARAM')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_PAGE_SIZE_QUERY_PARAM')
    expect(WRITING_PAGE_SOURCE).toContain('clearFilterLink')
  })

  it('uses writing list state composable and query-aware async key for data fetch', () => {
    expect(WRITING_PAGE_SOURCE).toContain("from '~/composables/useWritingListState'")
    expect(WRITING_PAGE_SOURCE).toContain('const writingListState = useWritingListState()')
    expect(WRITING_PAGE_SOURCE).toContain('() => writingListState.asyncDataKey.value')
    expect(WRITING_PAGE_SOURCE).toContain('query: queryParams')
  })

  it('keeps tag links and pagination links query-aware', () => {
    expect(WRITING_PAGE_SOURCE).toContain('writingListState.buildTagFilterLink(tag)')
    expect(WRITING_PAGE_SOURCE).toContain('writingListState.buildPaginationLink(pagination.currentPage - 1)')
    expect(WRITING_PAGE_SOURCE).toContain('writingListState.buildPaginationLink(pagination.currentPage + 1)')
  })

  it('exposes selected state for search action and keeps seo constants centralized', () => {
    expect(WRITING_CONSTANTS_SOURCE).toContain("export const WRITING_LIST_ASYNC_DATA_KEY = 'writing:list'")
    expect(WRITING_CONSTANTS_SOURCE).toContain("export const WRITING_LIST_SEARCH_LABEL = '검색어'")
    expect(WRITING_CONSTANTS_SOURCE).toContain("export const WRITING_LIST_SORT_LATEST = 'latest'")
    expect(WRITING_CONSTANTS_SOURCE).toContain("export const WRITING_LIST_SORT_OLDEST = 'oldest'")
    expect(WRITING_CONSTANTS_SOURCE).toContain("export const WRITING_LIST_PAGE_QUERY_PARAM = 'page'")
    expect(WRITING_CONSTANTS_SOURCE).toContain("export const WRITING_LIST_PAGE_SIZE_QUERY_PARAM = 'pageSize'")
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_TITLE')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_SUBTITLE')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_META_DESCRIPTION')
    expect(WRITING_PAGE_SOURCE).toContain('WRITING_LIST_OG_TITLE')
    expect(WRITING_PAGE_SOURCE).toContain('canonicalPath: writingListState.canonicalPath')
    expect(WRITING_PAGE_SOURCE).toContain('robots: writingListState.robots')
    expect(WRITING_PAGE_SOURCE).toContain('title: WRITING_LIST_TITLE')
    expect(WRITING_PAGE_SOURCE).toContain('description: WRITING_LIST_META_DESCRIPTION')
    expect(WRITING_PAGE_SOURCE).toContain('ogTitle: WRITING_LIST_OG_TITLE')
    expect(WRITING_PAGE_SOURCE).not.toContain("ogTitle: '글 | 조세진'")
    expect(WRITING_PAGE_SOURCE).not.toContain('>검색어<')
    expect(WRITING_PAGE_SOURCE).not.toContain("'writing:list'")
  })

  it('keeps writing og title in korean for seo consistency', () => {
    expect(WRITING_CONSTANTS_SOURCE).toContain('export const WRITING_LIST_OG_TITLE = `${WRITING_LIST_TITLE} | ${SITE_OWNER_NAME}`')
    expect(WRITING_PAGE_SOURCE).not.toContain("ogTitle: 'Writing | Sejin Jo'")
  })
})
