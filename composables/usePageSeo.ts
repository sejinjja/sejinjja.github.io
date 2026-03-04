import { computed, toValue, watchEffect, type ComputedRef, type Ref } from 'vue'
import { useHead, useRoute, useRuntimeConfig, useSeoMeta } from '#imports'
import {
  DEFAULT_ROBOTS,
  DEFAULT_OG_LOCALE,
  DEFAULT_TWITTER_CARD,
  SEO_TYPE_WEBSITE,
  SITE_URL,
  type SeoType,
} from '~/constants/seo'
import { useSeoState } from '~/composables/useSeoState'

interface UsePageSeoOptions {
  title: string | Ref<string> | ComputedRef<string> | (() => string)
  description: string | Ref<string> | ComputedRef<string> | (() => string)
  ogTitle?: string | Ref<string> | ComputedRef<string> | (() => string)
  ogType?: SeoType | Ref<SeoType> | ComputedRef<SeoType> | (() => SeoType)
  canonicalPath?: string | Ref<string> | ComputedRef<string> | (() => string)
  robots?: string | Ref<string> | ComputedRef<string> | (() => string)
  jsonLd?: Record<string, unknown> | Ref<Record<string, unknown> | undefined> | ComputedRef<Record<string, unknown> | undefined> | (() => Record<string, unknown> | undefined)
}

function normalizeSiteUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

function normalizeCanonicalPath(path: string): string {
  if (!path) {
    return ''
  }

  return path.startsWith('/') ? path : `/${path}`
}

export function usePageSeo(options: UsePageSeoOptions): void {
  const route = useRoute()
  const { public: { siteUrl } } = useRuntimeConfig()
  const { setSeo } = useSeoState()

  const resolvedTitle = computed(() => toValue(options.title))
  const resolvedDescription = computed(() => toValue(options.description))
  const resolvedOgTitle = computed(() => toValue(options.ogTitle ?? options.title))
  const resolvedOgType = computed(() => toValue(options.ogType ?? SEO_TYPE_WEBSITE))
  const resolvedCanonicalPath = computed(() => normalizeCanonicalPath(toValue(options.canonicalPath ?? route.path)))
  const canonicalUrl = computed(() => `${normalizeSiteUrl(siteUrl || SITE_URL)}${resolvedCanonicalPath.value}`)
  const resolvedRobots = computed(() => toValue(options.robots ?? DEFAULT_ROBOTS))

  watchEffect(() => {
    setSeo({
      title: resolvedTitle.value,
      description: resolvedDescription.value,
      ogTitle: resolvedOgTitle.value,
      ogDescription: resolvedDescription.value,
      type: resolvedOgType.value,
      canonicalPath: resolvedCanonicalPath.value,
    })
  })

  useSeoMeta({
    title: resolvedTitle,
    description: resolvedDescription,
    ogTitle: resolvedOgTitle,
    ogDescription: resolvedDescription,
    ogType: resolvedOgType,
    ogUrl: canonicalUrl,
    ogLocale: DEFAULT_OG_LOCALE,
    twitterCard: DEFAULT_TWITTER_CARD,
    robots: resolvedRobots,
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
