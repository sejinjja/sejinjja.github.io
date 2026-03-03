<template>
  <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
    <nav class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between" aria-label="주요 메뉴">
      <NuxtLink
        to="/"
        class="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
        aria-label="홈으로 이동"
        @click="closeMenu"
      >
        조세진
      </NuxtLink>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-8">
        <ul class="flex items-center gap-8">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
              active-class="!text-primary-600 dark:!text-primary-300"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
        <CommonThemeToggle
          class="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        />
      </div>

      <!-- Mobile Buttons -->
      <div class="flex md:hidden items-center gap-1">
        <CommonThemeToggle
          class="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        />
        <button
          type="button"
          class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          :aria-label="isMenuOpen ? '메뉴 닫기' : '메뉴 열기'"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-nav"
          @click="toggleMenu"
        >
          <Icon :name="isMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </nav>

    <!-- Mobile Nav -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMenuOpen"
        id="mobile-nav"
        class="md:hidden border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950"
        role="navigation"
        aria-label="모바일 메뉴"
      >
        <ul class="px-6 py-4 space-y-3">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors py-1"
              active-class="!text-primary-600 dark:!text-primary-300"
              @click="closeMenu"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useRoute } from '#imports'
import { useNavigation } from '~/composables/useNavigation'

const { isMenuOpen, toggleMenu, closeMenu } = useNavigation()
const route = useRoute()

const navItems = [
  { to: '/', label: '홈' },
  { to: '/about', label: '소개' },
  { to: '/projects', label: '프로젝트' },
  { to: '/writing', label: '글' },
]

function handleWindowKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

watch(
  isMenuOpen,
  (open) => {
    if (typeof window === 'undefined') {
      return
    }

    if (open) {
      window.addEventListener('keydown', handleWindowKeydown)
      return
    }

    window.removeEventListener('keydown', handleWindowKeydown)
  },
  { immediate: true },
)

watch(
  () => route.fullPath,
  () => {
    closeMenu()
  },
)

onBeforeUnmount(() => {
  if (typeof window === 'undefined') {
    return
  }

  window.removeEventListener('keydown', handleWindowKeydown)
})
</script>
