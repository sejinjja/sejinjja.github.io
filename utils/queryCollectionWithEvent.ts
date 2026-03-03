type QueryCollectionFn = typeof queryCollection
type QueryCollectionBuilder = ReturnType<QueryCollectionFn>
type QueryCollectionWithEventFn = (event: unknown, collection: string) => QueryCollectionBuilder

export function queryCollectionWithEvent(event: unknown, collection: string): QueryCollectionBuilder {
  return (queryCollection as unknown as QueryCollectionWithEventFn)(event, collection)
}
