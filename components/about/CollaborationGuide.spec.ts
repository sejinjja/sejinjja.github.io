import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  ABOUT_COLLABORATION_GUIDE_ITEMS,
  ABOUT_COLLABORATION_GUIDE_TITLE,
} from '~/constants/about'
import CollaborationGuide from './CollaborationGuide.vue'

describe('CollaborationGuide', () => {
  it('renders all collaboration guide lines from constants in order', () => {
    const wrapper = mount(CollaborationGuide, {
      global: {
        stubs: {
          CommonSectionTitle: {
            template: '<h2><slot /></h2>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain(ABOUT_COLLABORATION_GUIDE_TITLE)

    const items = wrapper.findAll('li')
    expect(items).toHaveLength(ABOUT_COLLABORATION_GUIDE_ITEMS.length)
    ABOUT_COLLABORATION_GUIDE_ITEMS.forEach((guide, index) => {
      expect(items[index]?.text()).toContain(guide)
    })
  })
})
