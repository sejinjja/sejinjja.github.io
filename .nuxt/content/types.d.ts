import type { PageCollectionItemBase, DataCollectionItemBase } from '@nuxt/content'

declare module '@nuxt/content' {
   interface ContentCollectionItem extends PageCollectionItemBase {
    date?: string
    description?: string
    tags?: string[]
    notionPageId?: string
    source?: string
  }
  

  interface PageCollections {
    content: ContentCollectionItem
  }

  interface Collections {
    content: ContentCollectionItem
  }
}
