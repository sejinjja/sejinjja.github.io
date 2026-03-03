<template>
  <div>
    <HomeHeroSection />
    <HomeKeywordsSection />
    <HomeQuickNav />
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '~/composables/usePageSeo'
import {
  HOME_PAGE_META_DESCRIPTION,
  HOME_PAGE_OG_TITLE,
  HOME_PAGE_TITLE,
} from '~/constants/home'

usePageSeo({
  title: HOME_PAGE_TITLE,
  description: HOME_PAGE_META_DESCRIPTION,
  ogTitle: HOME_PAGE_OG_TITLE,
})
</script>
