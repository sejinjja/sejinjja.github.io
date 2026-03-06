import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  ABOUT_TECH_PREFERENCE_ITEMS,
  ABOUT_TECH_PREFERENCES_TITLE,
} from '~/constants/about'
import TechPreferences from './TechPreferences.vue'

describe('TechPreferences', () => {
  it('does not pass rounded-lg class to content cards', () => {
    const wrapper = mount(TechPreferences, {
      global: {
        stubs: {
          CommonSectionTitle: {
            template: '<h2><slot /></h2>',
          },
          CommonContentCard: {
            template: '<article data-testid="tech-card" :class="$attrs.class"><slot /></article>',
          },
          Icon: {
            template: '<i />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain(ABOUT_TECH_PREFERENCES_TITLE)

    const cards = wrapper.findAll('[data-testid="tech-card"]')
    expect(cards).toHaveLength(ABOUT_TECH_PREFERENCE_ITEMS.length)

    for (const card of cards) {
      expect(card.classes()).not.toContain('rounded-lg')
    }
  })

  it('renders preference titles and details from constants', () => {
    const wrapper = mount(TechPreferences, {
      global: {
        stubs: {
          CommonSectionTitle: {
            template: '<h2><slot /></h2>',
          },
          CommonContentCard: {
            template: '<article data-testid="tech-card"><slot /></article>',
          },
          Icon: {
            template: '<i />',
          },
        },
      },
    })

    ABOUT_TECH_PREFERENCE_ITEMS.forEach((preference) => {
      expect(wrapper.text()).toContain(preference.title)
      preference.details.forEach((detail) => {
        expect(wrapper.text()).toContain(detail)
      })
    })
  })
})
