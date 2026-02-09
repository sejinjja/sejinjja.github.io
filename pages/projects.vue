<template>
  <div class="max-w-5xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">프로젝트</h1>
    <p class="text-gray-500 dark:text-gray-400 mb-10">반복 작업을 도구로 전환하고, 아이디어를 서비스로 만듭니다.</p>

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
useHead({
  title: '프로젝트',
})

const projects = [
  {
    title: 'ls-diff',
    description: '두 디렉토리 간 파일 리스트 차이를 비교하는 Node.js CLI 도구. 파일명 비교(-l), 내용 비교(-d), 또는 둘 다(-ld) 지원. 패턴 include/exclude 옵션 제공.',
    techStack: ['Node.js', 'CLI', 'JavaScript'],
    status: '개발 중',
    github: 'https://github.com/sejinjja/ls-diff',
  },
  {
    title: '너의 오늘에게',
    description: '감정 기반 편지 생성 서비스. 사용자의 감정 상태에 맞는 따뜻한 편지를 생성합니다.',
    techStack: ['Vue.js', 'AI', 'Service'],
    status: '기획 중',
  },
]
</script>
