<template>
  <button
    type="button"
    :aria-label="ariaLabel"
    :aria-pressed="isDark"
    @click="toggleTheme"
  >
    <Icon :name="iconName" class="w-5 h-5" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '~/composables/useTheme'
import {
  THEME_ICON_TO_DARK,
  THEME_ICON_TO_LIGHT,
  THEME_LABEL_TO_DARK,
  THEME_LABEL_TO_LIGHT,
} from '~/constants/theme'

const { isDark, toggleTheme } = useTheme()

const ariaLabel = computed(() => (isDark.value ? THEME_LABEL_TO_LIGHT : THEME_LABEL_TO_DARK))
const iconName = computed(() => (isDark.value ? THEME_ICON_TO_LIGHT : THEME_ICON_TO_DARK))
</script>
