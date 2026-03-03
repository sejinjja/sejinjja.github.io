<template>
  <div class="max-w-3xl mx-auto px-6 py-16">
    <article v-if="article">
      <header class="mb-10">
        <NuxtLink :to="WRITING_BASE_PATH" class="inline-flex items-center gap-1 text-sm text-gray-400 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors mb-6">
          <Icon name="heroicons:arrow-left" class="w-4 h-4" aria-hidden="true" />
          {{ WRITING_DETAIL_BACK_LINK_LABEL }}
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
import { usePageSeo } from '~/composables/usePageSeo'
import { SEO_TYPE_ARTICLE } from '~/constants/seo'
import {
  WRITING_BASE_PATH,
  WRITING_CONTENT_COLLECTION,
  WRITING_DETAIL_ASYNC_DATA_KEY_PREFIX,
  WRITING_DETAIL_BACK_LINK_LABEL,
  WRITING_DETAIL_DEFAULT_DESCRIPTION,
  WRITING_DETAIL_FALLBACK_TITLE,
  WRITING_DETAIL_JSON_LD_AUTHOR_NAME,
  WRITING_DETAIL_JSON_LD_AUTHOR_URL,
  WRITING_DETAIL_JSON_LD_CONTEXT,
  WRITING_DETAIL_JSON_LD_PERSON_TYPE,
  WRITING_DETAIL_JSON_LD_PUBLISHER_NAME,
  WRITING_DETAIL_JSON_LD_TYPE,
  WRITING_NOT_FOUND_MESSAGE,
  WRITING_NOT_FOUND_STATUS_CODE,
} from '~/constants/writing'

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

const { data: article } = await useAsyncData<WritingDoc | null>(
  `${WRITING_DETAIL_ASYNC_DATA_KEY_PREFIX}${route.path}`,
  () => queryCollection(WRITING_CONTENT_COLLECTION).path(route.path).first() as Promise<WritingDoc | null>,
)

if (!article.value) {
  throw createError({
    statusCode: WRITING_NOT_FOUND_STATUS_CODE,
    statusMessage: WRITING_NOT_FOUND_MESSAGE,
  })
}

const articleDescription = computed(() => article.value?.description || article.value?.meta?.description || '')
const articleDate = computed(() => article.value?.date || article.value?.meta?.date || '')
const articleTags = computed(() => article.value?.tags || article.value?.meta?.tags || [])

const seoTitle = computed(() => article.value?.title || WRITING_DETAIL_FALLBACK_TITLE)
const seoDescription = computed(() => articleDescription.value || WRITING_DETAIL_DEFAULT_DESCRIPTION)
const jsonLd = computed(() => ({
  '@context': WRITING_DETAIL_JSON_LD_CONTEXT,
  '@type': WRITING_DETAIL_JSON_LD_TYPE,
  headline: article.value?.title,
  description: articleDescription.value || undefined,
  datePublished: articleDate.value || undefined,
  author: {
    '@type': WRITING_DETAIL_JSON_LD_PERSON_TYPE,
    name: WRITING_DETAIL_JSON_LD_AUTHOR_NAME,
    url: WRITING_DETAIL_JSON_LD_AUTHOR_URL,
  },
  publisher: {
    '@type': WRITING_DETAIL_JSON_LD_PERSON_TYPE,
    name: WRITING_DETAIL_JSON_LD_PUBLISHER_NAME,
  },
}))

usePageSeo({
  title: seoTitle,
  description: seoDescription,
  ogType: SEO_TYPE_ARTICLE,
  jsonLd,
})
</script>
