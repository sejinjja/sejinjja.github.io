<template>
  <section>
    <CommonSectionTitle>
      {{ ABOUT_WORK_APPROACH_TITLE }}
    </CommonSectionTitle>

    <div class="space-y-8">
      <div v-for="approach in ABOUT_WORK_APPROACH_ITEMS" :key="approach.title">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
            <Icon :name="approach.icon" class="w-4 h-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
          </div>
          <h3 class="font-bold text-gray-900 dark:text-white">{{ approach.title }}</h3>
        </div>
        <ul class="space-y-2 pl-11">
          <li
            v-for="(point, idx) in approach.points"
            :key="idx"
            class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed relative before:content-[''] before:absolute before:-left-4 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary-300 dark:before:bg-primary-600"
          >
            {{ point }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ABOUT_WORK_APPROACH_ITEMS,
  ABOUT_WORK_APPROACH_TITLE,
} from '~/constants/about'
</script>
