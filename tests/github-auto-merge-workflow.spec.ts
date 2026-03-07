import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(CURRENT_DIR, '..')
const AUTO_MERGE_WORKFLOW_PATH = '.github/workflows/auto-merge.yml'
const AUTO_MERGE_DOC_PATH = 'docs/auto-merge.md'
const AUTO_MERGE_TRIGGER_TYPES = [
  'opened',
  'reopened',
  'synchronize',
  'labeled',
  'ready_for_review',
]

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT_DIR, relativePath), 'utf-8')
}

describe('auto-merge workflow', () => {
  it('creates a dedicated workflow file for pull request auto-merge', () => {
    expect(existsSync(resolve(ROOT_DIR, AUTO_MERGE_WORKFLOW_PATH))).toBe(true)
  })

  it('matches the approved trigger, permission, and eligibility rules', () => {
    const source = readSource(AUTO_MERGE_WORKFLOW_PATH)

    expect(source).toContain('pull_request_target:')
    for (const triggerType of AUTO_MERGE_TRIGGER_TYPES) {
      expect(source).toContain(`- ${triggerType}`)
    }

    expect(source).toContain('AUTO_MERGE_LABEL: automerge')
    expect(source).toContain('contents: write')
    expect(source).toContain('pull-requests: write')
    expect(source).toContain("github.event.pull_request.draft == false")
    expect(source).toContain("PR_AUTHOR: ${{ github.event.pull_request.user.login }}")
    expect(source).toContain("PR_LABELS: ${{ join(github.event.pull_request.labels.*.name, ',') }}")
    expect(source).toContain('"$PR_AUTHOR" == "dependabot[bot]"')
    expect(source).toContain('",$PR_LABELS," == *",$AUTO_MERGE_LABEL,"*')
    expect(source).toContain("steps.eligibility.outputs.should_enable == 'true'")
  })

  it('uses GitHub CLI with workflow-managed environment variables', () => {
    const source = readSource(AUTO_MERGE_WORKFLOW_PATH)

    expect(source).toContain('GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}')
    expect(source).toContain('GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}')
    expect(source).toContain('PR_URL: ${{ github.event.pull_request.html_url }}')
    expect(source).toContain('gh pr view "$PR_URL"')
    expect(source).toContain('gh pr merge --auto --squash "$PR_URL"')
  })
})

describe('auto-merge documentation', () => {
  it('documents the repository setting and the test PR verification flow', () => {
    const source = readSource(AUTO_MERGE_DOC_PATH)

    expect(source).toContain('Allow auto-merge')
    expect(source).toContain('Settings > General')
    expect(source).toContain('automerge')
    expect(source).toContain('default branch')
    expect(source).toContain('test branch')
    expect(source).toContain('Auto-merge enabled')
  })
})
