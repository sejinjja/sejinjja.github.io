import { computed, toValue, type ComputedRef, type Ref } from 'vue'
import { useHead, useRoute, useRuntimeConfig, useSeoMeta } from '#imports'

type SeoType = 'website' | 'article'

interface UsePageSeoOptions {
  title: string | Ref<string> | ComputedRef<string> | (() => string)
  description: string | Ref<string> | ComputedRef<string> | (() => string)
  ogTitle?: string | Ref<string> | ComputedRef<string> | (() => string)
  ogType?: SeoType | Ref<SeoType> | ComputedRef<SeoType> | (() => SeoType)
  jsonLd?: Record<string, unknown> | Ref<Record<string, unknown> | undefined> | ComputedRef<Record<string, unknown> | undefined> | (() => Record<string, unknown> | undefined)
}

function normalizeSiteUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

export function usePageSeo(options: UsePageSeoOptions): void {
  const route = useRoute()
  const { public: { siteUrl } } = useRuntimeConfig()

  const canonicalUrl = computed(() => `${normalizeSiteUrl(siteUrl || 'https://sejinjja.github.io')}${route.path}`)

  const resolvedTitle = computed(() => toValue(options.title))
  const resolvedDescription = computed(() => toValue(options.description))
  const resolvedOgTitle = computed(() => toValue(options.ogTitle ?? options.title))
  const resolvedOgType = computed(() => toValue(options.ogType ?? 'website'))

  useSeoMeta({
    title: resolvedTitle,
    description: resolvedDescription,
    ogTitle: resolvedOgTitle,
    ogDescription: resolvedDescription,
    ogType: resolvedOgType,
    ogUrl: canonicalUrl,
    ogLocale: 'ko_KR',
    twitterCard: 'summary_large_image',
  })

  useHead(() => {
    const jsonLd = options.jsonLd ? toValue(options.jsonLd) : undefined

    return {
      title: resolvedTitle.value,
      link: [{ rel: 'canonical', href: canonicalUrl.value }],
      script: jsonLd
        ? [{
            type: 'application/ld+json',
            children: JSON.stringify(jsonLd),
          }]
        : [],
    }
  })
}
