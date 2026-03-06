/// <reference types="node" />
import { resolve } from 'node:path'
import { STATIC_SITE_ROUTES } from '~/constants/routes'
import { SITE_URL } from '~/constants/seo'
import {
  escapeXml,
  getWritingContentEntries,
  normalizeSiteUrl,
  parseDateToIso,
  type RouteEntry,
} from '~/server/utils/writingContent'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(config.public.siteUrl || SITE_URL)
  const writingRoot = resolve(process.cwd(), 'content', 'writing')

  const staticEntries: RouteEntry[] = STATIC_SITE_ROUTES.map((route) => ({
    loc: `${siteUrl}${route}`,
  }))

  const writingEntries: RouteEntry[] = (await getWritingContentEntries(writingRoot)).map(({ route, meta }) => ({
    loc: `${siteUrl}${route}`,
    lastmod: parseDateToIso(meta.date),
  }))

  const allEntries = [...staticEntries, ...writingEntries]

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allEntries.map(({ loc, lastmod }) =>
      [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        '  </url>',
      ].filter(Boolean).join('\n'),
    ),
    '</urlset>',
  ].join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=UTF-8')
  return xml
})
