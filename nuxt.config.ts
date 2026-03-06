import { readdirSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import {
  DEFAULT_META_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  SEO_DEFAULT_IMAGE_QUALITY,
  SEO_IMAGE_FORMAT_AVIF,
  SEO_IMAGE_FORMAT_WEBP,
  SEO_IMAGE_SCREENS,
  SITE_URL,
} from './constants/seo'
import { PRERENDER_STATIC_ROUTES } from './constants/routes'

function collectWritingRoutes(dir: string, root: string): string[] {
  try {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const fullPath = resolve(dir, entry.name)
      if (entry.isDirectory()) {
        return collectWritingRoutes(fullPath, root)
      }
      if (!entry.isFile() || !entry.name.endsWith('.md')) {
        return []
      }
      const segments = relative(root, fullPath)
        .replaceAll('\\', '/')
        .replace(/\.md$/, '')
        .split('/')
        .map((s) => s.replace(/^\d+\./, ''))
        .filter(Boolean)
      if (segments.some((s) => s.startsWith('_'))) {
        return []
      }
      const slug = segments.join('/').replace(/\/index$/, '')
      return slug ? [`/writing/${slug}`] : []
    })
  } catch {
    return []
  }
}

const writingContentDir = resolve(process.cwd(), 'content', 'writing')
const writingRoutes = collectWritingRoutes(writingContentDir, writingContentDir)

export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: true,
  nitro: {
    preset: 'github-pages',
    prerender: {
      crawlLinks: false,
      routes: [...PRERENDER_STATIC_ROUTES, ...writingRoutes],
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
  ],

  image: {
    format: [SEO_IMAGE_FORMAT_AVIF, SEO_IMAGE_FORMAT_WEBP],
    quality: SEO_DEFAULT_IMAGE_QUALITY,
    screens: SEO_IMAGE_SCREENS,
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },

  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,
    },
  },

  app: {
    head: {
      title: DEFAULT_SEO_TITLE,
      htmlAttrs: { lang: 'ko' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: DEFAULT_META_DESCRIPTION },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css' },
      ],
    },
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark',
        },
      },
    },
  },

  compatibilityDate: '2025-01-01',
})
