<template>
  <section>
    <CommonSectionTitle>
      {{ ABOUT_COLLABORATION_GUIDE_TITLE }}
    </CommonSectionTitle>

    <div class="p-6 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
      <ul class="space-y-4">
        <li
          v-for="(guide, idx) in ABOUT_COLLABORATION_GUIDE_ITEMS"
          :key="idx"
          class="flex items-start gap-3"
        >
          <div class="w-6 h-6 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-xs font-bold text-primary-700 dark:text-primary-300">{{ idx + 1 }}</span>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ guide }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ABOUT_COLLABORATION_GUIDE_ITEMS,
  ABOUT_COLLABORATION_GUIDE_TITLE,
} from '~/constants/about'
</script>
