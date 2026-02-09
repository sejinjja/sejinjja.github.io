<template>
  <section>
    <CommonSectionTitle>
      함께 일할 때 잘 맞는 방식
    </CommonSectionTitle>

    <div class="p-6 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
      <ul class="space-y-4">
        <li
          v-for="(guide, idx) in guides"
          :key="idx"
          class="flex items-start gap-3"
        >
          <div class="w-6 h-6 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-xs font-bold text-primary-700 dark:text-primary-300">{{ idx + 1 }}</span>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ guide }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const guides = [
  '"지금 무엇이 확정이고, 무엇이 미정인지"를 명시해주면 최고의 퍼포먼스를 냅니다.',
  '요구사항에 입력 계약 / 실패 조건 / 검증 기준을 같이 주면 구현 품질이 급상승합니다.',
  '변경 요청은 "왜 바뀌는지"와 "어디까지 보장해야 하는지(테스트 범위)"가 포함되면 가장 좋습니다.',
]
</script>
