import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(CURRENT_DIR, '..')

const NUXT_CONFIG_SOURCE = readFileSync(resolve(ROOT_DIR, 'nuxt.config.ts'), 'utf-8')
const PROSE_IMG_SOURCE = readFileSync(resolve(ROOT_DIR, 'components/content/ProseImg.vue'), 'utf-8')
const PACKAGE_JSON = JSON.parse(readFileSync(resolve(ROOT_DIR, 'package.json'), 'utf-8')) as {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

describe('nuxt image optimization integration', () => {
  it('registers @nuxt/image module and image config in nuxt config', () => {
    expect(NUXT_CONFIG_SOURCE).toContain("'@nuxt/image'")
    expect(NUXT_CONFIG_SOURCE).toContain('image: {')
    expect(NUXT_CONFIG_SOURCE).toContain('SEO_IMAGE_FORMAT_AVIF')
    expect(NUXT_CONFIG_SOURCE).toContain('SEO_IMAGE_FORMAT_WEBP')
    expect(NUXT_CONFIG_SOURCE).toContain('SEO_DEFAULT_IMAGE_QUALITY')
    expect(NUXT_CONFIG_SOURCE).toContain('SEO_IMAGE_SCREENS')
  })

  it('uses NuxtImg for markdown prose images with lazy loading and responsive sizes', () => {
    expect(PROSE_IMG_SOURCE).toContain('<NuxtImg')
    expect(PROSE_IMG_SOURCE).toContain('loading="lazy"')
    expect(PROSE_IMG_SOURCE).toContain('decoding="async"')
    expect(PROSE_IMG_SOURCE).toContain('SEO_PROSE_IMAGE_SIZES')
    expect(PROSE_IMG_SOURCE).toContain('SEO_IMAGE_FORMAT_WEBP')
  })

  it('installs @nuxt/image in package dependencies', () => {
    const installedVersion = PACKAGE_JSON.devDependencies?.['@nuxt/image'] ?? PACKAGE_JSON.dependencies?.['@nuxt/image']
    expect(installedVersion).toBeTruthy()
  })
})
