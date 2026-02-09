import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        gray: {
          50: '#f7f9fc',
          100: '#eef2f8',
          200: '#d8e0ec',
          300: '#b6c2d4',
          400: '#8b9ab0',
          500: '#627089',
          600: '#4a5568',
          700: '#374155',
          800: '#1f2937',
          900: '#0f172a',
          950: '#0b1120',
        },
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    typography,
  ],
} satisfies Config
