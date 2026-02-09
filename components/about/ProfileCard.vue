<template>
  <section class="p-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
    <div class="flex flex-col sm:flex-row items-start gap-6">
      <div class="w-20 h-20 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center flex-shrink-0">
        <Icon name="heroicons:user" class="w-10 h-10 text-primary-600 dark:text-primary-300" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">조세진</h2>
        <p class="text-primary-700 dark:text-primary-400 font-medium mb-3">프런트엔드/웹 개발자</p>
        <ul class="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
          <li class="flex items-center gap-2">
            <Icon name="heroicons:building-office-2" class="w-4 h-4 text-gray-400 dark:text-gray-500" />
            삼성카드 재직
          </li>
          <li class="flex items-center gap-2">
            <Icon name="heroicons:map-pin" class="w-4 h-4 text-gray-400 dark:text-gray-500" />
            미사 거주
          </li>
          <li class="flex items-center gap-2">
            <Icon name="heroicons:code-bracket" class="w-4 h-4 text-gray-400 dark:text-gray-500" />
            컴퓨터 프로그래머
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
