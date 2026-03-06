<template>
  <section>
    <CommonSectionTitle>
      {{ ABOUT_TECH_PREFERENCES_TITLE }}
    </CommonSectionTitle>

    <div class="space-y-4">
      <CommonContentCard
        v-for="pref in ABOUT_TECH_PREFERENCE_ITEMS"
        :key="pref.title"
      >
        <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ pref.title }}</h3>
        <ul class="space-y-1.5">
          <li
            v-for="(detail, idx) in pref.details"
            :key="idx"
            class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex items-start gap-2"
          >
            <Icon name="heroicons:check" class="w-4 h-4 text-primary-500 dark:text-primary-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{{ detail }}</span>
          </li>
        </ul>
      </CommonContentCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ABOUT_TECH_PREFERENCE_ITEMS,
  ABOUT_TECH_PREFERENCES_TITLE,
} from '~/constants/about'
</script>
