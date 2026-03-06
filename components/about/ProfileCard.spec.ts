import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  ABOUT_PROFILE_AVATAR_ICON,
  ABOUT_PROFILE_INFO_ITEMS,
  ABOUT_PROFILE_NAME,
  ABOUT_PROFILE_ROLE,
} from '~/constants/about'
import ProfileCard from './ProfileCard.vue'

describe('ProfileCard', () => {
  it('renders profile identity and info list from constants', () => {
    const wrapper = mount(ProfileCard, {
      global: {
        stubs: {
          Icon: {
            props: ['name'],
            template: '<i data-testid="icon" :data-name="name" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain(ABOUT_PROFILE_NAME)
    expect(wrapper.text()).toContain(ABOUT_PROFILE_ROLE)

    const icons = wrapper.findAll('[data-testid="icon"]')
    expect(icons[0]?.attributes('data-name')).toBe(ABOUT_PROFILE_AVATAR_ICON)

    const infoItems = wrapper.findAll('ul li')
    expect(infoItems).toHaveLength(ABOUT_PROFILE_INFO_ITEMS.length)
    ABOUT_PROFILE_INFO_ITEMS.forEach((item, index) => {
      const infoItem = infoItems[index]
      expect(infoItem?.text()).toContain(item.text)
      expect(infoItem?.find('[data-testid="icon"]').attributes('data-name')).toBe(item.icon)
    })
  })
})
