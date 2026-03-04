import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(CURRENT_DIR, '..')

const LEGACY_PATHS = [
  'build',
  'config',
  'src',
  '.babelrc',
  '.postcssrc.js',
  'test/build-config.test.js',
]

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT_DIR, relativePath), 'utf-8')
}

describe('dependency hygiene', () => {
  it('keeps runtime scripts aligned with Nuxt flow', () => {
    const packageJson = JSON.parse(readSource('package.json')) as {
      scripts: Record<string, string>
    }

    expect(packageJson.scripts.build).toBe('nuxt build')
    expect(packageJson.scripts.dev).toBe('nuxt dev')
    expect(packageJson.scripts.test).toBe('pnpm test:unit')
  })

  it('does not declare legacy vue-router direct dependency', () => {
    const packageJson = JSON.parse(readSource('package.json')) as {
      dependencies: Record<string, string>
    }

    expect(packageJson.dependencies['vue-router']).toBeUndefined()
  })

  it('removes Vue CLI legacy directories and config files', () => {
    for (const relativePath of LEGACY_PATHS) {
      expect(existsSync(resolve(ROOT_DIR, relativePath))).toBe(false)
    }
  })

  it('does not keep legacy vue-router v3 in lockfile', () => {
    const lockFile = readSource('pnpm-lock.yaml')

    expect(lockFile).not.toContain('vue-router@3.')
  })
})
