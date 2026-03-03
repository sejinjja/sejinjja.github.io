<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :aria-label="ariaLabel || title"
    class="group block"
  >
    <CommonContentCard :interactive="true" :elevated="elevated" padding="lg">
      <div :class="iconWrapClass">
        <Icon :name="icon" class="w-5 h-5 text-primary-600 dark:text-primary-300" aria-hidden="true" />
      </div>
      <h3 class="font-bold text-gray-900 dark:text-gray-100 mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">{{ description }}</p>
      <slot />
    </CommonContentCard>
  </NuxtLink>

  <CommonContentCard v-else :interactive="interactive" :elevated="elevated" padding="lg">
    <div :class="iconWrapClass">
      <Icon :name="icon" class="w-5 h-5 text-primary-600 dark:text-primary-300" aria-hidden="true" />
    </div>
    <h3 class="font-bold text-gray-900 dark:text-gray-100 mb-1">{{ title }}</h3>
    <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ description }}</p>
    <slot />
  </CommonContentCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  icon: string
  title: string
  description: string
  to?: string
  ariaLabel?: string
  elevated?: boolean
  interactive?: boolean
}>(), {
  to: undefined,
  ariaLabel: undefined,
  elevated: false,
  interactive: false,
})

const iconWrapClass = computed(() => [
  'w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/35 flex items-center justify-center mb-4 transition-colors',
  props.to ? 'group-hover:bg-primary-100 dark:group-hover:bg-primary-800/40' : '',
])
</script>
