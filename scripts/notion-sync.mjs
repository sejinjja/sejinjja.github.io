import { createHash } from 'node:crypto'
import { cp, mkdtemp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

const SLUG_PATTERN = /^[a-z0-9-]+$/
const IMAGE_LINK_PATTERN = /!\[[^\]]*]\((https?:\/\/[^\s)]+)(?:\s+"[^"]*")?\)/g

const SUPPORTED_IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.bmp',
  '.avif',
])

const CONTENT_SUBDIR = ['content', 'writing']
const IMAGE_SUBDIR = ['public', 'notion-images']
const DEFAULT_PROPERTY_NAMES = Object.freeze({
  title: 'title',
  slug: 'slug',
  description: 'description',
  date: 'date',
  tags: 'tags',
  published: 'published',
})

function getEnvOrThrow(name) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`${name} is required`)
  }
  return value
}

function getNotionTokenOrThrow() {
  const token = process.env.NOTION_TOKEN?.trim()
  if (token) {
    return token
  }

  const apiKey = process.env.NOTION_API_KEY?.trim()
  if (apiKey) {
    return apiKey
  }

  throw new Error('NOTION_TOKEN (or NOTION_API_KEY) is required')
}

function getEnvOrDefault(name, fallback) {
  const value = process.env[name]?.trim()
  return value || fallback
}

function readPropertyNames() {
  return {
    title: getEnvOrDefault('NOTION_TITLE_PROPERTY', DEFAULT_PROPERTY_NAMES.title),
    slug: getEnvOrDefault('NOTION_SLUG_PROPERTY', DEFAULT_PROPERTY_NAMES.slug),
    description: getEnvOrDefault('NOTION_DESCRIPTION_PROPERTY', DEFAULT_PROPERTY_NAMES.description),
    date: getEnvOrDefault('NOTION_DATE_PROPERTY', DEFAULT_PROPERTY_NAMES.date),
    tags: getEnvOrDefault('NOTION_TAGS_PROPERTY', DEFAULT_PROPERTY_NAMES.tags),
    published: getEnvOrDefault('NOTION_PUBLISHED_PROPERTY', DEFAULT_PROPERTY_NAMES.published),
  }
}

function getPropertyByName(properties, propertyName) {
  if (!propertyName || !properties) {
    return undefined
  }

  if (propertyName in properties) {
    return properties[propertyName]
  }

  const normalizedTarget = propertyName.trim().toLowerCase()
  if (!normalizedTarget) {
    return undefined
  }

  for (const [candidateName, property] of Object.entries(properties)) {
    if (candidateName.trim().toLowerCase() === normalizedTarget) {
      return property
    }
  }

  return undefined
}

function parseTextProperty(property) {
  if (!property) {
    return ''
  }

  if (property.type === 'title') {
    return property.title.map((part) => part.plain_text).join('').trim()
  }

  if (property.type === 'rich_text') {
    return property.rich_text.map((part) => part.plain_text).join('').trim()
  }

  if (property.type === 'formula' && property.formula?.type === 'string') {
    return (property.formula.string || '').trim()
  }

  return ''
}

function parseDateProperty(property) {
  if (!property || property.type !== 'date' || !property.date?.start) {
    return ''
  }

  return property.date.start.slice(0, 10)
}

function parseTagsProperty(property) {
  if (!property || property.type !== 'multi_select') {
    return []
  }

  return property.multi_select
    .map((tag) => tag.name.trim())
    .filter(Boolean)
}

function parseCheckboxProperty(property) {
  if (!property) {
    return false
  }

  if (property.type === 'checkbox') {
    return Boolean(property.checkbox)
  }

  if (property.type === 'formula' && property.formula?.type === 'boolean') {
    return Boolean(property.formula.boolean)
  }

  return false
}

function getImageExtension(imageUrl, contentType) {
  try {
    const pathname = new URL(imageUrl).pathname
    const fromUrl = extname(pathname).toLowerCase()
    if (SUPPORTED_IMAGE_EXTENSIONS.has(fromUrl)) {
      return fromUrl
    }
  } catch {
    // Keep fallback behavior below.
  }

  const normalizedType = (contentType || '').split(';')[0].toLowerCase()
  if (normalizedType === 'image/jpeg') return '.jpg'
  if (normalizedType === 'image/png') return '.png'
  if (normalizedType === 'image/gif') return '.gif'
  if (normalizedType === 'image/webp') return '.webp'
  if (normalizedType === 'image/svg+xml') return '.svg'
  if (normalizedType === 'image/bmp') return '.bmp'
  if (normalizedType === 'image/avif') return '.avif'
  return '.jpg'
}

function buildFrontmatter(post) {
  const tags = post.tags.map((tag) => JSON.stringify(tag)).join(', ')

  return [
    '---',
    `title: ${JSON.stringify(post.title)}`,
    `description: ${JSON.stringify(post.description)}`,
    `date: ${JSON.stringify(post.date)}`,
    `tags: [${tags}]`,
    `notionPageId: ${JSON.stringify(post.pageId)}`,
    'source: "notion"',
    '---',
    '',
  ].join('\n')
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath)
    return true
  } catch {
    return false
  }
}

async function replaceDirectory(targetDir, sourceDir) {
  await rm(targetDir, { recursive: true, force: true })

  if (await pathExists(sourceDir)) {
    await cp(sourceDir, targetDir, { recursive: true })
    return
  }

  await mkdir(targetDir, { recursive: true })
}

async function fetchDatabasePages(notion, databaseId) {
  const pages = []
  let nextCursor = undefined

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
      start_cursor: nextCursor,
    })

    for (const result of response.results) {
      if (result.object === 'page') {
        pages.push(result)
      }
    }

    nextCursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (nextCursor)

  return pages
}

async function convertPageToMarkdown(n2m, pageId) {
  const mdBlocks = await n2m.pageToMarkdown(pageId)
  const mdString = n2m.toMarkdownString(mdBlocks)

  if (typeof mdString === 'string') {
    return mdString
  }

  if (typeof mdString?.parent === 'string') {
    return mdString.parent
  }

  return ''
}

async function localizeImageUrls(markdown, slug, tempImageRoot, warnings) {
  const imageUrls = Array.from(markdown.matchAll(IMAGE_LINK_PATTERN), (match) => match[1])
  const uniqueUrls = [...new Set(imageUrls)]

  if (!uniqueUrls.length) {
    return markdown
  }

  const downloadedMap = new Map()
  const slugImageDir = join(tempImageRoot, slug)

  for (const imageUrl of uniqueUrls) {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const extension = getImageExtension(imageUrl, response.headers.get('content-type') || '')
      const hash = createHash('sha1').update(imageUrl).digest('hex').slice(0, 10)
      const fileName = `${hash}${extension}`
      const destinationPath = join(slugImageDir, fileName)

      await mkdir(slugImageDir, { recursive: true })
      const fileBuffer = Buffer.from(await response.arrayBuffer())
      await writeFile(destinationPath, fileBuffer)

      downloadedMap.set(imageUrl, `/notion-images/${slug}/${fileName}`)
    } catch (error) {
      warnings.push(
        `Image download failed for slug "${slug}": ${imageUrl} (${error instanceof Error ? error.message : String(error)})`,
      )
    }
  }

  let updatedMarkdown = markdown
  for (const [remoteUrl, localUrl] of downloadedMap.entries()) {
    updatedMarkdown = updatedMarkdown.split(remoteUrl).join(localUrl)
  }

  return updatedMarkdown
}

function toPostMetadata(page, propertyNames) {
  const properties = page.properties || {}

  const title = parseTextProperty(getPropertyByName(properties, propertyNames.title))
  const slug = parseTextProperty(getPropertyByName(properties, propertyNames.slug))
  const description = parseTextProperty(getPropertyByName(properties, propertyNames.description))
  const date = parseDateProperty(getPropertyByName(properties, propertyNames.date))
  const tags = parseTagsProperty(getPropertyByName(properties, propertyNames.tags))
  const published = parseCheckboxProperty(getPropertyByName(properties, propertyNames.published))

  return {
    pageId: page.id,
    title,
    slug,
    description,
    date,
    tags,
    published,
  }
}

async function main() {
  const notionToken = getNotionTokenOrThrow()
  const notionDatabaseId = getEnvOrThrow('NOTION_DATABASE_ID')
  const propertyNames = readPropertyNames()

  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const projectRoot = resolve(scriptDir, '..')
  const contentDir = resolve(projectRoot, ...CONTENT_SUBDIR)
  const publicImageDir = resolve(projectRoot, ...IMAGE_SUBDIR)

  const notion = new Client({ auth: notionToken })
  const n2m = new NotionToMarkdown({ notionClient: notion })

  const pages = await fetchDatabasePages(notion, notionDatabaseId)

  const skippedWarnings = []
  const imageWarnings = []
  const posts = []
  const seenSlugs = new Set()
  let publishedPageCount = 0

  for (const page of pages) {
    const post = toPostMetadata(page, propertyNames)

    if (!post.published) {
      continue
    }

    publishedPageCount += 1

    if (!post.title || !post.slug || !post.date) {
      skippedWarnings.push(
        `Skipped page ${post.pageId}: missing required fields using configured property names (${JSON.stringify({
          title: propertyNames.title,
          slug: propertyNames.slug,
          date: propertyNames.date,
        })}).`,
      )
      continue
    }

    if (!SLUG_PATTERN.test(post.slug)) {
      throw new Error(`Invalid slug "${post.slug}" on page ${post.pageId}. Allowed pattern: ${SLUG_PATTERN}`)
    }

    if (seenSlugs.has(post.slug)) {
      throw new Error(`Duplicate slug "${post.slug}" detected.`)
    }

    seenSlugs.add(post.slug)
    posts.push(post)
  }

  posts.sort((a, b) => b.date.localeCompare(a.date))

  if (pages.length > 0 && publishedPageCount === 0) {
    console.warn(
      `[notion-sync] No pages matched "${propertyNames.published}" = true. Check your published property name or values.`,
    )
  }

  const tempRoot = await mkdtemp(join(tmpdir(), 'notion-sync-'))
  const tempContentDir = join(tempRoot, 'content-writing')
  const tempImageDir = join(tempRoot, 'public-notion-images')

  try {
    await mkdir(tempContentDir, { recursive: true })
    await mkdir(tempImageDir, { recursive: true })

    for (const post of posts) {
      const markdownBody = await convertPageToMarkdown(n2m, post.pageId)
      const localizedBody = await localizeImageUrls(markdownBody, post.slug, tempImageDir, imageWarnings)

      const frontmatter = buildFrontmatter(post)
      const content = `${frontmatter}${localizedBody.trim()}\n`
      const outputPath = join(tempContentDir, `${post.slug}.md`)

      await writeFile(outputPath, content, 'utf8')
    }

    await replaceDirectory(contentDir, tempContentDir)
    await replaceDirectory(publicImageDir, tempImageDir)
  } finally {
    await rm(tempRoot, { recursive: true, force: true })
  }

  if (skippedWarnings.length) {
    console.warn('[notion-sync] Some pages were skipped due to missing required fields:')
    for (const warning of skippedWarnings) {
      console.warn(`- ${warning}`)
    }
  }

  if (imageWarnings.length) {
    console.warn('[notion-sync] Some images could not be downloaded and kept original URL:')
    for (const warning of imageWarnings) {
      console.warn(`- ${warning}`)
    }
  }

  const generatedFiles = await readdir(contentDir).catch(() => [])
  console.log(`[notion-sync] Queried ${pages.length} pages from database`)
  console.log(`[notion-sync] Matched ${publishedPageCount} pages with "${propertyNames.published}" = true`)
  console.log(`[notion-sync] Generated ${generatedFiles.length} markdown files in ${CONTENT_SUBDIR.join('/')}`)
  console.log(`[notion-sync] Completed successfully`)
}

main().catch((error) => {
  console.error(`[notion-sync] Failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
