<template>
  <div class="max-w-5xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-10">소개</h1>

    <div class="space-y-16">
      <AboutProfileCard />
      <AboutWorkApproach />
      <AboutTechPreferences />
      <AboutCollaborationGuide />

      <!-- 강점 -->
      <section>
        <CommonSectionTitle>
          강점
        </CommonSectionTitle>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="strength in strengths"
            :key="strength.title"
            class="p-5 rounded-lg border border-gray-100 dark:border-gray-800"
          >
            <h3 class="font-bold text-gray-900 dark:text-white mb-2 text-sm">{{ strength.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ strength.description }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '소개',
})

const strengths = [
  {
    title: '정의와 구현의 정합성',
    description: '문서/코드/동작이 서로 다르게 해석되는 상황을 싫어하고, 이를 줄이는 방향으로 정리합니다.',
  },
  {
    title: '실무 감각 있는 구조화',
    description: '라이브러리/패턴을 "왜 필요한가, 언제 무너지는가"로 평가합니다.',
  },
  {
    title: '도구화 능력',
    description: '반복 작업을 CLI/가이드/템플릿으로 전환해 생산성을 끌어올리는 타입입니다.',
  },
  {
    title: '깊이 있는 검증 태도',
    description: '"대충 맞는 설명"보다 근거와 경계 조건을 챙기는 편입니다.',
  },
]
</script>
