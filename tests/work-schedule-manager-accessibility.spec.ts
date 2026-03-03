import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(CURRENT_DIR, '..')
const WORK_SCHEDULE_SOURCE = readFileSync(resolve(ROOT_DIR, 'public/tools/work-schedule-manager.html'), 'utf-8')

describe('work schedule manager accessibility', () => {
  it('uses accessible contrast color classes for action buttons', () => {
    expect(WORK_SCHEDULE_SOURCE).toContain('bg-blue-700 text-white')
    expect(WORK_SCHEDULE_SOURCE).toContain('bg-green-700 text-white')
    expect(WORK_SCHEDULE_SOURCE).toContain('bg-red-700 text-white')
    expect(WORK_SCHEDULE_SOURCE).toContain('bg-amber-800 text-white')
  })

  it('uses a keyboard-operable upload button with linked file input', () => {
    expect(WORK_SCHEDULE_SOURCE).toMatch(/<button[\s\S]*@click="triggerUpload"[\s\S]*엑셀 업로드[\s\S]*<\/button>/)
    expect(WORK_SCHEDULE_SOURCE).toContain('aria-controls="uploadExcel"')
    expect(WORK_SCHEDULE_SOURCE).toContain('ref="uploadInput"')
    expect(WORK_SCHEDULE_SOURCE).toContain('id="uploadExcel"')
    expect(WORK_SCHEDULE_SOURCE).toContain('const triggerUpload = () => {')
  })

  it('defines and applies focus-visible styles on interactive controls', () => {
    const focusRingMatches = WORK_SCHEDULE_SOURCE.match(/focus-ring/g) ?? []

    expect(WORK_SCHEDULE_SOURCE).toContain('.focus-ring:focus-visible')
    expect(focusRingMatches.length).toBeGreaterThanOrEqual(7)
  })
})
