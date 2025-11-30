// ============================================================================
// FILE: themes/dark.theme.ts
// Dark Theme Specific Overrides
// ============================================================================

import { darkTheme } from './default.theme'

import type { Theme } from './default.theme'

// You can create custom dark theme variations here
export const darkThemeCustom: Theme = {
  ...darkTheme,
  // Override specific properties if needed
  colors: {
    ...darkTheme.colors,
    // Example: More contrast for dark mode
    background: {
      primary: '#0A0F1E',
      secondary: '#151B2E',
      tertiary: '#1F2937',
    },
  },
}

export default darkThemeCustom
