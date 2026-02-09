<template>
  <div>
    <HomeHeroSection />
    <HomeKeywordsSection />
    <HomeQuickNav />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const canonicalUrl = computed(() => `${siteUrl.replace(/\/$/, '')}${route.path}`)
const description = '실무에서 통하는 정확함과 구조화된 사고로 문제를 끝까지 해결하는 프런트엔드/웹 개발자 조세진입니다.'

useSeoMeta({
  title: '홈',
  description,
  ogTitle: '조세진 | 프런트엔드/웹 개발자',
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogLocale: 'ko_KR',
  twitterCard: 'summary_large_image',
})

useHead(() => ({
  title: '홈',
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
}))
</script>
