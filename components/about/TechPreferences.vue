<template>
  <section>
    <CommonSectionTitle>
      기술 성향
    </CommonSectionTitle>

    <div class="space-y-4">
      <div
        v-for="pref in preferences"
        :key="pref.title"
        class="p-5 rounded-lg border border-gray-100 dark:border-gray-800"
      >
        <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ pref.title }}</h3>
        <ul class="space-y-1.5">
          <li
            v-for="(detail, idx) in pref.details"
            :key="idx"
            class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex items-start gap-2"
          >
            <Icon name="heroicons:check" class="w-4 h-4 text-primary-500 dark:text-primary-400 mt-0.5 flex-shrink-0" />
            <span>{{ detail }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const preferences = [
  {
    title: 'Vue / Nuxt',
    details: [
      'Options API보다 Composition API 선호',
      'Composable은 동기적이며, ref 같은 반응형 값을 반환하는 형태가 자연스럽다는 기대',
    ],
  },
  {
    title: '설계 원칙',
    details: [
      '스토어에서 API 호출하지 않음',
      '라우트 설정을 최소화/회피하는 방향',
    ],
  },
]
</script>
