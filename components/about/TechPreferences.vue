<template>
  <section>
    <CommonSectionTitle>
      기술 성향
    </CommonSectionTitle>

    <div class="space-y-4">
      <CommonContentCard
        v-for="pref in preferences"
        :key="pref.title"
      >
        <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ pref.title }}</h3>
        <ul class="space-y-1.5">
          <li
            v-for="(detail, idx) in pref.details"
            :key="idx"
            class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex items-start gap-2"
          >
            <Icon name="heroicons:check" class="w-4 h-4 text-primary-500 dark:text-primary-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{{ detail }}</span>
          </li>
        </ul>
      </CommonContentCard>
    </div>
  </section>
</template>

<script setup lang="ts">
const preferences = [
  {
    title: 'Vue / Nuxt 제품 개발',
    details: [
      'Composition API 기반으로 화면 로직과 도메인 로직을 분리해 유지보수성을 높입니다.',
      '페이지는 단순하게 유지하고, 공통 상태/행동은 composable과 서버 API 계층으로 올립니다.',
      'SSR/SEO/접근성을 초기 설계에 포함해 Nuxt의 장점을 기본값으로 가져갑니다.',
    ],
  },
  {
    title: '설계 원칙과 코드 품질',
    details: [
      '상태는 필요한 범위에서만 관리하고 전역 스토어 남용을 피합니다.',
      '기능 추가 전 타입 경계를 먼저 정의해 변경 영향도를 예측 가능하게 만듭니다.',
      '작은 단위 컴포넌트, 명확한 네이밍, 일관된 디렉토리 규칙을 우선합니다.',
    ],
  },
  {
    title: '성능과 운영 관점',
    details: [
      '요청/렌더 병목은 캐싱, 배치 처리, 불필요한 반응성 축소로 선제 대응합니다.',
      '타입체크와 자동화 스크립트를 배포 전 기본 게이트로 두어 회귀를 줄입니다.',
      '문제 발생 시 재현 가능한 로그와 에러 메시지를 남겨 대응 시간을 단축합니다.',
    ],
  },
  {
    title: '협업 방식',
    details: [
      'PR에는 구현 의도, 대안, 트레이드오프를 함께 기록해 의사결정을 투명하게 공유합니다.',
      '리뷰는 취향보다 사용자 영향과 리스크 중심으로 진행합니다.',
      '반복 이슈는 개인 실수로 끝내지 않고 시스템 개선 과제로 환원합니다.',
    ],
  },
]
</script>
