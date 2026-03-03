import { computed } from 'vue'
import { useColorMode } from '#imports'
import {
  THEME_DARK,
  THEME_LIGHT,
  THEME_SYSTEM,
  type ThemeMode,
} from '~/constants/theme'

export function useTheme() {
  const colorMode = useColorMode()

  const theme = computed<ThemeMode>(() => {
    if (colorMode.preference === THEME_SYSTEM) {
      return colorMode.value === THEME_DARK ? THEME_DARK : THEME_LIGHT
    }

    return colorMode.preference === THEME_DARK ? THEME_DARK : THEME_LIGHT
  })

  const isDark = computed(() => theme.value === THEME_DARK)

  function setTheme(mode: ThemeMode) {
    colorMode.preference = mode
  }

  function toggleTheme() {
    setTheme(isDark.value ? THEME_LIGHT : THEME_DARK)
  }

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  }
}
