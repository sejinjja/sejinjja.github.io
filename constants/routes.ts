import { WRITING_BASE_PATH } from './writing'
import { WORK_SCHEDULE_MANAGER_ROUTE_PATH } from './workScheduleManager'

export const HOME_ROUTE_PATH = '/'
export const ABOUT_ROUTE_PATH = '/about'
export const PROJECTS_ROUTE_PATH = '/projects'
export const FEED_ROUTE_PATH = '/feed.xml'
export const SITEMAP_ROUTE_PATH = '/sitemap.xml'

export const STATIC_SITE_ROUTES = [
  HOME_ROUTE_PATH,
  ABOUT_ROUTE_PATH,
  PROJECTS_ROUTE_PATH,
  WRITING_BASE_PATH,
  WORK_SCHEDULE_MANAGER_ROUTE_PATH,
] as const

export const PRERENDER_STATIC_ROUTES = [
  ...STATIC_SITE_ROUTES,
  SITEMAP_ROUTE_PATH,
  FEED_ROUTE_PATH,
] as const
