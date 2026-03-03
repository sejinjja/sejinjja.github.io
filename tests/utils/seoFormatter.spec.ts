import { describe, expect, it } from 'vitest'
import {
  DEFAULT_META_DESCRIPTION,
  DEFAULT_META_TITLE,
  SEO_TYPE_ARTICLE,
  SEO_TYPE_WEBSITE,
} from '~/constants/seo'
import {
  buildSeoState,
  mergeSeoState,
  normalizeSeoKeywords,
  normalizeSeoType,
} from '~/utils/seoFormatter'

describe('utils/seoFormatter', () => {
  it('builds normalized seo state with defaults and fallback fields', () => {
    expect(buildSeoState({
      title: '  Landing Page  ',
      description: '  핵심 소개 문구  ',
      keywords: 'nuxt, seo, nuxt',
      type: SEO_TYPE_ARTICLE,
    })).toEqual({
      title: 'Landing Page',
      description: '핵심 소개 문구',
      ogTitle: 'Landing Page',
      ogDescription: '핵심 소개 문구',
      type: SEO_TYPE_ARTICLE,
      keywords: ['nuxt', 'seo'],
      canonicalPath: '',
      image: '',
    })
  })

  it('returns default title/description when required fields are missing', () => {
    const seoState = buildSeoState({
      title: '   ',
      description: '',
    })

    expect(seoState.title).toBe(DEFAULT_META_TITLE)
    expect(seoState.description).toBe(DEFAULT_META_DESCRIPTION)
    expect(seoState.ogTitle).toBe(DEFAULT_META_TITLE)
    expect(seoState.ogDescription).toBe(DEFAULT_META_DESCRIPTION)
  })

  it('normalizes keywords from string or string array with dedupe', () => {
    expect(normalizeSeoKeywords(' Nuxt , seo,nuxt , vue ')).toEqual(['Nuxt', 'seo', 'vue'])
    expect(normalizeSeoKeywords([' Nuxt,seo ', 'SEO', 'performance'])).toEqual(['Nuxt', 'seo', 'performance'])
  })

  it('falls back to website type for invalid values', () => {
    expect(normalizeSeoType('ARTICLE')).toBe(SEO_TYPE_ARTICLE)
    expect(normalizeSeoType('invalid-type')).toBe(SEO_TYPE_WEBSITE)
    expect(normalizeSeoType(undefined)).toBe(SEO_TYPE_WEBSITE)
  })

  it('merges patch payload into existing seo state without losing untouched fields', () => {
    const baseState = buildSeoState({
      title: 'Base Title',
      description: 'Base Description',
      keywords: ['nuxt'],
      canonicalPath: '/base',
      image: '/base.png',
    })

    const mergedState = mergeSeoState(baseState, {
      description: 'Updated Description',
      keywords: 'seo,nuxt',
      type: 'not-supported',
      ogTitle: undefined,
    })

    expect(mergedState).toEqual({
      title: 'Base Title',
      description: 'Updated Description',
      ogTitle: 'Base Title',
      ogDescription: 'Base Description',
      type: SEO_TYPE_WEBSITE,
      keywords: ['seo', 'nuxt'],
      canonicalPath: '/base',
      image: '/base.png',
    })
  })
})
