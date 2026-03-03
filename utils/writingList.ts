import { WRITING_BASE_PATH } from '~/constants/writing'

export interface WritingListSourceItem {
  path: string
  title?: string
  description?: string
  date?: string
  tags?: string[]
  meta?: {
    description?: string
    date?: string
    tags?: string[]
  }
}

export interface WritingListResponseItem {
  path: string
  title: string
  description: string
  date: string
  tags: string[]
}

function parseDateToTimestamp(dateStr: string): number {
  const timestamp = Date.parse(dateStr)
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp
}

export function normalizeWritingList(items: WritingListSourceItem[]): WritingListResponseItem[] {
  return [...items]
    .map((item) => ({
      path: item.path,
      title: item.title || '',
      description: item.description || item.meta?.description || '',
      date: item.date || item.meta?.date || '',
      tags: item.tags || item.meta?.tags || [],
    }))
    .filter((item) => item.path !== WRITING_BASE_PATH)
    .sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      const dateDiff = parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date)
      if (dateDiff !== 0) {
        return dateDiff
      }
      return b.date.localeCompare(a.date)
    })
}
