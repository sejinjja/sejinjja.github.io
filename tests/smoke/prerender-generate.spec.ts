import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT_DIR = process.cwd()
const WRITING_INDEX_OUTPUT_PATH = resolve(ROOT_DIR, '.output/public/writing/index.html')
const WORK_SCHEDULE_MANAGER_OUTPUT_PATH = resolve(ROOT_DIR, '.output/public/work-schedule-manager/index.html')
const FEED_OUTPUT_PATH = resolve(ROOT_DIR, '.output/public/feed.xml')
const SITEMAP_OUTPUT_PATH = resolve(ROOT_DIR, '.output/public/sitemap.xml')
const PRERENDER_TIMEOUT_MS = 240_000

describe('prerender smoke', () => {
  it('generates output artifacts without Nuxt runtime errors', () => {
    try {
      execSync(
        'pnpm generate',
        {
          cwd: ROOT_DIR,
          encoding: 'utf-8',
          env: {
            ...process.env,
            NUXT_TELEMETRY_DISABLED: '1',
          },
          maxBuffer: 20 * 1024 * 1024,
        },
      )
    } catch (error) {
      const { stdout, stderr } = error as {
        stdout?: string
        stderr?: string
      }

      throw new Error([
        'pnpm generate failed during prerender smoke test.',
        `stdout:\n${stdout || '(empty)'}`,
        `stderr:\n${stderr || '(empty)'}`,
      ].join('\n'))
    }

    expect(existsSync(WRITING_INDEX_OUTPUT_PATH)).toBe(true)
    expect(existsSync(WORK_SCHEDULE_MANAGER_OUTPUT_PATH)).toBe(true)
    expect(existsSync(FEED_OUTPUT_PATH)).toBe(true)
    expect(existsSync(SITEMAP_OUTPUT_PATH)).toBe(true)

    const writingPayload = readFileSync(WRITING_INDEX_OUTPUT_PATH, 'utf-8')
    expect(writingPayload).toContain('__NUXT_DATA__')
    expect(writingPayload).not.toContain('500 Server Error')
    expect(writingPayload).not.toContain('Cannot read properties of undefined (reading \'req\')')
    expect(writingPayload).not.toContain('NuxtError')

    const feedPayload = readFileSync(FEED_OUTPUT_PATH, 'utf-8')
    expect(feedPayload).toContain('<item>')
    expect(feedPayload).toContain('<pubDate>')

    const sitemapPayload = readFileSync(SITEMAP_OUTPUT_PATH, 'utf-8')
    expect(sitemapPayload).toContain('/work-schedule-manager')
  }, PRERENDER_TIMEOUT_MS)
})
