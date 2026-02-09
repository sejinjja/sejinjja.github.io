const isMenuOpen = ref(false)

export function useNavigation() {
  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  function closeMenu() {
    isMenuOpen.value = false
  }

  return {
    isMenuOpen: readonly(isMenuOpen),
    toggleMenu,
    closeMenu,
  }
}
