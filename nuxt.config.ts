export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: true,
  nitro: {
    preset: 'github-pages',
    prerender: {
      routes: ['/sitemap.xml'],
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://sejinjja.github.io',
    },
  },

  app: {
    head: {
      title: '조세진 | 프런트엔드/웹 개발자',
      htmlAttrs: { lang: 'ko' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '실무에서 통하는 정확함과 구조화된 사고로 문제를 끝까지 해결하는 프런트엔드/웹 개발자 조세진입니다.' },
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
