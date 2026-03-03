import {
  WRITING_BASE_PATH,
  WRITING_CONTENT_COLLECTION,
  WRITING_NOT_FOUND_MESSAGE,
} from '~/constants/writing'
import { queryCollectionWithEvent } from '~/utils/queryCollectionWithEvent'

interface WritingDoc {
  path: string
  title?: string
  description?: string
  date?: string
  tags?: string[]
  body?: unknown
  meta?: {
    description?: string
    date?: string
    tags?: string[]
  }
}

export default defineEventHandler(async (event): Promise<WritingDoc> => {
  const slugParam = getRouterParam(event, 'slug')
  const normalizedSlug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam

  if (!normalizedSlug) {
    throw createError({ statusCode: 404, statusMessage: WRITING_NOT_FOUND_MESSAGE })
  }

  const path = `${WRITING_BASE_PATH}/${normalizedSlug}`
  const article = await queryCollectionWithEvent(event, WRITING_CONTENT_COLLECTION).path(path).first() as WritingDoc | null

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: WRITING_NOT_FOUND_MESSAGE })
  }

  return article
})
