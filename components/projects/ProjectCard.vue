<template>
  <div class="p-6 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm transition-all">
    <div class="flex items-start justify-between mb-3">
      <h3 class="font-bold text-gray-900 dark:text-white text-lg">{{ project.title }}</h3>
      <CommonBadgeTag v-if="project.status">{{ project.status }}</CommonBadgeTag>
    </div>
    <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
      {{ project.description }}
    </p>
    <div class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="tech in project.techStack"
        :key="tech"
        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
      >
        {{ tech }}
      </span>
    </div>
    <div class="flex gap-3">
      <a
        v-if="project.github"
        :href="project.github"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <Icon name="mdi:github" class="w-4 h-4" />
        GitHub
      </a>
      <a
        v-if="project.demo"
        :href="project.demo"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" />
        Demo
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  title: string
  description: string
  techStack: string[]
  status?: string
  github?: string
  demo?: string
}

defineProps<{
  project: Project
}>()
</script>
