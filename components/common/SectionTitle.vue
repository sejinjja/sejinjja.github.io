<template>
  <div class="mb-8">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
      <slot />
    </h2>
    <p v-if="$slots.subtitle" class="mt-2 text-gray-500 dark:text-gray-300">
      <slot name="subtitle" />
    </p>
  </div>
</template>
