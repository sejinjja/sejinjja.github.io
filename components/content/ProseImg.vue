<template>
  <figure class="my-6">
    <NuxtImg
      :src="src"
      :alt="alt"
      :title="title"
      :width="width"
      :height="height"
      :format="SEO_IMAGE_FORMAT_WEBP"
      :sizes="SEO_PROSE_IMAGE_SIZES"
      loading="lazy"
      decoding="async"
      class="w-full h-auto rounded-lg"
    />
    <figcaption v-if="title" class="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
      {{ title }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { SEO_IMAGE_FORMAT_WEBP, SEO_PROSE_IMAGE_SIZES } from '~/constants/seo'

interface ProseImgProps {
  src: string
  alt?: string
  title?: string
  width?: string | number
  height?: string | number
}

withDefaults(defineProps<ProseImgProps>(), {
  alt: '',
})
</script>
