import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  ABOUT_WORK_APPROACH_ITEMS,
  ABOUT_WORK_APPROACH_TITLE,
} from '~/constants/about'
import WorkApproach from './WorkApproach.vue'

describe('WorkApproach', () => {
  it('renders approach sections and points from constants', () => {
    const wrapper = mount(WorkApproach, {
      global: {
        stubs: {
          CommonSectionTitle: {
            template: '<h2><slot /></h2>',
          },
          Icon: {
            props: ['name'],
            template: '<i data-testid="approach-icon" :data-name="name" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain(ABOUT_WORK_APPROACH_TITLE)

    const headings = wrapper.findAll('h3')
    expect(headings).toHaveLength(ABOUT_WORK_APPROACH_ITEMS.length)
    ABOUT_WORK_APPROACH_ITEMS.forEach((approach, index) => {
      expect(headings[index]?.text()).toBe(approach.title)
      approach.points.forEach((point) => {
        expect(wrapper.text()).toContain(point)
      })
    })

    const icons = wrapper.findAll('[data-testid="approach-icon"]')
    expect(icons).toHaveLength(ABOUT_WORK_APPROACH_ITEMS.length)
    ABOUT_WORK_APPROACH_ITEMS.forEach((approach, index) => {
      expect(icons[index]?.attributes('data-name')).toBe(approach.icon)
    })
  })
})
