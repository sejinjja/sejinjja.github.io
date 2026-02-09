<template>
  <section class="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
    <div class="max-w-5xl mx-auto px-6 py-20">
      <CommonSectionTitle>
        둘러보기
      </CommonSectionTitle>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="group p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm transition-all"
        >
          <div class="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
            <Icon :name="item.icon" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="font-bold text-gray-900 dark:text-white mb-1">{{ item.label }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const navItems = [
  {
    to: '/about',
    icon: 'heroicons:user',
    label: '소개',
    description: '일하는 방식, 기술 성향, 함께 일할 때 잘 맞는 방식을 소개합니다.',
  },
  {
    to: '/projects',
    icon: 'heroicons:code-bracket',
    label: '프로젝트',
    description: '직접 만든 도구와 서비스를 확인할 수 있습니다.',
  },
  {
    to: '/writing',
    icon: 'heroicons:pencil-square',
    label: '글',
    description: '기술 글과 개발 경험을 기록합니다.',
  },
]
</script>
