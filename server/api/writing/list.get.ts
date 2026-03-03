import {
  WRITING_CONTENT_COLLECTION,
  WRITING_LIST_QUERY_FIELDS,
  WRITING_PATH_LIKE_PATTERN,
} from '~/constants/writing'
import {
  buildWritingListFilterOptionsFromQuery,
  filterWritingList,
  normalizeWritingList,
  type WritingListResponseItem,
  type WritingListSourceItem,
} from '~/utils/writingList'
import { queryCollectionWithEvent } from '~/utils/queryCollectionWithEvent'

export default defineEventHandler(async (event): Promise<WritingListResponseItem[]> => {
  const list = await queryCollectionWithEvent(event, WRITING_CONTENT_COLLECTION)
    .where('path', 'LIKE', WRITING_PATH_LIKE_PATTERN)
    .select(...WRITING_LIST_QUERY_FIELDS)
    .all() as WritingListSourceItem[]

  const normalizedList = normalizeWritingList(list)
  const filters = buildWritingListFilterOptionsFromQuery(getQuery(event))

  return filterWritingList(normalizedList, filters)
})
