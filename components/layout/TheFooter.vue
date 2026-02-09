<template>
  <footer class="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
    <div class="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        &copy; {{ new Date().getFullYear() }} 조세진
      </p>
      <div class="flex items-center gap-4">
        <a
          href="https://github.com/sejinjja"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="GitHub"
        >
          <Icon name="mdi:github" class="w-5 h-5" />
        </a>
      </div>
    </div>
  </footer>
</template>
