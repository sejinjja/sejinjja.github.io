import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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

    const cards = wrapper.findAll('[data-testid="tech-card"]')
    expect(cards.length).toBeGreaterThan(0)

    for (const card of cards) {
      expect(card.classes()).not.toContain('rounded-lg')
    }
  })
})
