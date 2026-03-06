<template>
  <section class="p-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
    <div class="flex flex-col sm:flex-row items-start gap-6">
      <div class="w-20 h-20 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center flex-shrink-0">
        <Icon :name="ABOUT_PROFILE_AVATAR_ICON" class="w-10 h-10 text-primary-600 dark:text-primary-300" aria-hidden="true" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ ABOUT_PROFILE_NAME }}</h2>
        <p class="text-primary-700 dark:text-primary-400 font-medium mb-3">{{ ABOUT_PROFILE_ROLE }}</p>
        <ul class="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
          <li
            v-for="item in ABOUT_PROFILE_INFO_ITEMS"
            :key="item.text"
            class="flex items-center gap-2"
          >
            <Icon :name="item.icon" class="w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            {{ item.text }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ABOUT_PROFILE_AVATAR_ICON,
  ABOUT_PROFILE_INFO_ITEMS,
  ABOUT_PROFILE_NAME,
  ABOUT_PROFILE_ROLE,
} from '~/constants/about'
</script>
