import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  THEME_ICON_TO_DARK,
  THEME_ICON_TO_LIGHT,
  THEME_LABEL_TO_DARK,
  THEME_LABEL_TO_LIGHT,
} from '~/constants/theme'
import ThemeToggle from './ThemeToggle.vue'

const isDark = ref(false)
const toggleTheme = vi.fn()

vi.mock('~/composables/useTheme', () => ({
  useTheme: () => ({
    isDark,
    toggleTheme,
  }),
}))

describe('ThemeToggle', () => {
  function mountThemeToggle() {
    return mount(ThemeToggle, {
      global: {
        stubs: {
          Icon: {
            props: ['name'],
            template: '<i :data-icon="name" />',
          },
        },
      },
    })
  }

  beforeEach(() => {
    isDark.value = false
    toggleTheme.mockClear()
  })

  it('renders controls to switch to dark mode when current theme is light', () => {
    const wrapper = mountThemeToggle()

    expect(wrapper.get('button').attributes('aria-label')).toBe(THEME_LABEL_TO_DARK)
    expect(wrapper.get('i').attributes('data-icon')).toBe(THEME_ICON_TO_DARK)
  })

  it('renders controls to switch to light mode when current theme is dark', () => {
    isDark.value = true

    const wrapper = mountThemeToggle()

    expect(wrapper.get('button').attributes('aria-label')).toBe(THEME_LABEL_TO_LIGHT)
    expect(wrapper.get('i').attributes('data-icon')).toBe(THEME_ICON_TO_LIGHT)
  })

  it('calls toggleTheme when button is clicked', async () => {
    const wrapper = mountThemeToggle()

    await wrapper.get('button').trigger('click')

    expect(toggleTheme).toHaveBeenCalledTimes(1)
  })
})
