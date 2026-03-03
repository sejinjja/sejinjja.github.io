<template>
  <div>
    <HomeHeroSection />
    <HomeKeywordsSection />
    <HomeQuickNav />
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '~/composables/usePageSeo'

const description = '실무에서 통하는 정확함과 구조화된 사고로 문제를 끝까지 해결하는 프런트엔드/웹 개발자 조세진입니다.'

usePageSeo({
  title: '홈',
  description,
  ogTitle: '조세진 | 프런트엔드/웹 개발자',
})
</script>
