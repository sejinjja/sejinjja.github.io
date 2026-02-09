<template>
  <div class="max-w-3xl mx-auto px-6 py-16">
    <ContentDoc v-slot="{ doc }">
      <article>
        <header class="mb-10">
          <NuxtLink to="/writing" class="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6">
            <Icon name="heroicons:arrow-left" class="w-4 h-4" />
            글 목록으로
          </NuxtLink>
          <time class="block text-sm text-gray-400 mb-2">{{ doc.date }}</time>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-4">{{ doc.title }}</h1>
          <p v-if="doc.description" class="text-gray-500 dark:text-gray-400">{{ doc.description }}</p>
          <div class="flex flex-wrap gap-2 mt-4">
            <CommonBadgeTag v-for="tag in doc.tags" :key="tag">{{ tag }}</CommonBadgeTag>
          </div>
        </header>
        <div class="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-code:text-primary-700 dark:prose-code:text-primary-300 prose-code:bg-primary-50 dark:prose-code:bg-primary-900/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
          <ContentRenderer :value="doc" />
        </div>
      </article>
    </ContentDoc>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '글',
})
</script>
