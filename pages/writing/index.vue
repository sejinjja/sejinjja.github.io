<template>
  <div class="max-w-5xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{{ WRITING_LIST_TITLE }}</h1>
    <p class="text-gray-500 dark:text-gray-300 mb-10">{{ WRITING_LIST_SUBTITLE }}</p>
    <form method="get" class="mb-8 flex flex-col sm:flex-row gap-3 sm:items-center">
      <label for="writing-search" class="sr-only">{{ WRITING_LIST_SEARCH_LABEL }}</label>
      <input
        id="writing-search"
        :name="WRITING_LIST_SEARCH_QUERY_PARAM"
        type="search"
        :value="routeFilters.searchQuery"
        :placeholder="WRITING_LIST_SEARCH_PLACEHOLDER"
        class="w-full sm:max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
      >
      <input
        v-if="routeFilters.tag"
        :name="WRITING_LIST_TAG_QUERY_PARAM"
        type="hidden"
        :value="routeFilters.tag"
      >
      <button
        type="submit"
        :aria-pressed="isFiltered ? 'true' : 'false'"
        class="inline-flex items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100 px-4 py-2 text-sm font-medium text-white dark:text-gray-900"
      >
        {{ WRITING_LIST_SEARCH_BUTTON_LABEL }}
      </button>
      <NuxtLink
        v-if="routeFilters.searchQuery || routeFilters.tag"
        :to="clearFilterLink"
        class="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
      >
        {{ WRITING_LIST_FILTER_RESET_BUTTON_LABEL }}
      </NuxtLink>
    </form>

    <div v-if="articles.length" class="space-y-6">
      <article
        v-for="article in articles"
        :key="article.path"
        class="block p-6 rounded-xl border border-gray-100 dark:border-gray-800 dark:bg-gray-900/50 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-sm transition-all"
      >
        <time class="text-xs text-gray-400 font-medium">{{ article.date }}</time>
        <h2 class="font-bold text-gray-900 dark:text-gray-100 text-lg mt-1 mb-2">
          <NuxtLink :to="article.path" class="hover:underline">{{ article.title }}</NuxtLink>
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ article.description }}</p>
        <div class="flex flex-wrap gap-2 mt-3">
          <NuxtLink
            v-for="tag in article.tags"
            :key="tag"
            :to="buildTagFilterLink(tag)"
            class="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-full"
          >
            <CommonBadgeTag>{{ tag }}</CommonBadgeTag>
          </NuxtLink>
        </div>
      </article>
    </div>
    <div v-else class="text-center py-20 text-gray-400">
      {{ emptyStateMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '~/composables/usePageSeo'
import {
  WRITING_CONTENT_COLLECTION,
  WRITING_BASE_PATH,
  WRITING_LIST_API_PATH,
  WRITING_LIST_ASYNC_DATA_KEY,
  WRITING_LIST_EMPTY_FILTERED_MESSAGE,
  WRITING_LIST_EMPTY_MESSAGE,
  WRITING_LIST_FILTER_RESET_BUTTON_LABEL,
  WRITING_LIST_LOAD_FAILED_MESSAGE,
  WRITING_LIST_LOAD_FAILED_STATUS_CODE,
  WRITING_LIST_META_DESCRIPTION,
  WRITING_LIST_OG_TITLE,
  WRITING_LIST_SEARCH_LABEL,
  WRITING_LIST_SEARCH_BUTTON_LABEL,
  WRITING_LIST_SEARCH_PLACEHOLDER,
  WRITING_LIST_SEARCH_QUERY_PARAM,
  WRITING_LIST_QUERY_FIELDS,
  WRITING_LIST_SUBTITLE,
  WRITING_LIST_TAG_QUERY_PARAM,
  WRITING_LIST_TITLE,
  WRITING_PATH_LIKE_PATTERN,
} from '~/constants/writing'
import {
  buildWritingListFilterOptionsFromQuery,
  buildWritingListQueryParams,
  filterWritingList,
  normalizeWritingList,
  type WritingListResponseItem,
  type WritingListSourceItem,
} from '~/utils/writingList'
import { queryCollectionWithEvent } from '~/utils/queryCollectionWithEvent'
const route = useRoute()

const routeFilters = computed(() => buildWritingListFilterOptionsFromQuery(route.query))
const clearFilterLink = computed(() => ({ path: WRITING_BASE_PATH }))
const isFiltered = computed(() => Boolean(routeFilters.value.searchQuery || routeFilters.value.tag))
const emptyStateMessage = computed(() => (
  isFiltered.value ? WRITING_LIST_EMPTY_FILTERED_MESSAGE : WRITING_LIST_EMPTY_MESSAGE
))

function buildTagFilterLink(tag: string) {
  return {
    path: WRITING_BASE_PATH,
    query: buildWritingListQueryParams({
      searchQuery: routeFilters.value.searchQuery,
      tag,
    }),
  }
}

async function fetchWritingList(): Promise<WritingListResponseItem[]> {
  try {
    return await $fetch<WritingListResponseItem[]>(WRITING_LIST_API_PATH, {
      query: buildWritingListQueryParams(routeFilters.value),
    })
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

    return filterWritingList(
      normalizeWritingList(fallbackList),
      routeFilters.value,
    )
  }
}

const { data: articleList, error: articleListError } = await useAsyncData<WritingListResponseItem[]>(
  WRITING_LIST_ASYNC_DATA_KEY,
  fetchWritingList,
  {
    watch: [
      () => route.query[WRITING_LIST_SEARCH_QUERY_PARAM],
      () => route.query[WRITING_LIST_TAG_QUERY_PARAM],
    ],
  },
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
  title: WRITING_LIST_TITLE,
  description: WRITING_LIST_META_DESCRIPTION,
  ogTitle: WRITING_LIST_OG_TITLE,
})
</script>
