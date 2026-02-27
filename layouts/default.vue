<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-primary-700 focus:font-semibold focus:rounded-lg focus:shadow-lg"
    >본문으로 건너뛰기</a>
    <LayoutTheHeader />
    <main id="main-content" class="flex-1">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>
