import {
  ABOUT_ROUTE_PATH,
  HOME_ROUTE_PATH,
  PROJECTS_ROUTE_PATH,
} from '~/constants/routes'
import { WRITING_BASE_PATH } from '~/constants/writing'
import {
  WORK_SCHEDULE_MANAGER_NAV_LABEL,
  WORK_SCHEDULE_MANAGER_ROUTE_PATH,
} from '~/constants/workScheduleManager'

export interface HeaderNavigationItem {
  to: string
  label: string
}

export const HEADER_BRAND_LABEL = '조세진'
export const HEADER_BRAND_ARIA_LABEL = '홈으로 이동'
export const HEADER_BRAND_TO = HOME_ROUTE_PATH
export const HEADER_MENU_OPEN_LABEL = '메뉴 열기'
export const HEADER_MENU_CLOSE_LABEL = '메뉴 닫기'
export const HEADER_MOBILE_NAV_ARIA_LABEL = '모바일 메뉴'

export const HEADER_NAV_ITEMS: HeaderNavigationItem[] = [
  { to: HOME_ROUTE_PATH, label: '홈' },
  { to: ABOUT_ROUTE_PATH, label: '소개' },
  { to: PROJECTS_ROUTE_PATH, label: '프로젝트' },
  { to: WRITING_BASE_PATH, label: '글' },
  { to: WORK_SCHEDULE_MANAGER_ROUTE_PATH, label: WORK_SCHEDULE_MANAGER_NAV_LABEL },
]
