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
