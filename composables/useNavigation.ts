export function useNavigation() {
  const isMenuOpen = useState('navigation:isMenuOpen', () => false)

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
