import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(CURRENT_DIR, '..')
const WRITING_PAGE_SOURCE = readFileSync(resolve(ROOT_DIR, 'pages/writing/index.vue'), 'utf-8')

describe('writing page pagination a11y', () => {
  it('renders pagination nav with crawlable NuxtLink chain', () => {
    expect(WRITING_PAGE_SOURCE).toContain('v-if="pagination.totalPages > 1"')
    expect(WRITING_PAGE_SOURCE).toContain(':aria-label="WRITING_LIST_PAGINATION_NAV_LABEL"')
    expect(WRITING_PAGE_SOURCE).toContain('writingListState.buildPaginationLink(pagination.currentPage - 1)')
    expect(WRITING_PAGE_SOURCE).toContain('writingListState.buildPaginationLink(pagination.currentPage + 1)')
    expect(WRITING_PAGE_SOURCE).toContain('v-for="link in paginationLinks"')
  })

  it('marks active page with aria-current=page', () => {
    expect(WRITING_PAGE_SOURCE).toContain(':aria-current="link.isCurrent ? \'page\' : undefined"')
  })

  it('marks disabled pagination links with aria-disabled=true instead of aria-hidden', () => {
    expect(WRITING_PAGE_SOURCE).toContain('aria-disabled="true"')
    expect(WRITING_PAGE_SOURCE).not.toContain('aria-hidden="true"')
  })
})
