import { describe, expect, it } from 'vitest'
import { WRITING_BASE_PATH } from '~/constants/writing'
import {
  fileRelativePathToWritingRoute,
  fileRelativePathToWritingSlug,
  resolveWritingRouteCandidates,
  type WritingRouteCandidate,
} from '~/utils/writingRoute'

describe('utils/writingRoute', () => {
  it('normalizes nested route segments and strips numeric prefixes', () => {
    expect(fileRelativePathToWritingRoute('01.guide/02.nuxt/03.routes.md')).toBe(`${WRITING_BASE_PATH}/guide/nuxt/routes`)
  })

  it('normalizes trailing /index to directory route', () => {
    expect(fileRelativePathToWritingSlug('deep/path/index.md')).toBe('deep/path')
    expect(fileRelativePathToWritingRoute('deep/path/index.md')).toBe(`${WRITING_BASE_PATH}/deep/path`)
  })

  it('excludes underscore-prefixed files and directories', () => {
    expect(fileRelativePathToWritingRoute('_draft.md')).toBeNull()
    expect(fileRelativePathToWritingRoute('guide/_private/post.md')).toBeNull()
  })

  it('returns null when slug becomes empty after normalization', () => {
    expect(fileRelativePathToWritingSlug('index.md')).toBeNull()
    expect(fileRelativePathToWritingRoute('index.md')).toBeNull()
  })

  it('resolves duplicate slug collisions deterministically', () => {
    const candidates: WritingRouteCandidate[] = [
      { sourcePath: '/tmp/writing/guide.md', relativePath: 'guide.md' },
      { sourcePath: '/tmp/writing/01.guide.md', relativePath: '01.guide.md' },
      { sourcePath: '/tmp/writing/deep/index.md', relativePath: 'deep/index.md' },
      { sourcePath: '/tmp/writing/_draft.md', relativePath: '_draft.md' },
    ]

    const result = resolveWritingRouteCandidates(candidates)

    expect(result.routes).toEqual([
      `${WRITING_BASE_PATH}/guide`,
      `${WRITING_BASE_PATH}/deep`,
    ])
    expect(result.entries[0]?.sourcePath).toBe('/tmp/writing/01.guide.md')
    expect(result.collisions).toEqual([
      {
        route: `${WRITING_BASE_PATH}/guide`,
        keptSourcePath: '/tmp/writing/01.guide.md',
        skippedSourcePaths: ['/tmp/writing/guide.md'],
      },
    ])
  })

  it('returns the same resolution even when candidate input order changes', () => {
    const orderedCandidates: WritingRouteCandidate[] = [
      { sourcePath: '/tmp/writing/02.alpha.md', relativePath: '02.alpha.md' },
      { sourcePath: '/tmp/writing/alpha.md', relativePath: 'alpha.md' },
      { sourcePath: '/tmp/writing/blog/index.md', relativePath: 'blog/index.md' },
    ]
    const reversedCandidates = [...orderedCandidates].reverse()

    const orderedResult = resolveWritingRouteCandidates(orderedCandidates)
    const reversedResult = resolveWritingRouteCandidates(reversedCandidates)

    expect(reversedResult).toEqual(orderedResult)
  })
})
