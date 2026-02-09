<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
    <LayoutTheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>
