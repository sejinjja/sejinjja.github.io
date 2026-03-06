import { DEFAULT_META_DESCRIPTION, DEFAULT_SEO_TITLE } from '~/constants/seo'
import { ABOUT_ROUTE_PATH, PROJECTS_ROUTE_PATH } from '~/constants/routes'
import { WRITING_BASE_PATH } from '~/constants/writing'
import {
  WORK_SCHEDULE_MANAGER_NAV_LABEL,
  WORK_SCHEDULE_MANAGER_ROUTE_PATH,
} from '~/constants/workScheduleManager'

export const HOME_PAGE_TITLE = '홈'
export const HOME_PAGE_META_DESCRIPTION = DEFAULT_META_DESCRIPTION
export const HOME_PAGE_OG_TITLE = DEFAULT_SEO_TITLE

export const HOME_HERO_ROLE_LABEL = 'Frontend / Web Developer'
export const HOME_HERO_TITLE = '조세진'
export const HOME_HERO_DESCRIPTION_LINES = [
  '실무에서 통하는 정확함과 구조화된 사고로',
  '문제를 끝까지 해결하는 프런트엔드/웹 개발자.',
] as const
export const HOME_HERO_PRIMARY_CTA_TO = ABOUT_ROUTE_PATH
export const HOME_HERO_PRIMARY_CTA_LABEL = '더 알아보기'
export const HOME_HERO_SECONDARY_CTA_TO = PROJECTS_ROUTE_PATH
export const HOME_HERO_SECONDARY_CTA_LABEL = '프로젝트 보기'

export const HOME_KEYWORDS_SECTION_TITLE = '핵심 키워드'
export const HOME_KEYWORDS_SECTION_SUBTITLE = '제가 일하는 방식을 정의하는 네 가지 가치입니다.'

export interface HomeKeywordItem {
  title: string
  icon: string
  description: string
}

export const HOME_KEYWORD_ITEMS: HomeKeywordItem[] = [
  {
    title: '정확성 / 일관성',
    icon: 'heroicons:check-badge',
    description: '경계 조건, 실패 조건, 검증 기준이 흐려지는 것을 싫어하고 "정의 → 구현 → 검증"의 정합성을 중요하게 봅니다.',
  },
  {
    title: '구조화 / 재사용',
    icon: 'heroicons:cube-transparent',
    description: '문제를 분해하고 재사용 가능한 형태로 정리하는 성향이 강합니다. 요구사항 이해 → 해결 전략 → 구현.',
  },
  {
    title: '실전 지향',
    icon: 'heroicons:rocket-launch',
    description: '"되긴 하는 코드"보다 프로덕션에서 안전하게 굴러가는 구조를 선호합니다.',
  },
  {
    title: '학습의 목적성',
    icon: 'heroicons:light-bulb',
    description: '단순 지식 축적보다, 당장 쓰일 수 있는 형태(문서/가이드/CLI/템플릿)로 남기려 합니다.',
  },
]

export const QUICK_NAV_ABOUT_ICON = 'heroicons:user'
export const QUICK_NAV_ABOUT_LABEL = '소개'
export const QUICK_NAV_ABOUT_DESCRIPTION = '일하는 방식, 기술 성향, 함께 일할 때 잘 맞는 방식을 소개합니다.'

export const QUICK_NAV_PROJECTS_ICON = 'heroicons:code-bracket'
export const QUICK_NAV_PROJECTS_LABEL = '프로젝트'
export const QUICK_NAV_PROJECTS_DESCRIPTION = '직접 만든 도구와 서비스를 확인할 수 있습니다.'

export const QUICK_NAV_WRITING_ICON = 'heroicons:pencil-square'
export const QUICK_NAV_WRITING_LABEL = '글'
export const QUICK_NAV_WRITING_DESCRIPTION = '기술 글과 개발 경험을 기록합니다.'

export const QUICK_NAV_WSM_ICON = 'heroicons:calendar-days'
export const QUICK_NAV_WSM_LABEL = WORK_SCHEDULE_MANAGER_NAV_LABEL
export const QUICK_NAV_WSM_DESCRIPTION = '근무표 입력, 규칙 검증, 엑셀 입출력을 지원합니다.'

export const QUICK_NAV_ITEMS = [
  {
    to: ABOUT_ROUTE_PATH,
    icon: QUICK_NAV_ABOUT_ICON,
    label: QUICK_NAV_ABOUT_LABEL,
    description: QUICK_NAV_ABOUT_DESCRIPTION,
  },
  {
    to: PROJECTS_ROUTE_PATH,
    icon: QUICK_NAV_PROJECTS_ICON,
    label: QUICK_NAV_PROJECTS_LABEL,
    description: QUICK_NAV_PROJECTS_DESCRIPTION,
  },
  {
    to: WRITING_BASE_PATH,
    icon: QUICK_NAV_WRITING_ICON,
    label: QUICK_NAV_WRITING_LABEL,
    description: QUICK_NAV_WRITING_DESCRIPTION,
  },
  {
    to: WORK_SCHEDULE_MANAGER_ROUTE_PATH,
    icon: QUICK_NAV_WSM_ICON,
    label: QUICK_NAV_WSM_LABEL,
    description: QUICK_NAV_WSM_DESCRIPTION,
  },
] as const
