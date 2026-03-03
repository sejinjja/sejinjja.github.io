<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
    <LayoutTheHeader />
    <main id="main-content" class="flex-1 flex items-center justify-center px-6">
      <div class="text-center">
        <p class="text-7xl font-bold text-primary-600 dark:text-primary-400 mb-4">{{ error.statusCode }}</p>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {{ error.statusCode === 404 ? '페이지를 찾을 수 없습니다' : '오류가 발생했습니다' }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mb-8">
          {{ error.statusCode === 404 ? '요청하신 페이지가 존재하지 않거나 이동되었습니다.' : '잠시 후 다시 시도해 주세요.' }}
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
        >
          홈으로 돌아가기
        </NuxtLink>
      </div>
    </main>
    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: { statusCode: number; statusMessage?: string }
}>()
</script>
