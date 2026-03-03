<template>
  <section class="max-w-5xl mx-auto px-6 py-20">
    <CommonSectionTitle>
      핵심 키워드
      <template #subtitle>제가 일하는 방식을 정의하는 네 가지 가치입니다.</template>
    </CommonSectionTitle>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <CommonIconFeatureCard
        v-for="keyword in keywords"
        :key="keyword.title"
        :icon="keyword.icon"
        :title="keyword.title"
        :description="keyword.description"
        :interactive="true"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const keywords = [
  {
    title: '정확성 / 일관성',
    icon: 'heroicons:check-badge',
    description: '경계 조건, 실패 조건, 검증 기준이 흐려지는 것을 싫어하고 "정의 → 구현 → 검증"의 정합성을 중요하게 봅니다.',
  },
  {
    title: '구조화 / 재사용',
    icon: 'heroicons:cube-transparent',
    description: '문제를 분해하고 재사용 가능한 형태로 정리하는 성향이 강합니다. 요구사항 이해 → 해결 전략 → 구현.',
  },
  {
    title: '실전 지향',
    icon: 'heroicons:rocket-launch',
    description: '"되긴 하는 코드"보다 프로덕션에서 안전하게 굴러가는 구조를 선호합니다.',
  },
  {
    title: '학습의 목적성',
    icon: 'heroicons:light-bulb',
    description: '단순 지식 축적보다, 당장 쓰일 수 있는 형태(문서/가이드/CLI/템플릿)로 남기려 합니다.',
  },
]
</script>
