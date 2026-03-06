import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  HOME_KEYWORD_ITEMS,
  HOME_KEYWORDS_SECTION_SUBTITLE,
  HOME_KEYWORDS_SECTION_TITLE,
} from '~/constants/home'
import KeywordsSection from './KeywordsSection.vue'

describe('KeywordsSection', () => {
  it('renders all keyword cards from constants', () => {
    const wrapper = mount(KeywordsSection, {
      global: {
        stubs: {
          CommonSectionTitle: {
            template: '<header><h2><slot /></h2><p><slot name="subtitle" /></p></header>',
          },
          CommonIconFeatureCard: {
            props: ['icon', 'title', 'description', 'interactive'],
            template: [
              '<article data-testid="keyword-card" :data-icon="icon" :data-interactive="interactive">',
              '<h3>{{ title }}</h3>',
              '<p>{{ description }}</p>',
              '</article>',
            ].join(''),
          },
        },
      },
    })

    expect(wrapper.text()).toContain(HOME_KEYWORDS_SECTION_TITLE)
    expect(wrapper.text()).toContain(HOME_KEYWORDS_SECTION_SUBTITLE)

    const cards = wrapper.findAll('[data-testid="keyword-card"]')
    expect(cards).toHaveLength(HOME_KEYWORD_ITEMS.length)
    HOME_KEYWORD_ITEMS.forEach((item, index) => {
      const card = cards[index]
      expect(card?.attributes('data-icon')).toBe(item.icon)
      expect(card?.attributes('data-interactive')).toBe('true')
      expect(card?.text()).toContain(item.title)
      expect(card?.text()).toContain(item.description)
    })
  })
})
