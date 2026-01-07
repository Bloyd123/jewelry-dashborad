// ============================================================================
// FILE: themes/presets.ts
// All Theme Presets (8 Themes)
// ============================================================================

import { Theme } from './default.theme'
import { colors } from './colors'

// ============================================================================
// THEME 1: DEFAULT (Light with Orange)
// ============================================================================
export const defaultTheme: Theme = {
  name: 'default',
  mode: 'light',
  colors: {
    header: {
      primary: '#FFFFFF',
      secondary: colors.primary[600], // Orange
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      tertiary: '#6B7280',
      accent: colors.primary[600],
    },
    border: {
      primary: '#E5E7EB',
      secondary: '#D1D5DB',
    },
    status: {
      success: colors.semantic.success.light,
      warning: colors.semantic.warning.light,
      error: colors.semantic.error.light,
      info: colors.semantic.info.light,
    },
    primary: colors.primary[600],
    accent: colors.accent.amber,
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  typography: {
    fontFamily: {
      sans: 'Bricolage Grotesque, system-ui, -apple-system, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
}

// ============================================================================
// THEME 2: DEFAULT DARK
// ============================================================================
export const defaultDarkTheme: Theme = {
  ...defaultTheme,
  name: 'defaultDark',
  mode: 'dark',
  colors: {
    header: {
      primary: colors.dark.bg.secondary,
      secondary: colors.primary[500],
    },
    background: {
      primary: colors.dark.bg.primary,
      secondary: colors.dark.bg.secondary,
      tertiary: colors.dark.bg.tertiary,
    },
    text: {
      primary: colors.dark.text.primary,
      secondary: colors.dark.text.secondary,
      tertiary: colors.dark.text.tertiary,
      accent: colors.primary[500],
    },
    border: {
      primary: colors.dark.border,
      secondary: colors.gray[700],
    },
    status: {
      success: colors.semantic.success.dark,
      warning: colors.semantic.warning.dark,
      error: colors.semantic.error.dark,
      info: colors.semantic.info.dark,
    },
    primary: colors.primary[500],
    accent: colors.accent.amber,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
  },
}

// ============================================================================
// THEME 3: LEGACY (Gold/Cream)
// ============================================================================
export const legacyTheme: Theme = {
  ...defaultTheme,
  name: 'legacy',
  mode: 'light',
  colors: {
    header: {
      primary: '#FFFBF5', // Cream
      secondary: '#8B6914', // Dark gold
    },
    background: {
      primary: '#FFFBF5',
      secondary: '#FFF8E7',
      tertiary: '#FFF4D6',
    },
    text: {
      primary: '#3D2817',
      secondary: '#6B4423',
      tertiary: '#8B6914',
      accent: colors.metal.gold,
    },
    border: {
      primary: '#E5D5B7',
      secondary: '#D4C4A8',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    primary: colors.metal.gold,
    accent: colors.metal.gold,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(212, 175, 55, 0.1)',
    md: '0 4px 6px -1px rgba(212, 175, 55, 0.15)',
    lg: '0 10px 15px -3px rgba(212, 175, 55, 0.2)',
    xl: '0 20px 25px -5px rgba(212, 175, 55, 0.25)',
  },
}

// ============================================================================
// THEME 4: LIGHT (Dark Blue-Gray with Emerald)
// ============================================================================
export const emeraldDarkTheme: Theme = {
  ...defaultTheme,
  name: 'light',
  mode: 'dark',
  colors: {
    header: {
      primary: '#2C3E50', // Dark blue-gray
      secondary: colors.emerald[400],
    },
    background: {
      primary: '#1A202C',
      secondary: '#2D3748',
      tertiary: '#4A5568',
    },
    text: {
      primary: '#F7FAFC',
      secondary: '#E2E8F0',
      tertiary: '#CBD5E0',
      accent: colors.emerald[400],
    },
    border: {
      primary: '#4A5568',
      secondary: '#718096',
    },
    status: {
      success: colors.emerald[400],
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
    },
    primary: colors.emerald[500],
    accent: colors.accent.emerald,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
  },
}

// ============================================================================
// THEME 5: LIGHT2 (Yellow/Amber Light)
// ============================================================================
export const light2Theme: Theme = {
  ...defaultTheme,
  name: 'light2',
  mode: 'light',
  colors: {
    header: {
      primary: '#FFFFFF',
      secondary: colors.yellow[500],
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#FFFBEB',
      tertiary: '#FEF3C7',
    },
    text: {
      primary: '#78350F',
      secondary: '#92400E',
      tertiary: '#B45309',
      accent: colors.yellow[600],
    },
    border: {
      primary: '#FCD34D',
      secondary: '#FDE68A',
    },
    status: {
      success: '#10B981',
      warning: colors.yellow[500],
      error: '#EF4444',
      info: '#3B82F6',
    },
    primary: colors.yellow[600],
    accent: colors.accent.amber,
  },
}

// ============================================================================
// THEME 6: LIGHT3 (Deep Indigo/Purple Dark)
// ============================================================================
export const light3Theme: Theme = {
  ...defaultTheme,
  name: 'light3',
  mode: 'dark',
  colors: {
    header: {
      primary: colors.indigo[900],
      secondary: colors.accent.purple,
    },
    background: {
      primary: '#0F0A1E',
      secondary: colors.indigo[900],
      tertiary: colors.indigo[800],
    },
    text: {
      primary: colors.indigo[50],
      secondary: colors.indigo[200],
      tertiary: colors.indigo[300],
      accent: colors.accent.purple,
    },
    border: {
      primary: colors.indigo[700],
      secondary: colors.indigo[600],
    },
    status: {
      success: colors.emerald[400],
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
    },
    primary: colors.accent.purple,
    accent: colors.accent.purple,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
  },
}

// ============================================================================
// THEME 7: LIGHT4 (Blue Light)
// ============================================================================
export const light4Theme: Theme = {
  ...defaultTheme,
  name: 'light4',
  mode: 'light',
  colors: {
    header: {
      primary: '#FFFFFF',
      secondary: colors.accent.blue,
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#EFF6FF',
      tertiary: '#DBEAFE',
    },
    text: {
      primary: '#1E3A8A',
      secondary: '#1E40AF',
      tertiary: '#2563EB',
      accent: colors.accent.blue,
    },
    border: {
      primary: '#93C5FD',
      secondary: '#BFDBFE',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: colors.accent.blue,
    },
    primary: colors.accent.blue,
    accent: colors.accent.blue,
  },
}

// ============================================================================
// THEME 8: LIGHT5 (Teal Dark)
// ============================================================================
export const light5Theme: Theme = {
  ...defaultTheme,
  name: 'light5',
  mode: 'dark',
  colors: {
    header: {
      primary: colors.teal[900],
      secondary: colors.accent.teal,
    },
    background: {
      primary: '#042F2E',
      secondary: colors.teal[900],
      tertiary: colors.teal[800],
    },
    text: {
      primary: colors.teal[50],
      secondary: colors.teal[200],
      tertiary: colors.teal[300],
      accent: colors.accent.teal,
    },
    border: {
      primary: colors.teal[700],
      secondary: colors.teal[600],
    },
    status: {
      success: colors.emerald[400],
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
    },
    primary: colors.accent.teal,
    accent: colors.accent.teal,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
  },
}

// ============================================================================
// THEME MAP
// ============================================================================
export const themes = {
  default: defaultTheme,
  defaultDark: defaultDarkTheme,
  legacy: legacyTheme,
  light: emeraldDarkTheme,
  light2: light2Theme,
  light3: light3Theme,
  light4: light4Theme,
  light5: light5Theme,
}

export type ThemeName = keyof typeof themes

// Helper to get theme by name
export const getThemeByName = (name: ThemeName): Theme => {
  return themes[name] || themes.default
}

// Get all theme names
export const getAllThemeNames = (): ThemeName[] => {
  return Object.keys(themes) as ThemeName[]
}

// Check if theme exists
export const isValidThemeName = (name: string): name is ThemeName => {
  return name in themes
}
