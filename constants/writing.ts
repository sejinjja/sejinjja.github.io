import {
  SEO_JSON_LD_CONTEXT,
  SEO_JSON_LD_TYPE_BLOG_POSTING,
  SEO_JSON_LD_TYPE_PERSON,
  SITE_OWNER_NAME,
  SITE_URL,
} from '~/constants/seo'

export const WRITING_CONTENT_COLLECTION = 'content'

export const WRITING_BASE_PATH = '/writing'
export const WRITING_PATH_LIKE_PATTERN = `${WRITING_BASE_PATH}/%`
export const WRITING_LIST_API_PATH = '/api/writing/list'
export const WRITING_LIST_QUERY_FIELDS = ['path', 'title', 'description', 'date', 'tags', 'meta'] as const
export const WRITING_LIST_SEARCH_QUERY_PARAM = 'q'
export const WRITING_LIST_TAG_QUERY_PARAM = 'tag'
export const WRITING_LIST_PAGE_QUERY_PARAM = 'page'
export const WRITING_LIST_SORT_QUERY_PARAM = 'sort'
export const WRITING_LIST_PAGE_SIZE_QUERY_PARAM = 'pageSize'
export const WRITING_LIST_ASYNC_DATA_KEY = 'writing:list'
export const WRITING_DETAIL_ASYNC_DATA_KEY_PREFIX = 'writing:meta:'
export const WRITING_LIST_DEFAULT_PAGE = 1
export const WRITING_LIST_DEFAULT_PAGE_SIZE = 10
export const WRITING_LIST_MAX_PAGE_SIZE = 50
export const WRITING_LIST_PAGE_SIZE_OPTIONS = [10, 20, 50] as const
export const WRITING_LIST_SORT_LATEST = 'latest'
export const WRITING_LIST_SORT_OLDEST = 'oldest'
export const WRITING_LIST_SORT_OPTIONS = [WRITING_LIST_SORT_LATEST, WRITING_LIST_SORT_OLDEST] as const
export const WRITING_LIST_DEFAULT_SORT = WRITING_LIST_SORT_LATEST
export const WRITING_LIST_SEARCH_LABEL = '검색어'
export const WRITING_LIST_SEARCH_PLACEHOLDER = '제목, 설명, 태그 검색'
export const WRITING_LIST_SEARCH_BUTTON_LABEL = '검색'
export const WRITING_LIST_FILTER_RESET_BUTTON_LABEL = '필터 초기화'
export const WRITING_LIST_SORT_LABEL = '정렬'
export const WRITING_LIST_SORT_LATEST_LABEL = '최신순'
export const WRITING_LIST_SORT_OLDEST_LABEL = '오래된순'
export const WRITING_LIST_PAGE_SIZE_LABEL = '페이지당 글 수'
export const WRITING_LIST_PAGINATION_NAV_LABEL = '글 페이지네이션'
export const WRITING_LIST_PAGINATION_PREVIOUS_LABEL = '이전'
export const WRITING_LIST_PAGINATION_NEXT_LABEL = '다음'
export const WRITING_LIST_PAGINATION_WINDOW_SIZE = 5
export const WRITING_LIST_EMPTY_MESSAGE = '아직 게시된 글이 없습니다.'
export const WRITING_LIST_EMPTY_FILTERED_MESSAGE = '조건에 맞는 글이 없습니다.'
export const WRITING_LIST_TITLE = '글'
export const WRITING_LIST_SUBTITLE = '실무에서 부딪힌 문제와 해결 과정을 기록합니다.'
export const WRITING_LIST_META_DESCRIPTION = '실무에서 부딪힌 문제, 해결 과정, 개발 인사이트를 기록한 기술 글 목록입니다.'
export const WRITING_LIST_OG_TITLE = `${WRITING_LIST_TITLE} | ${SITE_OWNER_NAME}`
export const WRITING_LIST_ENABLE_FACETED_NOINDEX = false
export const WRITING_DETAIL_BACK_LINK_LABEL = '글 목록으로'
export const WRITING_DETAIL_FALLBACK_TITLE = WRITING_LIST_TITLE
export const WRITING_DETAIL_DEFAULT_DESCRIPTION = '실무에서 부딪힌 문제를 구조적으로 해결한 과정을 기록한 글입니다.'
export const WRITING_DETAIL_JSON_LD_CONTEXT = SEO_JSON_LD_CONTEXT
export const WRITING_DETAIL_JSON_LD_TYPE = SEO_JSON_LD_TYPE_BLOG_POSTING
export const WRITING_DETAIL_JSON_LD_PERSON_TYPE = SEO_JSON_LD_TYPE_PERSON
export const WRITING_DETAIL_JSON_LD_AUTHOR_NAME = SITE_OWNER_NAME
export const WRITING_DETAIL_JSON_LD_AUTHOR_URL = SITE_URL
export const WRITING_DETAIL_JSON_LD_PUBLISHER_NAME = SITE_OWNER_NAME

export const WRITING_NOT_FOUND_MESSAGE = 'Post not found'
export const WRITING_NOT_FOUND_STATUS_CODE = 404
export const WRITING_LIST_LOAD_FAILED_MESSAGE = 'Failed to load writing list'
export const WRITING_LIST_LOAD_FAILED_STATUS_CODE = 500
export const WRITING_LIST_PAGE_OUT_OF_RANGE_MESSAGE = 'Requested writing page does not exist'
export const WRITING_LIST_PAGE_OUT_OF_RANGE_STATUS_CODE = 404
