export const SEO_STATE_KEY = 'seo:state'

export const SITE_OWNER_NAME = '조세진'
export const SITE_URL = 'https://sejinjja.github.io'

export const DEFAULT_SEO_TITLE = `${SITE_OWNER_NAME} | 프런트엔드/웹 개발자`
export const DEFAULT_META_TITLE = DEFAULT_SEO_TITLE
export const DEFAULT_META_DESCRIPTION = '실무에서 통하는 정확함과 구조화된 사고로 문제를 끝까지 해결하는 프런트엔드/웹 개발자 조세진입니다.'
export const DEFAULT_META_KEYWORDS = [] as const
export const DEFAULT_CANONICAL_PATH = ''
export const DEFAULT_META_IMAGE = ''
export const DEFAULT_OG_LOCALE = 'ko_KR'
export const DEFAULT_TWITTER_CARD = 'summary_large_image'

export const SEO_JSON_LD_CONTEXT = 'https://schema.org'
export const SEO_JSON_LD_TYPE_BLOG_POSTING = 'BlogPosting'
export const SEO_JSON_LD_TYPE_PERSON = 'Person'

export const SEO_KEYWORD_DELIMITER = ','
export const SEO_ROBOTS_INDEX_FOLLOW = 'index,follow'
export const SEO_ROBOTS_NOINDEX_FOLLOW = 'noindex,follow'
export const DEFAULT_ROBOTS = SEO_ROBOTS_INDEX_FOLLOW

export const SEO_TYPE_WEBSITE = 'website'
export const SEO_TYPE_ARTICLE = 'article'
export const SEO_TYPES = [SEO_TYPE_WEBSITE, SEO_TYPE_ARTICLE] as const

export const SEO_IMAGE_FORMAT_AVIF = 'avif'
export const SEO_IMAGE_FORMAT_WEBP = 'webp'
export const SEO_DEFAULT_IMAGE_QUALITY = 80
export const SEO_IMAGE_SCREENS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
} as const
export const SEO_PROSE_IMAGE_SIZES = 'sm:100vw md:768px lg:896px'

export type SeoType = typeof SEO_TYPES[number]
