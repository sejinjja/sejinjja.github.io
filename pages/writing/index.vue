<template>
  <div class="max-w-5xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{{ WRITING_LIST_TITLE }}</h1>
    <p class="text-gray-500 dark:text-gray-300 mb-10">{{ WRITING_LIST_SUBTITLE }}</p>

    <form method="get" class="mb-8 grid gap-3 sm:grid-cols-12 sm:items-center">
      <label for="writing-search" class="sr-only">{{ WRITING_LIST_SEARCH_LABEL }}</label>
      <input
        id="writing-search"
        :name="WRITING_LIST_SEARCH_QUERY_PARAM"
        type="search"
        :value="queryState.searchQuery"
        :placeholder="WRITING_LIST_SEARCH_PLACEHOLDER"
        class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 sm:col-span-6"
      >

      <label for="writing-sort" class="sr-only">{{ WRITING_LIST_SORT_LABEL }}</label>
      <select
        id="writing-sort"
        :name="WRITING_LIST_SORT_QUERY_PARAM"
        :value="queryState.sort"
        class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2"
      >
        <option
          v-for="sortOption in writingSortOptions"
          :key="sortOption.value"
          :value="sortOption.value"
        >
          {{ sortOption.label }}
        </option>
      </select>

      <label for="writing-page-size" class="sr-only">{{ WRITING_LIST_PAGE_SIZE_LABEL }}</label>
      <select
        id="writing-page-size"
        :name="WRITING_LIST_PAGE_SIZE_QUERY_PARAM"
        :value="String(queryState.pageSize)"
        class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2"
      >
        <option
          v-for="pageSize in WRITING_LIST_PAGE_SIZE_OPTIONS"
          :key="pageSize"
          :value="String(pageSize)"
        >
          {{ `${WRITING_LIST_PAGE_SIZE_LABEL} ${pageSize}` }}
        </option>
      </select>

      <input
        v-if="queryState.tag"
        :name="WRITING_LIST_TAG_QUERY_PARAM"
        type="hidden"
        :value="queryState.tag"
      >
      <input
        :name="WRITING_LIST_PAGE_QUERY_PARAM"
        type="hidden"
        :value="String(WRITING_LIST_DEFAULT_PAGE)"
      >

      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100 px-4 py-2 text-sm font-medium text-white dark:text-gray-900 sm:col-span-1"
      >
        {{ WRITING_LIST_SEARCH_BUTTON_LABEL }}
      </button>
      <NuxtLink
        v-if="showResetLink"
        :to="clearFilterLink"
        class="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 sm:col-span-1"
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
            :to="writingListState.buildTagFilterLink(tag)"
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

    <nav
      v-if="pagination.totalPages > 1"
      :aria-label="WRITING_LIST_PAGINATION_NAV_LABEL"
      class="mt-10 flex items-center justify-center gap-2"
    >
      <NuxtLink
        v-if="pagination.currentPage > WRITING_LIST_DEFAULT_PAGE"
        :to="writingListState.buildPaginationLink(pagination.currentPage - 1)"
        class="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
      >
        {{ WRITING_LIST_PAGINATION_PREVIOUS_LABEL }}
      </NuxtLink>
      <span
        v-else
        aria-disabled="true"
        class="rounded-lg border border-gray-100 dark:border-gray-800 px-3 py-2 text-sm text-gray-300 dark:text-gray-700"
      >
        {{ WRITING_LIST_PAGINATION_PREVIOUS_LABEL }}
      </span>

      <NuxtLink
        v-for="link in paginationLinks"
        :key="link.page"
        :to="link.to"
        :aria-current="link.isCurrent ? 'page' : undefined"
        class="rounded-lg border px-3 py-2 text-sm"
        :class="link.isCurrent
          ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
          : 'border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-200'"
      >
        {{ link.page }}
      </NuxtLink>

      <NuxtLink
        v-if="pagination.currentPage < pagination.totalPages"
        :to="writingListState.buildPaginationLink(pagination.currentPage + 1)"
        class="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
      >
        {{ WRITING_LIST_PAGINATION_NEXT_LABEL }}
      </NuxtLink>
      <span
        v-else
        aria-disabled="true"
        class="rounded-lg border border-gray-100 dark:border-gray-800 px-3 py-2 text-sm text-gray-300 dark:text-gray-700"
      >
        {{ WRITING_LIST_PAGINATION_NEXT_LABEL }}
      </span>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '~/composables/usePageSeo'
import { useWritingListState } from '~/composables/useWritingListState'
import {
  WRITING_CONTENT_COLLECTION,
  WRITING_LIST_API_PATH,
  WRITING_LIST_DEFAULT_PAGE,
  WRITING_LIST_EMPTY_FILTERED_MESSAGE,
  WRITING_LIST_EMPTY_MESSAGE,
  WRITING_LIST_FILTER_RESET_BUTTON_LABEL,
  WRITING_LIST_LOAD_FAILED_MESSAGE,
  WRITING_LIST_LOAD_FAILED_STATUS_CODE,
  WRITING_LIST_META_DESCRIPTION,
  WRITING_LIST_OG_TITLE,
  WRITING_LIST_PAGE_OUT_OF_RANGE_MESSAGE,
  WRITING_LIST_PAGE_OUT_OF_RANGE_STATUS_CODE,
  WRITING_LIST_PAGE_QUERY_PARAM,
  WRITING_LIST_PAGE_SIZE_LABEL,
  WRITING_LIST_PAGE_SIZE_OPTIONS,
  WRITING_LIST_PAGE_SIZE_QUERY_PARAM,
  WRITING_LIST_PAGINATION_NAV_LABEL,
  WRITING_LIST_PAGINATION_NEXT_LABEL,
  WRITING_LIST_PAGINATION_PREVIOUS_LABEL,
  WRITING_LIST_QUERY_FIELDS,
  WRITING_LIST_SEARCH_LABEL,
  WRITING_LIST_SEARCH_BUTTON_LABEL,
  WRITING_LIST_SEARCH_PLACEHOLDER,
  WRITING_LIST_SEARCH_QUERY_PARAM,
  WRITING_LIST_SORT_LABEL,
  WRITING_LIST_SORT_LATEST,
  WRITING_LIST_SORT_LATEST_LABEL,
  WRITING_LIST_SORT_OLDEST,
  WRITING_LIST_SORT_OLDEST_LABEL,
  WRITING_LIST_SORT_QUERY_PARAM,
  WRITING_LIST_SUBTITLE,
  WRITING_LIST_TAG_QUERY_PARAM,
  WRITING_LIST_TITLE,
  WRITING_PATH_LIKE_PATTERN,
} from '~/constants/writing'
import {
  buildWritingListApiResponse,
  normalizeWritingList,
  type WritingListApiResponse,
  type WritingListPaginationMeta,
  type WritingListSourceItem,
} from '~/utils/writingList'
import { queryCollectionWithEvent } from '~/utils/queryCollectionWithEvent'

const writingListState = useWritingListState()
const queryState = computed(() => writingListState.queryState.value)
const clearFilterLink = computed(() => writingListState.clearFilterLink.value)
const isFiltered = computed(() => writingListState.isFiltered.value)

const writingSortOptions = [
  {
    value: WRITING_LIST_SORT_LATEST,
    label: WRITING_LIST_SORT_LATEST_LABEL,
  },
  {
    value: WRITING_LIST_SORT_OLDEST,
    label: WRITING_LIST_SORT_OLDEST_LABEL,
  },
] as const

const showResetLink = computed(() => Object.keys(writingListState.fetchQuery.value).length > 0)
const emptyStateMessage = computed(() => (
  isFiltered.value ? WRITING_LIST_EMPTY_FILTERED_MESSAGE : WRITING_LIST_EMPTY_MESSAGE
))

async function fetchWritingList(queryParams: Record<string, string>): Promise<WritingListApiResponse> {
  try {
    return await $fetch<WritingListApiResponse>(WRITING_LIST_API_PATH, {
      query: queryParams,
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
    const fallbackResponse = buildWritingListApiResponse(
      normalizeWritingList(fallbackList),
      writingListState.queryState.value,
    )

    if (fallbackResponse.isPageOutOfRange) {
      throw createError({
        statusCode: WRITING_LIST_PAGE_OUT_OF_RANGE_STATUS_CODE,
        statusMessage: WRITING_LIST_PAGE_OUT_OF_RANGE_MESSAGE,
      })
    }

    return {
      items: fallbackResponse.items,
      pagination: fallbackResponse.pagination,
    }
  }
}

function getErrorStatusCode(error: unknown): number | undefined {
  if (typeof error !== 'object' || !error || !('statusCode' in error)) {
    return undefined
  }

  const parsedError = error as Record<string, unknown>
  return typeof parsedError.statusCode === 'number' ? parsedError.statusCode : undefined
}

function getErrorStatusMessage(error: unknown): string | undefined {
  if (typeof error !== 'object' || !error || !('statusMessage' in error)) {
    return undefined
  }

  const parsedError = error as Record<string, unknown>
  return typeof parsedError.statusMessage === 'string' ? parsedError.statusMessage : undefined
}

const { data: writingListResponse, error: articleListError } = await useAsyncData<WritingListApiResponse>(
  () => writingListState.asyncDataKey.value,
  () => fetchWritingList(writingListState.fetchQuery.value),
)

if (articleListError.value) {
  throw createError({
    statusCode: getErrorStatusCode(articleListError.value) || WRITING_LIST_LOAD_FAILED_STATUS_CODE,
    statusMessage: getErrorStatusMessage(articleListError.value) || WRITING_LIST_LOAD_FAILED_MESSAGE,
    cause: articleListError.value,
  })
}

const articles = computed(() => writingListResponse.value?.items || [])
const pagination = computed<WritingListPaginationMeta>(() => (
  writingListResponse.value?.pagination || {
    totalCount: 0,
    totalPages: 1,
    currentPage: WRITING_LIST_DEFAULT_PAGE,
  }
))
const paginationLinks = computed(() => writingListState.buildPaginationLinks(pagination.value.totalPages))

usePageSeo({
  title: WRITING_LIST_TITLE,
  description: WRITING_LIST_META_DESCRIPTION,
  ogTitle: WRITING_LIST_OG_TITLE,
  canonicalPath: writingListState.canonicalPath,
  robots: writingListState.robots,
})
</script>
