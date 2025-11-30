// hooks/useTheme.ts
import { useAppSelector } from '@/store/hooks'
import { getAccentColor } from '@/themes/colors'
import { getTheme } from '@/themes/default.theme'

export const useTheme = () => {
  const { theme, accentColor } = useAppSelector(state => state.ui)

  // Determine actual theme (handle 'auto' mode)
  const actualTheme =
    theme === 'auto'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  const currentTheme = getTheme(actualTheme)
  const currentAccent = getAccentColor(accentColor)

  return {
    theme: currentTheme,
    accentColor: currentAccent,
    mode: actualTheme,
  }
}
