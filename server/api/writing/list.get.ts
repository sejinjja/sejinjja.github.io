import {
  WRITING_CONTENT_COLLECTION,
  WRITING_LIST_PAGE_OUT_OF_RANGE_MESSAGE,
  WRITING_LIST_PAGE_OUT_OF_RANGE_STATUS_CODE,
  WRITING_LIST_QUERY_FIELDS,
  WRITING_PATH_LIKE_PATTERN,
} from '~/constants/writing'
import {
  buildWritingListApiResponse,
  buildWritingListQueryOptionsFromQuery,
  normalizeWritingList,
  type WritingListApiResponse,
  type WritingListSourceItem,
} from '~/utils/writingList'
import { queryCollectionWithEvent } from '~/utils/queryCollectionWithEvent'

function validateWritingListQuery(query: unknown): Record<string, unknown> {
  if (!query || typeof query !== 'object' || Array.isArray(query)) {
    return {}
  }

  return query as Record<string, unknown>
}

export default defineEventHandler(async (event): Promise<WritingListApiResponse> => {
  const query = await getValidatedQuery(event, validateWritingListQuery)
  const list = await queryCollectionWithEvent(event, WRITING_CONTENT_COLLECTION)
    .where('path', 'LIKE', WRITING_PATH_LIKE_PATTERN)
    .select(...WRITING_LIST_QUERY_FIELDS)
    .all() as WritingListSourceItem[]

  const normalizedList = normalizeWritingList(list)
  const normalizedQuery = buildWritingListQueryOptionsFromQuery(query)
  const response = buildWritingListApiResponse(normalizedList, normalizedQuery)

  if (response.isPageOutOfRange) {
    throw createError({
      statusCode: WRITING_LIST_PAGE_OUT_OF_RANGE_STATUS_CODE,
      statusMessage: WRITING_LIST_PAGE_OUT_OF_RANGE_MESSAGE,
      data: response.pagination,
    })
  }

  return {
    items: response.items,
    pagination: response.pagination,
  }
})
