import { reactive } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  WRITING_BASE_PATH,
  WRITING_LIST_SORT_OLDEST,
} from '~/constants/writing'
import { SEO_ROBOTS_INDEX_FOLLOW } from '~/constants/seo'
import { useWritingListState } from './useWritingListState'

const routeState = reactive({
  query: {} as Record<string, unknown>,
})

vi.mock('#imports', () => ({
  useRoute: () => routeState,
}))

describe('useWritingListState', () => {
  beforeEach(() => {
    routeState.query = {}
  })

  it('normalizes route query into composable state', () => {
    routeState.query = {
      q: '  Nuxt  ',
      tag: '  TypeScript  ',
      sort: 'OLDEST',
      page: '2',
      pageSize: '20',
    }

    const state = useWritingListState()

    expect(state.queryState.value).toEqual({
      searchQuery: 'Nuxt',
      tag: 'TypeScript',
      sort: WRITING_LIST_SORT_OLDEST,
      page: 2,
      pageSize: 20,
    })
  })

  it('resets page to default when filter or sort state changes through generated links', () => {
    routeState.query = {
      q: 'nuxt',
      page: '3',
    }

    const state = useWritingListState()
    const link = state.buildLink({
      sort: WRITING_LIST_SORT_OLDEST,
    })

    expect(link).toEqual({
      path: WRITING_BASE_PATH,
      query: {
        q: 'nuxt',
        sort: WRITING_LIST_SORT_OLDEST,
      },
    })
    expect(state.queryState.value.page).toBe(3)
  })

  it('builds pagination links with current page marker', () => {
    routeState.query = {
      page: '2',
    }

    const state = useWritingListState()
    const links = state.buildPaginationLinks(4)

    expect(links.map((link) => link.page)).toEqual([1, 2, 3, 4])
    expect(links.find((link) => link.page === 2)?.isCurrent).toBe(true)
    expect(links.find((link) => link.page === 3)?.to.query).toEqual({
      page: '3',
    })
  })

  it('derives canonical path and robots from normalized query state', () => {
    routeState.query = {
      page: '2',
    }

    const state = useWritingListState()

    expect(state.canonicalPath.value).toBe('/writing?page=2')
    expect(state.robots.value).toBe(SEO_ROBOTS_INDEX_FOLLOW)
    expect(state.isFacetedVariant.value).toBe(false)

    routeState.query = {
      q: 'nuxt',
      page: '2',
    }

    expect(state.canonicalPath.value).toBe('/writing')
    expect(state.robots.value).toBe(SEO_ROBOTS_INDEX_FOLLOW)
    expect(state.isFacetedVariant.value).toBe(true)
    expect(state.queryState.value.page).toBe(2)
  })
})
