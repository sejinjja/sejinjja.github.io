<template>
  <section class="bg-gradient-to-br from-gray-900 via-primary-900 to-gray-950 text-white">
    <div class="max-w-5xl mx-auto px-6 py-24 md:py-32">
      <p class="text-primary-300 text-sm font-medium tracking-wider uppercase mb-4">
        {{ HOME_HERO_ROLE_LABEL }}
      </p>
      <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-6">
        {{ HOME_HERO_TITLE }}
      </h1>
      <p class="text-lg md:text-xl text-primary-100 max-w-2xl leading-relaxed">
        {{ HOME_HERO_DESCRIPTION_LINES[0] }}<br class="hidden sm:block">
        {{ HOME_HERO_DESCRIPTION_LINES[1] }}
      </p>
      <div class="mt-10 flex flex-wrap gap-4">
        <NuxtLink
          :to="HOME_HERO_PRIMARY_CTA_TO"
          class="inline-flex items-center px-6 py-3 bg-white text-primary-900 font-semibold rounded-lg hover:bg-primary-50 transition-colors shadow-sm"
        >
          {{ HOME_HERO_PRIMARY_CTA_LABEL }}
          <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
        </NuxtLink>
        <NuxtLink
          :to="HOME_HERO_SECONDARY_CTA_TO"
          class="inline-flex items-center px-6 py-3 border border-primary-300/80 text-primary-50 font-semibold rounded-lg hover:bg-primary-800/70 transition-colors"
        >
          {{ HOME_HERO_SECONDARY_CTA_LABEL }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  HOME_HERO_DESCRIPTION_LINES,
  HOME_HERO_PRIMARY_CTA_LABEL,
  HOME_HERO_PRIMARY_CTA_TO,
  HOME_HERO_ROLE_LABEL,
  HOME_HERO_SECONDARY_CTA_LABEL,
  HOME_HERO_SECONDARY_CTA_TO,
  HOME_HERO_TITLE,
} from '~/constants/home'
</script>
