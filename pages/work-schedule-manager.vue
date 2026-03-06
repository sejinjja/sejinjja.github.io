<template>
  <div class="max-w-6xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{{ WORK_SCHEDULE_MANAGER_PAGE_TITLE }}</h1>
    <p class="text-gray-500 dark:text-gray-300 mb-8">
      {{ WORK_SCHEDULE_MANAGER_PAGE_LEAD }}
    </p>

    <div class="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
      <iframe
        :src="WORK_SCHEDULE_MANAGER_IFRAME_SRC"
        :title="WORK_SCHEDULE_MANAGER_IFRAME_TITLE"
        class="w-full h-[82vh]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '~/composables/usePageSeo'
import {
  WORK_SCHEDULE_MANAGER_IFRAME_SRC,
  WORK_SCHEDULE_MANAGER_IFRAME_TITLE,
  WORK_SCHEDULE_MANAGER_PAGE_LEAD,
  WORK_SCHEDULE_MANAGER_PAGE_META_DESCRIPTION,
  WORK_SCHEDULE_MANAGER_PAGE_OG_TITLE,
  WORK_SCHEDULE_MANAGER_PAGE_TITLE,
} from '~/constants/workScheduleManager'

usePageSeo({
  title: WORK_SCHEDULE_MANAGER_PAGE_TITLE,
  description: WORK_SCHEDULE_MANAGER_PAGE_META_DESCRIPTION,
  ogTitle: WORK_SCHEDULE_MANAGER_PAGE_OG_TITLE,
})
</script>
