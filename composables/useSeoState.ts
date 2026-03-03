import { computed, readonly } from 'vue'
import { useState } from '#imports'
import { DEFAULT_SEO_TITLE, SEO_STATE_KEY } from '~/constants/seo'
import { buildSeoState, mergeSeoState, type SeoState, type SeoStateInput } from '~/utils/seoFormatter'

const DEFAULT_SEO_STATE_INPUT: SeoStateInput = {
  title: DEFAULT_SEO_TITLE,
}

export function useSeoState(initialState: SeoStateInput = DEFAULT_SEO_STATE_INPUT) {
  const seoState = useState<SeoState>(SEO_STATE_KEY, () => buildSeoState(initialState))
  const seo = computed(() => seoState.value)

  function setSeo(nextState: SeoStateInput): void {
    seoState.value = buildSeoState(nextState)
  }

  function patchSeo(nextPatch: SeoStateInput): void {
    seoState.value = mergeSeoState(seoState.value, nextPatch)
  }

  function resetSeo(): void {
    seoState.value = buildSeoState(initialState)
  }

  return {
    seo: readonly(seo),
    setSeo,
    patchSeo,
    resetSeo,
  }
}
