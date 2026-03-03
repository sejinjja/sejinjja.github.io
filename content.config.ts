import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: 'writing/*.md',
      schema: z.object({
        date: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        notionPageId: z.string().optional(),
        source: z.string().optional(),
      })
    })
  }
})
