import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { QUICK_NAV_ITEMS } from '~/constants/home'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const SOURCE = readFileSync(resolve(CURRENT_DIR, 'QuickNav.vue'), 'utf-8')

describe('QuickNav.vue', () => {
  it('imports QUICK_NAV_ITEMS from constants/home and removes hardcoded navItems', () => {
    expect(SOURCE).toContain("from '~/constants/home'")
    expect(SOURCE).toContain('QUICK_NAV_ITEMS')
    expect(SOURCE).not.toContain("const navItems")
    expect(SOURCE).not.toContain("to: '/about'")
    expect(SOURCE).not.toContain("to: '/projects'")
    expect(SOURCE).not.toContain("to: '/writing'")
  })

  it('QUICK_NAV_ITEMS includes all required navigation destinations', () => {
    const destinations = QUICK_NAV_ITEMS.map((item) => item.to)
    expect(destinations).toContain('/about')
    expect(destinations).toContain('/projects')
    expect(destinations).toContain('/writing')
    expect(destinations).toContain('/work-schedule-manager')
  })

  it('QUICK_NAV_ITEMS entries each have required fields', () => {
    for (const item of QUICK_NAV_ITEMS) {
      expect(item.to).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.label).toBeTruthy()
      expect(item.description).toBeTruthy()
    }
  })
})
