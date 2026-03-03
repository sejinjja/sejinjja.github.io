export const checksums = {}
export const checksumsStructure = {}

export const tables = {
  "content": "_content_content",
  "info": "_content_info"
}

export default {
  "content": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "body": "json",
      "date": "string",
      "description": "string",
      "extension": "string",
      "meta": "json",
      "navigation": "json",
      "notionPageId": "string",
      "path": "string",
      "seo": "json",
      "source": "string",
      "stem": "string",
      "tags": "json"
    }
  },
  "info": {
    "type": "data",
    "fields": {}
  }
}