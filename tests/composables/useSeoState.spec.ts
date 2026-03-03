import { ref, type Ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_META_DESCRIPTION,
  DEFAULT_META_TITLE,
  DEFAULT_SEO_TITLE,
  SEO_STATE_KEY,
  SEO_TYPE_ARTICLE,
  SEO_TYPE_WEBSITE,
} from '~/constants/seo'
import { useSeoState } from '~/composables/useSeoState'

const seoStateRegistry = new Map<string, Ref<unknown>>()

vi.mock('#imports', () => ({
  useState: <T>(key: string, init: () => T): Ref<T> => {
    if (!seoStateRegistry.has(key)) {
      seoStateRegistry.set(key, ref(init()))
    }

    return seoStateRegistry.get(key) as Ref<T>
  },
}))

describe('composables/useSeoState', () => {
  beforeEach(() => {
    seoStateRegistry.clear()
  })

  it('initializes seo state with default constants', () => {
    const { seo } = useSeoState()

    expect(seoStateRegistry.has(SEO_STATE_KEY)).toBe(true)
    expect(DEFAULT_META_TITLE).toBe(DEFAULT_SEO_TITLE)
    expect(seo.value).toEqual({
      title: DEFAULT_SEO_TITLE,
      description: DEFAULT_META_DESCRIPTION,
      ogTitle: DEFAULT_SEO_TITLE,
      ogDescription: DEFAULT_META_DESCRIPTION,
      type: SEO_TYPE_WEBSITE,
      keywords: [],
      canonicalPath: '',
      image: '',
    })
  })

  it('sets and patches seo state through formatter-backed actions', () => {
    const { seo, setSeo, patchSeo } = useSeoState()

    setSeo({
      title: '  새로운 타이틀  ',
      description: '  설명  ',
      type: SEO_TYPE_ARTICLE,
      keywords: 'nuxt, seo, nuxt',
    })

    expect(seo.value.title).toBe('새로운 타이틀')
    expect(seo.value.description).toBe('설명')
    expect(seo.value.type).toBe(SEO_TYPE_ARTICLE)
    expect(seo.value.keywords).toEqual(['nuxt', 'seo'])

    patchSeo({
      description: '수정된 설명',
      keywords: ['seo', 'performance'],
    })

    expect(seo.value.title).toBe('새로운 타이틀')
    expect(seo.value.description).toBe('수정된 설명')
    expect(seo.value.keywords).toEqual(['seo', 'performance'])
  })

  it('resets seo state to the composable initial value', () => {
    const { seo, setSeo, resetSeo } = useSeoState({
      title: '초기 타이틀',
      description: '초기 설명',
    })

    setSeo({
      title: '임시 타이틀',
      description: '임시 설명',
    })

    resetSeo()

    expect(seo.value.title).toBe('초기 타이틀')
    expect(seo.value.description).toBe('초기 설명')
    expect(seo.value.ogTitle).toBe('초기 타이틀')
    expect(seo.value.ogDescription).toBe('초기 설명')
  })

  it('shares the same state key across multiple composable calls', () => {
    const firstSeo = useSeoState()
    const secondSeo = useSeoState()

    firstSeo.setSeo({
      title: '공유 타이틀',
      description: '공유 설명',
    })

    expect(secondSeo.seo.value.title).toBe('공유 타이틀')
    expect(secondSeo.seo.value.description).toBe('공유 설명')
  })
})
