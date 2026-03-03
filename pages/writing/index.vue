<template>
  <div class="max-w-5xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">글</h1>
    <p class="text-gray-500 dark:text-gray-300 mb-10">실무에서 부딪힌 문제와 해결 과정을 기록합니다.</p>

    <div v-if="articles.length" class="space-y-6">
      <NuxtLink
        v-for="article in articles"
        :key="article.path"
        :to="article.path"
        class="block p-6 rounded-xl border border-gray-100 dark:border-gray-800 dark:bg-gray-900/50 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-sm transition-all"
      >
        <time class="text-xs text-gray-400 font-medium">{{ article.date }}</time>
        <h2 class="font-bold text-gray-900 dark:text-gray-100 text-lg mt-1 mb-2">{{ article.title }}</h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ article.description }}</p>
        <div class="flex flex-wrap gap-2 mt-3">
          <CommonBadgeTag v-for="tag in article.tags" :key="tag">{{ tag }}</CommonBadgeTag>
        </div>
      </NuxtLink>
    </div>
    <div v-else class="text-center py-20 text-gray-400">
      아직 게시된 글이 없습니다.
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '~/composables/usePageSeo'
import {
  WRITING_CONTENT_COLLECTION,
  WRITING_LIST_API_PATH,
  WRITING_LIST_LOAD_FAILED_MESSAGE,
  WRITING_LIST_LOAD_FAILED_STATUS_CODE,
  WRITING_LIST_QUERY_FIELDS,
  WRITING_PATH_LIKE_PATTERN,
} from '~/constants/writing'
import {
  normalizeWritingList,
  type WritingListResponseItem,
  type WritingListSourceItem,
} from '~/utils/writingList'
import { queryCollectionWithEvent } from '~/utils/queryCollectionWithEvent'

const description = '실무에서 부딪힌 문제, 해결 과정, 개발 인사이트를 기록한 기술 글 목록입니다.'
const writingListApiPath: string = WRITING_LIST_API_PATH

async function fetchWritingList(): Promise<WritingListResponseItem[]> {
  try {
    return await $fetch<WritingListResponseItem[]>(writingListApiPath)
  } catch (error) {
    if (!import.meta.server) {
      throw error
    }

    const event = useRequestEvent()
    if (!event) {
      throw error
    }

    const fallbackList = await queryCollectionWithEvent(event, WRITING_CONTENT_COLLECTION)
      .where('path', 'LIKE', WRITING_PATH_LIKE_PATTERN)
      .select(...WRITING_LIST_QUERY_FIELDS)
      .all() as WritingListSourceItem[]

    return normalizeWritingList(fallbackList)
  }
}

const { data: articleList, error: articleListError } = await useAsyncData<WritingListResponseItem[]>(
  'writing:list',
  fetchWritingList,
)

if (articleListError.value) {
  throw createError({
    statusCode: WRITING_LIST_LOAD_FAILED_STATUS_CODE,
    statusMessage: WRITING_LIST_LOAD_FAILED_MESSAGE,
    cause: articleListError.value,
  })
}

const articles = computed(() => articleList.value || [])

usePageSeo({
  title: '글',
  description,
  ogTitle: 'Writing | Sejin Jo',
})
</script>
