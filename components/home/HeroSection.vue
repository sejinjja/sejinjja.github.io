<template>
  <section class="bg-gradient-to-br from-gray-900 via-primary-900 to-gray-950 text-white">
    <div class="max-w-5xl mx-auto px-6 py-24 md:py-32">
      <p class="text-primary-300 text-sm font-medium tracking-wider uppercase mb-4">
        Frontend / Web Developer
      </p>
      <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-6">
        조세진
      </h1>
      <p class="text-lg md:text-xl text-primary-100 max-w-2xl leading-relaxed">
        실무에서 통하는 정확함과 구조화된 사고로<br class="hidden sm:block">
        문제를 끝까지 해결하는 프런트엔드/웹 개발자.
      </p>
      <div class="mt-10 flex flex-wrap gap-4">
        <NuxtLink
          to="/about"
          class="inline-flex items-center px-6 py-3 bg-white text-primary-900 font-semibold rounded-lg hover:bg-primary-50 transition-colors shadow-sm"
        >
          더 알아보기
          <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="inline-flex items-center px-6 py-3 border border-primary-300/80 text-primary-50 font-semibold rounded-lg hover:bg-primary-800/70 transition-colors"
        >
          프로젝트 보기
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
