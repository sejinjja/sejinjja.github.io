<template>
  <div class="max-w-3xl mx-auto px-6 py-16">
    <article v-if="article">
      <header class="mb-10">
        <NuxtLink to="/writing" class="inline-flex items-center gap-1 text-sm text-gray-400 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors mb-6">
          <Icon name="heroicons:arrow-left" class="w-4 h-4" aria-hidden="true" />
          글 목록으로
        </NuxtLink>
        <time class="block text-sm text-gray-400 mb-2">{{ articleDate }}</time>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">{{ article.title }}</h1>
        <p v-if="articleDescription" class="text-gray-500 dark:text-gray-300">{{ articleDescription }}</p>
        <div class="flex flex-wrap gap-2 mt-4">
          <CommonBadgeTag v-for="tag in articleTags" :key="tag">{{ tag }}</CommonBadgeTag>
        </div>
      </header>
      <div class="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-300 prose-code:text-primary-700 dark:prose-code:text-primary-200 prose-code:bg-primary-50 dark:prose-code:bg-gray-800/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800">
        <ContentRenderer :value="article" />
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
interface WritingDoc {
  path: string
  title?: string
  description?: string
  date?: string
  tags?: string[]
  body?: unknown
  meta?: {
    description?: string
    date?: string
    tags?: string[]
  }
}

const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const canonicalUrl = computed(() => `${siteUrl.replace(/\/$/, '')}${route.path}`)
const defaultDescription = '실무에서 부딪힌 문제를 구조적으로 해결한 과정을 기록한 글입니다.'

const { data: article } = await useAsyncData<WritingDoc | null>(
  `writing:meta:${route.path}`,
  () => queryCollection('content').path(route.path).first() as Promise<WritingDoc | null>,
)

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found',
  })
}

const articleDescription = computed(() => article.value?.description || article.value?.meta?.description || '')
const articleDate = computed(() => article.value?.date || article.value?.meta?.date || '')
const articleTags = computed(() => article.value?.tags || article.value?.meta?.tags || [])

const seoTitle = computed(() => article.value?.title || '글')
const seoDescription = computed(() => articleDescription.value || defaultDescription)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'article',
  ogUrl: canonicalUrl,
  ogLocale: 'ko_KR',
  twitterCard: 'summary_large_image',
})

useHead(() => ({
  title: seoTitle.value,
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.value?.title,
        description: articleDescription.value || undefined,
        datePublished: articleDate.value || undefined,
        url: canonicalUrl.value,
        author: {
          '@type': 'Person',
          name: '조세진',
          url: 'https://sejinjja.github.io',
        },
        publisher: {
          '@type': 'Person',
          name: '조세진',
        },
      }),
    },
  ],
}))
</script>
