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
import {
  FEED_ROUTE_PATH,
  PRERENDER_STATIC_ROUTES,
} from './constants/routes'
import {
  WRITING_FEED_AUTO_DISCOVERY_TITLE,
  WRITING_FEED_AUTO_DISCOVERY_TYPE,
} from './constants/writing'
import {
  resolveWritingRouteCandidates,
  type WritingRouteCandidate,
} from './utils/writingRoute'

function collectWritingRouteCandidates(dir: string, root: string): WritingRouteCandidate[] {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))
      .flatMap((entry): WritingRouteCandidate[] => {
        const fullPath = resolve(dir, entry.name)
        if (entry.isDirectory()) {
          return collectWritingRouteCandidates(fullPath, root)
        }
        if (!entry.isFile() || !entry.name.endsWith('.md')) {
          return []
        }
        return [{
          sourcePath: fullPath,
          relativePath: relative(root, fullPath),
        }]
      })
  } catch {
    return []
  }
}

const writingContentDir = resolve(process.cwd(), 'content', 'writing')
const writingRouteResolution = resolveWritingRouteCandidates(
  collectWritingRouteCandidates(writingContentDir, writingContentDir),
)
for (const collision of writingRouteResolution.collisions) {
  console.warn(
    `[writing-route] Duplicate route "${collision.route}" detected. `
    + `Keeping "${collision.keptSourcePath}" and skipping: ${collision.skippedSourcePaths.join(', ')}`,
  )
}
const writingRoutes = writingRouteResolution.routes

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
        {
          rel: 'alternate',
          type: WRITING_FEED_AUTO_DISCOVERY_TYPE,
          title: WRITING_FEED_AUTO_DISCOVERY_TITLE,
          href: FEED_ROUTE_PATH,
        },
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
