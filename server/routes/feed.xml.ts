/// <reference types="node" />
import { resolve } from 'node:path'
import { FEED_ROUTE_PATH } from '~/constants/routes'
import { SITE_URL } from '~/constants/seo'
import {
  WRITING_FEED_CHANNEL_DESCRIPTION,
  WRITING_FEED_CHANNEL_TITLE,
} from '~/constants/writing'
import {
  escapeXml,
  getWritingContentEntries,
  normalizeSiteUrl,
  parseDateToUtc,
} from '~/server/utils/writingContent'

interface FeedItem {
  title: string
  description: string
  link: string
  pubDate: string
  guid: string
  categories: string[]
}

function toDateTimestamp(date?: string): number {
  if (!date) {
    return 0
  }

  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(config.public.siteUrl || SITE_URL)
  const writingRoot = resolve(process.cwd(), 'content', 'writing')
  const buildDate = new Date()

  const entries = await getWritingContentEntries(writingRoot)
  const items: FeedItem[] = entries
    .filter(({ meta }) => Boolean(meta.title))
    .sort((a, b) => toDateTimestamp(b.meta.date) - toDateTimestamp(a.meta.date))
    .map(({ route, meta }) => {
      const title = meta.title as string
      const link = `${siteUrl}${route}`

      return {
        title,
        description: meta.description ?? '',
        link,
        pubDate: parseDateToUtc(meta.date, buildDate),
        guid: link,
        categories: meta.tags,
      }
    })

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(WRITING_FEED_CHANNEL_TITLE)}</title>`,
    `<link>${escapeXml(siteUrl)}</link>`,
    `<description>${escapeXml(WRITING_FEED_CHANNEL_DESCRIPTION)}</description>`,
    '<language>ko</language>',
    `<lastBuildDate>${buildDate.toUTCString()}</lastBuildDate>`,
    `<atom:link href="${escapeXml(`${siteUrl}${FEED_ROUTE_PATH}`)}" rel="self" type="application/rss+xml"/>`,
    ...items.map(({ title, description, link, pubDate, guid, categories }) => [
      '<item>',
      `<title>${escapeXml(title)}</title>`,
      `<link>${escapeXml(link)}</link>`,
      description ? `<description>${escapeXml(description)}</description>` : '',
      `<pubDate>${pubDate}</pubDate>`,
      `<guid isPermaLink="true">${escapeXml(guid)}</guid>`,
      ...categories.map((category) => `<category>${escapeXml(category)}</category>`),
      '</item>',
    ].filter(Boolean).join('')),
    '</channel>',
    '</rss>',
  ].join('')

  setHeader(event, 'content-type', 'application/rss+xml; charset=UTF-8')
  return xml
})
