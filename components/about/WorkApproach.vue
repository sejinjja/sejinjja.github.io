<template>
  <section>
    <CommonSectionTitle>
      일하는 방식
    </CommonSectionTitle>

    <div class="space-y-8">
      <div v-for="approach in approaches" :key="approach.title">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
            <Icon :name="approach.icon" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="font-bold text-gray-900 dark:text-white">{{ approach.title }}</h3>
        </div>
        <ul class="space-y-2 pl-11">
          <li
            v-for="(point, idx) in approach.points"
            :key="idx"
            class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed relative before:content-[''] before:absolute before:-left-4 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary-300 dark:before:bg-primary-600"
          >
            {{ point }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const approaches = [
  {
    title: '문제 접근 패턴',
    icon: 'heroicons:magnifying-glass',
    points: [
      '현상을 먼저 관찰하고, 원인 범위를 좁힌 뒤 해결합니다.',
      '재현 가능한 최소 사례(최소 입력/최소 코드)를 만들고, 이후 확장합니다.',
      '"왜 이렇게 해야 하는가"를 납득할 수 있어야 움직입니다.',
    ],
  },
  {
    title: '품질 기준',
    icon: 'heroicons:shield-check',
    points: [
      '엣지 케이스와 예외 처리(실패 조건)를 포함한 "완결성"을 중시합니다.',
      '성능 이슈는 감(느낌)이 아니라, 관찰 가능한 지표(측정/프로파일링) 중심으로 다루려 합니다.',
    ],
  },
  {
    title: '커뮤니케이션 스타일',
    icon: 'heroicons:chat-bubble-left-right',
    points: [
      '표현의 작은 차이가 구현 차이를 만든다고 보고, 문장/정의의 정확도를 챙깁니다.',
      '피드백은 건설적이고 구체적인 개선 방향이 있어야 가치 있다고 느낍니다.',
    ],
  },
]
</script>
