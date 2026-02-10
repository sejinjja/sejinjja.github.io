# Notion -> `/writing` Sync Guide

This project renders writing posts from files in `content/writing`.  
Posts are now generated from a Notion database at build time.

## 1. Create and connect Notion integration

1. Go to Notion integrations: https://www.notion.so/my-integrations
2. Create an internal integration and copy the **Internal Integration Token**.
3. Open your writing database page in Notion.
4. Click `...` -> `Connections` -> connect the integration.
5. Copy the database ID from the database URL.

## 2. Database schema

Default property names are:

- `title` (Title)
- `slug` (Rich text)
- `description` (Rich text)
- `date` (Date)
- `tags` (Multi-select)
- `published` (Checkbox)

Only rows with `published = true` are exported.

If your Notion DB uses different property names, map them via env vars:

- `NOTION_TITLE_PROPERTY`
- `NOTION_SLUG_PROPERTY`
- `NOTION_DESCRIPTION_PROPERTY`
- `NOTION_DATE_PROPERTY`
- `NOTION_TAGS_PROPERTY`
- `NOTION_PUBLISHED_PROPERTY`

## 3. Local development flow

1. Create `.env` from `.env.example`.
2. Set:
   - `NOTION_TOKEN` (or `NOTION_API_KEY`)
   - `NOTION_DATABASE_ID`
   - optional: `NOTION_DATA_SOURCE_ID` (for newer Notion API client compatibility)
3. Run sync:

```bash
pnpm notion:sync
```

The sync script:

- fetches pages from Notion DB
- filters rows with `published = true`
- sorts generated posts by `date` desc
- normalizes slug values to lowercase before validation
- validates required fields and slug format
- converts Notion blocks to Markdown
- downloads images into `public/notion-images/<slug>/`
- rewrites Markdown image links to local image paths
- replaces `content/writing` with fresh generated files

Then run:

```bash
pnpm dev
```

## 4. CI / GitHub Pages deployment

`/.github/workflows/deploy.yml` runs sync before static generation:

1. `pnpm install --frozen-lockfile`
2. `pnpm typecheck`
3. `pnpm notion:sync`
4. `pnpm generate`

Add these GitHub repository secrets:

- `NOTION_TOKEN` (or `NOTION_API_KEY`)
- `NOTION_DATABASE_ID`
- optional: `NOTION_DATA_SOURCE_ID`

Optional mapping can be set as repository variables or secrets:

- `NOTION_TITLE_PROPERTY`
- `NOTION_SLUG_PROPERTY`
- `NOTION_DESCRIPTION_PROPERTY`
- `NOTION_DATE_PROPERTY`
- `NOTION_TAGS_PROPERTY`
- `NOTION_PUBLISHED_PROPERTY`

Without required secrets, deployment build will fail at the sync step.

## 5. Generated file conventions

Each generated post includes this frontmatter shape:

- `title`
- `description`
- `date`
- `tags`
- `notionPageId`
- `source: notion`

Generated content paths:

- Markdown posts: `content/writing/<slug>.md`
- Images: `public/notion-images/<slug>/*`
