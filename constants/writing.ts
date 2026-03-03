export const WRITING_CONTENT_COLLECTION = 'content'

export const WRITING_BASE_PATH = '/writing'
export const WRITING_PATH_LIKE_PATTERN = `${WRITING_BASE_PATH}/%`
export const WRITING_LIST_API_PATH = '/api/writing/list'
export const WRITING_LIST_QUERY_FIELDS = ['path', 'title', 'description', 'date', 'tags', 'meta'] as const

export const WRITING_NOT_FOUND_MESSAGE = 'Post not found'
export const WRITING_LIST_LOAD_FAILED_MESSAGE = 'Failed to load writing list'
export const WRITING_LIST_LOAD_FAILED_STATUS_CODE = 500
