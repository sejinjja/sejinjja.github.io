export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'
export const THEME_SYSTEM = 'system'

export const THEME_ICON_TO_LIGHT = 'heroicons:sun'
export const THEME_ICON_TO_DARK = 'heroicons:moon'

export const THEME_LABEL_TO_LIGHT = '라이트 모드로 전환'
export const THEME_LABEL_TO_DARK = '다크 모드로 전환'

export const THEME_MODES = [THEME_LIGHT, THEME_DARK, THEME_SYSTEM] as const

export type ThemeMode = typeof THEME_MODES[number]
