<template>
  <div class="max-w-6xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">근무 스케줄 관리</h1>
    <p class="text-gray-500 dark:text-gray-300 mb-8">
      독립 HTML 도구를 Nuxt 라우트로 편입한 페이지입니다. 아래에서 기존 기능을 그대로 사용할 수 있습니다.
    </p>

    <div class="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
      <iframe
        src="/tools/work-schedule-manager.html"
        title="근무 스케줄 관리 도구"
        class="w-full h-[82vh]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '~/composables/usePageSeo'

const description = '근무표 입력, 규칙 검증, 엑셀 입출력을 지원하는 근무 스케줄 관리 도구입니다.'

usePageSeo({
  title: '근무 스케줄 관리',
  description,
  ogTitle: '근무 스케줄 관리 | 조세진',
})
</script>
