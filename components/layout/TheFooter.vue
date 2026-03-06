<template>
  <footer class="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
    <div class="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-300">
        &copy; {{ new Date().getFullYear() }} {{ FOOTER_COPYRIGHT_NAME }}
      </p>
      <div class="flex items-center gap-4">
        <NuxtLink
          :to="FOOTER_FEED_TO"
          class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          :aria-label="FOOTER_FEED_LABEL"
        >
          {{ FOOTER_FEED_LABEL }}
        </NuxtLink>
        <NuxtLink
          :to="FOOTER_SITEMAP_TO"
          class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          :aria-label="FOOTER_SITEMAP_LABEL"
        >
          {{ FOOTER_SITEMAP_LABEL }}
        </NuxtLink>
        <a
          :href="FOOTER_GITHUB_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          :aria-label="FOOTER_GITHUB_ARIA_LABEL"
        >
          <Icon name="mdi:github" class="w-5 h-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {
  FOOTER_COPYRIGHT_NAME,
  FOOTER_FEED_TO,
  FOOTER_FEED_LABEL,
  FOOTER_GITHUB_ARIA_LABEL,
  FOOTER_GITHUB_URL,
  FOOTER_SITEMAP_TO,
  FOOTER_SITEMAP_LABEL,
} from '~/constants/navigation'
</script>
