// ============================================================================
// FILE: hooks/useTheme.ts
// Theme Hook - Get Current Theme
// ============================================================================

import { useAppSelector } from '@/store/hooks'
import { getThemeByName } from '@/themes/presets'

export const useTheme = () => {
  const { themeName, accentColor } = useAppSelector(state => state.ui)

  const currentTheme = getThemeByName(themeName)

  return {
    theme: currentTheme,
    themeName,
    accentColor,
    mode: currentTheme.mode,
  }
}
