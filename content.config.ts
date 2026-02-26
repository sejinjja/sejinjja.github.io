import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: 'writing/*.md',
      schema: z.object({
        date: z.string(),
        tags: z.array(z.string()),
        notionPageId: z.string().optional(),
        source: z.string().optional()
      })
    })
  }
})
