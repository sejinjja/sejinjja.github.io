import { WRITING_BASE_PATH } from '../constants/writing'

export interface WritingRouteCandidate {
  sourcePath: string
  relativePath: string
}

export interface ResolvedWritingRoute {
  sourcePath: string
  relativePath: string
  slug: string
  route: string
}

export interface WritingRouteCollision {
  route: string
  keptSourcePath: string
  skippedSourcePaths: string[]
}

export interface ResolveWritingRouteCandidatesResult {
  entries: ResolvedWritingRoute[]
  routes: string[]
  collisions: WritingRouteCollision[]
}

function normalizePathSeparators(path: string): string {
  return path.replaceAll('\\', '/')
}

function sanitizeSegment(segment: string): string {
  return segment.replace(/^\d+\./, '')
}

export function fileRelativePathToWritingSlug(relativePath: string): string | null {
  const normalizedRelativePath = normalizePathSeparators(relativePath).replace(/\.md$/i, '')
  const segments = normalizedRelativePath
    .split('/')
    .map((segment) => sanitizeSegment(segment.trim()))
    .filter(Boolean)

  if (segments.length === 0) {
    return null
  }

  if (segments.some((segment) => segment.startsWith('_'))) {
    return null
  }

  const slugSegments = [...segments]
  if (slugSegments.at(-1) === 'index') {
    slugSegments.pop()
  }

  const slug = slugSegments.join('/')
  return slug || null
}

export function fileRelativePathToWritingRoute(relativePath: string): string | null {
  const slug = fileRelativePathToWritingSlug(relativePath)
  if (!slug) {
    return null
  }
  return `${WRITING_BASE_PATH}/${slug}`
}

function compareCandidates(a: WritingRouteCandidate, b: WritingRouteCandidate): number {
  const byRelativePath = normalizePathSeparators(a.relativePath).localeCompare(normalizePathSeparators(b.relativePath))
  if (byRelativePath !== 0) {
    return byRelativePath
  }
  return normalizePathSeparators(a.sourcePath).localeCompare(normalizePathSeparators(b.sourcePath))
}

export function resolveWritingRouteCandidates(
  candidates: readonly WritingRouteCandidate[],
): ResolveWritingRouteCandidatesResult {
  const sortedCandidates = [...candidates].sort(compareCandidates)
  const entries: ResolvedWritingRoute[] = []
  const entryByRoute = new Map<string, ResolvedWritingRoute>()
  const collisionsByRoute = new Map<string, WritingRouteCollision>()

  for (const candidate of sortedCandidates) {
    const route = fileRelativePathToWritingRoute(candidate.relativePath)
    if (!route) {
      continue
    }

    const existingEntry = entryByRoute.get(route)
    if (existingEntry) {
      const collision = collisionsByRoute.get(route)
      if (collision) {
        collision.skippedSourcePaths.push(candidate.sourcePath)
      } else {
        collisionsByRoute.set(route, {
          route,
          keptSourcePath: existingEntry.sourcePath,
          skippedSourcePaths: [candidate.sourcePath],
        })
      }
      continue
    }

    const slug = route.slice(`${WRITING_BASE_PATH}/`.length)
    const resolvedEntry: ResolvedWritingRoute = {
      sourcePath: candidate.sourcePath,
      relativePath: candidate.relativePath,
      slug,
      route,
    }
    entries.push(resolvedEntry)
    entryByRoute.set(route, resolvedEntry)
  }

  return {
    entries,
    routes: entries.map((entry) => entry.route),
    collisions: [...collisionsByRoute.values()],
  }
}
