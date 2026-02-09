<template>
  <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
    <nav class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors" @click="closeMenu">
        조세진
      </NuxtLink>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-8">
        <ul class="flex items-center gap-8">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              active-class="!text-primary-600 dark:!text-primary-400"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
        <button
          aria-label="테마 변경"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          @click="cycleColorMode"
        >
          <Icon :name="colorModeIcon" class="w-5 h-5" />
        </button>
      </div>

      <!-- Mobile Buttons -->
      <div class="flex md:hidden items-center gap-1">
        <button
          aria-label="테마 변경"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          @click="cycleColorMode"
        >
          <Icon :name="colorModeIcon" class="w-5 h-5" />
        </button>
        <button
          class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          aria-label="메뉴 열기"
          @click="toggleMenu"
        >
          <Icon :name="isMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="w-6 h-6" />
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
      <div v-if="isMenuOpen" class="md:hidden border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <ul class="px-6 py-4 space-y-3">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-1"
              active-class="!text-primary-600 dark:!text-primary-400"
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
const { isMenuOpen, toggleMenu, closeMenu } = useNavigation()
const colorMode = useColorMode()

const colorModeIcon = computed(() => {
  switch (colorMode.preference) {
    case 'dark': return 'heroicons:moon'
    case 'light': return 'heroicons:sun'
    default: return 'heroicons:computer-desktop'
  }
})

function cycleColorMode() {
  const modes = ['system', 'light', 'dark'] as const
  const currentIdx = modes.indexOf(colorMode.preference as typeof modes[number])
  colorMode.preference = modes[(currentIdx + 1) % modes.length]
}

const navItems = [
  { to: '/', label: '홈' },
  { to: '/about', label: '소개' },
  { to: '/projects', label: '프로젝트' },
  { to: '/writing', label: '글' },
]
</script>
