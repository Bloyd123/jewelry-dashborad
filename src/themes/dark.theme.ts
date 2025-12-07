// ============================================================================
// FILE: themes/dark.theme.ts
// Dark Theme Specific Overrides & Variations
// ============================================================================

import { darkTheme } from './default.theme'
import type { Theme } from './default.theme'

// Custom Dark Theme with More Contrast
export const darkThemeCustom: Theme = {
  ...darkTheme,
  name: 'darkCustom',
  colors: {
    ...darkTheme.colors,
    // More contrast for dark mode
    background: {
      primary: '#0A0F1E', // Darker
      secondary: '#151B2E',
      tertiary: '#1F2937',
    },
    text: {
      ...darkTheme.colors.text,
      primary: '#FFFFFF', // Pure white for better contrast
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.7)',
  },
}

// Dark Theme with Blue Accent
export const darkBlueTheme: Theme = {
  ...darkTheme,
  name: 'darkBlue',
  colors: {
    ...darkTheme.colors,
    header: {
      primary: '#0F172A',
      secondary: '#3B82F6',
    },
    text: {
      ...darkTheme.colors.text,
      accent: '#3B82F6',
    },
    primary: '#3B82F6',
    accent: '#3B82F6',
  },
}

// Dark Theme with Emerald Accent
export const darkEmeraldTheme: Theme = {
  ...darkTheme,
  name: 'darkEmerald',
  colors: {
    ...darkTheme.colors,
    header: {
      primary: '#0F172A',
      secondary: '#10B981',
    },
    text: {
      ...darkTheme.colors.text,
      accent: '#10B981',
    },
    primary: '#10B981',
    accent: '#10B981',
  },
}

export default {
  darkCustom: darkThemeCustom,
  darkBlue: darkBlueTheme,
  darkEmerald: darkEmeraldTheme,
}
