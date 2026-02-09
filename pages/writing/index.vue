<template>
  <div class="max-w-5xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">湲</h1>
    <p class="text-gray-500 dark:text-gray-300 mb-10">?ㅻТ?먯꽌 遺?ろ엺 臾몄젣? ?닿껐 怨쇱젙??湲곕줉?⑸땲??</p>

    <ContentList path="/writing" :query="{ sort: [{ date: -1 }] }" v-slot="{ list }">
      <div v-if="list.length" class="space-y-6">
        <NuxtLink
          v-for="article in list"
          :key="article._path"
          :to="article._path"
          class="block p-6 rounded-xl border border-gray-100 dark:border-gray-800 dark:bg-gray-900/50 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-sm transition-all"
        >
          <time class="text-xs text-gray-400 font-medium">{{ article.date }}</time>
          <h2 class="font-bold text-gray-900 dark:text-gray-100 text-lg mt-1 mb-2">{{ article.title }}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ article.description }}</p>
          <div class="flex flex-wrap gap-2 mt-3">
            <CommonBadgeTag v-for="tag in article.tags || []" :key="tag">{{ tag }}</CommonBadgeTag>
          </div>
        </NuxtLink>
      </div>
      <div v-else class="text-center py-20 text-gray-400">
        No posts are published yet.
      </div>
    </ContentList>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const canonicalUrl = computed(() => `${siteUrl.replace(/\/$/, '')}${route.path}`)
const description = '?ㅻТ?먯꽌 遺?ろ엺 臾몄젣, ?닿껐 怨쇱젙, 媛쒕컻 ?몄궗?댄듃瑜?湲곕줉??湲곗닠 湲 紐⑸줉?낅땲??'

useSeoMeta({
  title: '湲',
  description,
  ogTitle: 'Writing | Sejin Jo',
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogLocale: 'ko_KR',
  twitterCard: 'summary_large_image',
})

useHead(() => ({
  title: '湲',
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
}))
</script>
