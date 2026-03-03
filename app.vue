<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// 사이트 타이틀 템플릿 설정
// https://nuxt.com/docs/api/composables/use-head
useHead({
  titleTemplate: '%s | 조세진',
})
</script>
