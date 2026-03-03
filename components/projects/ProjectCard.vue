<template>
  <CommonContentCard :interactive="true" padding="lg">
    <div class="flex items-start justify-between mb-3">
      <h3 class="font-bold text-gray-900 dark:text-gray-100 text-lg">{{ project.title }}</h3>
      <CommonBadgeTag v-if="project.status">{{ project.status }}</CommonBadgeTag>
    </div>
    <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
      {{ project.description }}
    </p>
    <div class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="tech in project.techStack"
        :key="tech"
        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300"
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
        :aria-label="`${project.title} GitHub 저장소 (새 탭에서 열림)`"
        class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
      >
        <Icon name="mdi:github" class="w-4 h-4" aria-hidden="true" />
        GitHub
      </a>
      <a
        v-if="project.demo"
        :href="project.demo"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`${project.title} 데모 (새 탭에서 열림)`"
        class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
      >
        <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" aria-hidden="true" />
        Demo
      </a>
    </div>
  </CommonContentCard>
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
