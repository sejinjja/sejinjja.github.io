import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(CURRENT_DIR, '..')

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT_DIR, relativePath), 'utf-8')
}

const HOME_PAGE_SOURCE = readSource('pages/index.vue')
const ABOUT_PAGE_SOURCE = readSource('pages/about.vue')
const PROJECTS_PAGE_SOURCE = readSource('pages/projects.vue')

describe('page content constants', () => {
  it('uses home constants for homepage seo metadata', () => {
    expect(HOME_PAGE_SOURCE).toContain("from '~/constants/home'")
    expect(HOME_PAGE_SOURCE).toContain('HOME_PAGE_TITLE')
    expect(HOME_PAGE_SOURCE).toContain('HOME_PAGE_META_DESCRIPTION')
    expect(HOME_PAGE_SOURCE).toContain('HOME_PAGE_OG_TITLE')
    expect(HOME_PAGE_SOURCE).not.toContain("title: '홈'")
  })

  it('uses about constants for title, seo metadata, and strengths content', () => {
    expect(ABOUT_PAGE_SOURCE).toContain("from '~/constants/about'")
    expect(ABOUT_PAGE_SOURCE).toContain('ABOUT_PAGE_TITLE')
    expect(ABOUT_PAGE_SOURCE).toContain('ABOUT_PAGE_META_DESCRIPTION')
    expect(ABOUT_PAGE_SOURCE).toContain('ABOUT_PAGE_OG_TITLE')
    expect(ABOUT_PAGE_SOURCE).toContain('ABOUT_PAGE_STRENGTHS')
    expect(ABOUT_PAGE_SOURCE).not.toContain("title: '소개'")
    expect(ABOUT_PAGE_SOURCE).not.toContain("'정의와 구현의 정합성'")
  })

  it('uses projects constants for page copy and project item data', () => {
    expect(PROJECTS_PAGE_SOURCE).toContain("from '~/constants/projects'")
    expect(PROJECTS_PAGE_SOURCE).toContain('PROJECTS_PAGE_TITLE')
    expect(PROJECTS_PAGE_SOURCE).toContain('PROJECTS_PAGE_SUBTITLE')
    expect(PROJECTS_PAGE_SOURCE).toContain('PROJECTS_PAGE_META_DESCRIPTION')
    expect(PROJECTS_PAGE_SOURCE).toContain('PROJECTS_PAGE_OG_TITLE')
    expect(PROJECTS_PAGE_SOURCE).toContain('PROJECTS_ITEMS')
    expect(PROJECTS_PAGE_SOURCE).not.toContain("'ls-diff'")
  })
})
