import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const ROOT_DIR = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '#imports': fileURLToPath(new URL('./tests/mocks/nuxt-imports.ts', import.meta.url)),
      '~': ROOT_DIR,
      '@': ROOT_DIR,
    },
  },
  test: {
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
  },
})
