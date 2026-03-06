<template>
  <section class="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
    <div class="max-w-5xl mx-auto px-6 py-20">
      <CommonSectionTitle>
        둘러보기
      </CommonSectionTitle>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CommonIconFeatureCard
          v-for="item in QUICK_NAV_ITEMS"
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
import { QUICK_NAV_ITEMS } from '~/constants/home'
</script>
