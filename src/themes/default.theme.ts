// ============================================================================
// FILE: themes/default.theme.ts
// Default Theme Configuration
// ============================================================================

import { colors } from './colors'

export interface Theme {
  mode: 'light' | 'dark'
  colors: {
    // Backgrounds
    background: {
      primary: string
      secondary: string
      tertiary: string
    }
    // Text
    text: {
      primary: string
      secondary: string
      tertiary: string
      accent: string
    }
    // Borders
    border: {
      primary: string
      secondary: string
    }
    // Status
    status: {
      success: string
      warning: string
      error: string
      info: string
    }
    // Primary/Accent
    primary: string
    accent: string
  }
  // Spacing (based on appearance mode)
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  // Border Radius
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  // Shadows
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  // Typography
  typography: {
    fontFamily: {
      sans: string
      mono: string
    }
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      '4xl': string
    }
    fontWeight: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }
}

// Light Theme
export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: {
      primary: colors.light.bg.primary,
      secondary: colors.light.bg.secondary,
      tertiary: colors.light.bg.tertiary,
    },
    text: {
      primary: colors.light.text.primary,
      secondary: colors.light.text.secondary,
      tertiary: colors.light.text.tertiary,
      accent: colors.accent.amber,
    },
    border: {
      primary: colors.light.border,
      secondary: colors.gray[200],
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
      sans: 'Inter, system-ui, -apple-system, sans-serif',
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
}

// Dark Theme
export const darkTheme: Theme = {
  ...lightTheme,
  mode: 'dark',
  colors: {
    background: {
      primary: colors.dark.bg.primary,
      secondary: colors.dark.bg.secondary,
      tertiary: colors.dark.bg.tertiary,
    },
    text: {
      primary: colors.dark.text.primary,
      secondary: colors.dark.text.secondary,
      tertiary: colors.dark.text.tertiary,
      accent: colors.accent.amber,
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

// Helper to get theme based on mode
export const getTheme = (mode: 'light' | 'dark'): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme
}

export default {
  light: lightTheme,
  dark: darkTheme,
  getTheme,
}
