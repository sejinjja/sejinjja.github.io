import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import TheHeader from './TheHeader.vue'
import {
  HEADER_MENU_OPEN_LABEL,
  HEADER_NAV_ITEMS,
} from '~/constants/navigation'
import { WORK_SCHEDULE_MANAGER_ROUTE_PATH } from '~/constants/workScheduleManager'

const routePath = ref('/')
const isMenuOpen = ref(false)
const toggleMenu = vi.fn(() => {
  isMenuOpen.value = !isMenuOpen.value
})
const closeMenu = vi.fn(() => {
  isMenuOpen.value = false
})

vi.mock('#imports', () => ({
  useRoute: () => ({
    get fullPath() {
      return routePath.value
    },
  }),
}))

vi.mock('~/composables/useNavigation', () => ({
  useNavigation: () => ({
    isMenuOpen,
    toggleMenu,
    closeMenu,
  }),
}))

describe('TheHeader', () => {
  function mountHeader() {
    return mount(TheHeader, {
      global: {
        stubs: {
          NuxtLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>',
          },
          Icon: {
            props: ['name'],
            template: '<i :data-icon="name" />',
          },
          CommonThemeToggle: {
            template: '<button type="button">theme</button>',
          },
        },
      },
    })
  }

  beforeEach(() => {
    routePath.value = '/'
    isMenuOpen.value = false
    toggleMenu.mockClear()
    closeMenu.mockClear()
  })

  it('closes mobile menu on global escape keydown when open', async () => {
    isMenuOpen.value = true
    const wrapper = mountHeader()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(closeMenu).toHaveBeenCalledTimes(1)
    expect(isMenuOpen.value).toBe(false)

    wrapper.unmount()
  })

  it('does not close mobile menu on non-escape keydown', async () => {
    isMenuOpen.value = true
    const wrapper = mountHeader()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await nextTick()

    expect(closeMenu).not.toHaveBeenCalled()
    expect(isMenuOpen.value).toBe(true)

    wrapper.unmount()
  })

  it('removes global keydown listener on unmount', async () => {
    isMenuOpen.value = true
    const wrapper = mountHeader()

    wrapper.unmount()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(closeMenu).not.toHaveBeenCalled()
  })

  it('renders navigation items from header constants including work schedule manager route', () => {
    const wrapper = mountHeader()

    for (const item of HEADER_NAV_ITEMS) {
      expect(wrapper.findAll(`a[href="${item.to}"]`).length).toBeGreaterThan(0)
    }

    expect(wrapper.find(`a[href="${WORK_SCHEDULE_MANAGER_ROUTE_PATH}"]`).text()).toBeTruthy()
  })

  it('uses menu aria labels from constants', () => {
    const wrapper = mountHeader()
    const menuButton = wrapper.find('button[aria-controls="mobile-nav"]')

    expect(menuButton.attributes('aria-label')).toBe(HEADER_MENU_OPEN_LABEL)
  })
})
