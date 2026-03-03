<template>
  <div class="max-w-5xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10">{{ ABOUT_PAGE_TITLE }}</h1>

    <div class="space-y-16">
      <AboutProfileCard />
      <AboutWorkApproach />
      <AboutTechPreferences />
      <AboutCollaborationGuide />

      <!-- 강점 -->
      <section>
        <CommonSectionTitle>
          강점
        </CommonSectionTitle>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CommonContentCard
            v-for="strength in strengths"
            :key="strength.title"
          >
            <h3 class="font-bold text-gray-900 dark:text-gray-100 mb-2 text-sm">{{ strength.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ strength.description }}</p>
          </CommonContentCard>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '~/composables/usePageSeo'
import {
  ABOUT_PAGE_META_DESCRIPTION,
  ABOUT_PAGE_OG_TITLE,
  ABOUT_PAGE_STRENGTHS,
  ABOUT_PAGE_TITLE,
} from '~/constants/about'

usePageSeo({
  title: ABOUT_PAGE_TITLE,
  description: ABOUT_PAGE_META_DESCRIPTION,
  ogTitle: ABOUT_PAGE_OG_TITLE,
})

const strengths = ABOUT_PAGE_STRENGTHS
</script>
