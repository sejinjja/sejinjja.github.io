<template>
  <article :class="cardClass">
    <slot />
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  interactive?: boolean
  elevated?: boolean
  padding?: 'md' | 'lg'
}>(), {
  interactive: false,
  elevated: false,
  padding: 'md',
})

const cardClass = computed(() => [
  props.padding === 'lg' ? 'p-6' : 'p-5',
  'rounded-xl border border-gray-100 dark:border-gray-800',
  props.elevated ? 'bg-white dark:bg-gray-900/60' : 'dark:bg-gray-900/40',
  props.interactive ? 'transition-all hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-sm' : '',
])
</script>
