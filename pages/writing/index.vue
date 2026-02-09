<template>
  <div class="max-w-5xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">글</h1>
    <p class="text-gray-500 dark:text-gray-400 mb-10">실무에서 부딪힌 문제와 해결 과정을 기록합니다.</p>

    <ContentList path="/writing" v-slot="{ list }">
      <div class="space-y-6">
        <NuxtLink
          v-for="article in list"
          :key="article._path"
          :to="article._path"
          class="block p-6 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm transition-all"
        >
          <time class="text-xs text-gray-400 font-medium">{{ article.date }}</time>
          <h2 class="font-bold text-gray-900 dark:text-white text-lg mt-1 mb-2">{{ article.title }}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ article.description }}</p>
          <div class="flex flex-wrap gap-2 mt-3">
            <CommonBadgeTag v-for="tag in article.tags" :key="tag">{{ tag }}</CommonBadgeTag>
          </div>
        </NuxtLink>
      </div>
    </ContentList>

    <div v-if="false" class="text-center py-20 text-gray-400">
      아직 작성된 글이 없습니다.
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '글',
})
</script>
