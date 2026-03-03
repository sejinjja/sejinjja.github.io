<template>
  <div class="max-w-5xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{{ PROJECTS_PAGE_TITLE }}</h1>
    <p class="text-gray-500 dark:text-gray-300 mb-10">{{ PROJECTS_PAGE_SUBTITLE }}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProjectsProjectCard
        v-for="project in projects"
        :key="project.title"
        :project="project"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '~/composables/usePageSeo'
import {
  PROJECTS_ITEMS,
  PROJECTS_PAGE_META_DESCRIPTION,
  PROJECTS_PAGE_OG_TITLE,
  PROJECTS_PAGE_SUBTITLE,
  PROJECTS_PAGE_TITLE,
} from '~/constants/projects'

usePageSeo({
  title: PROJECTS_PAGE_TITLE,
  description: PROJECTS_PAGE_META_DESCRIPTION,
  ogTitle: PROJECTS_PAGE_OG_TITLE,
})

const projects = PROJECTS_ITEMS
</script>
