import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  HOME_HERO_DESCRIPTION_LINES,
  HOME_HERO_PRIMARY_CTA_LABEL,
  HOME_HERO_PRIMARY_CTA_TO,
  HOME_HERO_ROLE_LABEL,
  HOME_HERO_SECONDARY_CTA_LABEL,
  HOME_HERO_SECONDARY_CTA_TO,
  HOME_HERO_TITLE,
} from '~/constants/home'
import HeroSection from './HeroSection.vue'

describe('HeroSection', () => {
  it('renders hero copy and CTA links from constants', () => {
    const wrapper = mount(HeroSection, {
      global: {
        stubs: {
          NuxtLink: {
            props: ['to'],
            template: '<a :href="to" data-testid="hero-link"><slot /></a>',
          },
          Icon: {
            template: '<i />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain(HOME_HERO_ROLE_LABEL)
    expect(wrapper.text()).toContain(HOME_HERO_TITLE)
    for (const line of HOME_HERO_DESCRIPTION_LINES) {
      expect(wrapper.text()).toContain(line)
    }

    const links = wrapper.findAll('[data-testid="hero-link"]')
    expect(links).toHaveLength(2)
    expect(links[0]?.text()).toContain(HOME_HERO_PRIMARY_CTA_LABEL)
    expect(links[0]?.attributes('href')).toBe(HOME_HERO_PRIMARY_CTA_TO)
    expect(links[1]?.text()).toContain(HOME_HERO_SECONDARY_CTA_LABEL)
    expect(links[1]?.attributes('href')).toBe(HOME_HERO_SECONDARY_CTA_TO)
  })
})
