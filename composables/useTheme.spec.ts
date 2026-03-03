import { reactive } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { THEME_DARK, THEME_LIGHT, THEME_SYSTEM } from '~/constants/theme'
import { useTheme } from './useTheme'

const colorModeState = reactive({
  preference: THEME_SYSTEM,
  value: THEME_LIGHT,
})

vi.mock('#imports', () => ({
  useColorMode: () => colorModeState,
}))

describe('useTheme', () => {
  beforeEach(() => {
    colorModeState.preference = THEME_SYSTEM
    colorModeState.value = THEME_LIGHT
  })

  it('returns dark mode when system value is dark', () => {
    colorModeState.preference = THEME_SYSTEM
    colorModeState.value = THEME_DARK

    const { theme, isDark } = useTheme()

    expect(theme.value).toBe(THEME_DARK)
    expect(isDark.value).toBe(true)
  })

  it('toggles from dark to light', () => {
    colorModeState.preference = THEME_DARK
    colorModeState.value = THEME_DARK

    const { toggleTheme } = useTheme()
    toggleTheme()

    expect(colorModeState.preference).toBe(THEME_LIGHT)
  })

  it('toggles from light to dark', () => {
    colorModeState.preference = THEME_LIGHT
    colorModeState.value = THEME_LIGHT

    const { toggleTheme } = useTheme()
    toggleTheme()

    expect(colorModeState.preference).toBe(THEME_DARK)
  })

  it('sets theme directly', () => {
    const { setTheme } = useTheme()
    setTheme(THEME_DARK)

    expect(colorModeState.preference).toBe(THEME_DARK)
  })
})
