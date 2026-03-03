import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: [
    '.data/**',
    '.nuxt/**',
    '.output/**',
    'dist/**',
    'node_modules/**',
  ],
})
