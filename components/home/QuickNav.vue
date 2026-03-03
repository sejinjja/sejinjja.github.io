<template>
  <section class="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
    <div class="max-w-5xl mx-auto px-6 py-20">
      <CommonSectionTitle>
        둘러보기
      </CommonSectionTitle>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <CommonIconFeatureCard
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :icon="item.icon"
          :title="item.label"
          :description="item.description"
          :aria-label="`${item.label} 페이지로 이동`"
          :elevated="true"
        />
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
