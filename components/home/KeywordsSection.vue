<template>
  <section class="max-w-5xl mx-auto px-6 py-20">
    <CommonSectionTitle>
      {{ HOME_KEYWORDS_SECTION_TITLE }}
      <template #subtitle>{{ HOME_KEYWORDS_SECTION_SUBTITLE }}</template>
    </CommonSectionTitle>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <CommonIconFeatureCard
        v-for="keyword in HOME_KEYWORD_ITEMS"
        :key="keyword.title"
        :icon="keyword.icon"
        :title="keyword.title"
        :description="keyword.description"
        :interactive="true"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  HOME_KEYWORD_ITEMS,
  HOME_KEYWORDS_SECTION_SUBTITLE,
  HOME_KEYWORDS_SECTION_TITLE,
} from '~/constants/home'
</script>
