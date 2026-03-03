import { describe, expect, it } from 'vitest'
import {
  buildWritingListFilterOptionsFromQuery,
  buildWritingListQueryParams,
  filterWritingList,
  normalizeWritingList,
  type WritingListResponseItem,
} from '~/utils/writingList'

describe('utils/writingList', () => {
  it('normalizes query filters from route/server query payloads', () => {
    expect(buildWritingListFilterOptionsFromQuery({
      q: '  Nuxt  ',
      tag: ['  TypeScript  '],
    })).toEqual({
      searchQuery: 'Nuxt',
      tag: 'TypeScript',
    })
  })

  it('builds query params with empty filter values omitted', () => {
    expect(buildWritingListQueryParams({
      searchQuery: '  Nuxt Content ',
      tag: '',
    })).toEqual({
      q: 'Nuxt Content',
    })
  })

  it('filters normalized writing list by search query and tag', () => {
    const normalized = normalizeWritingList([
      {
        path: '/writing/first-post',
        title: 'Nuxt Content Query',
        description: 'Optimizing content API calls',
        tags: ['nuxt', 'performance'],
      },
      {
        path: '/writing/second-post',
        title: 'JavaScript Event Loop',
        description: 'Call stack and task queue',
        tags: ['javascript'],
      },
      {
        path: '/writing/third-post',
        title: 'TypeScript Utility Types',
        description: 'Mapped type patterns',
        tags: ['typescript'],
      },
    ])

    const filtered = filterWritingList(normalized, {
      searchQuery: 'queue',
      tag: 'javascript',
    })

    expect(filtered).toEqual<WritingListResponseItem[]>([
      {
        path: '/writing/second-post',
        title: 'JavaScript Event Loop',
        description: 'Call stack and task queue',
        date: '',
        tags: ['javascript'],
      },
    ])
  })
})
