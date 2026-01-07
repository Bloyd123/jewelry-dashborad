// ============================================================================
// FILE: themes/default.theme.ts
// Default Theme Configuration & Interface
// ============================================================================

import { colors } from './colors'

export interface Theme {
  name: string
  mode: 'light' | 'dark'
  colors: {
    // Header colors
    header: {
      primary: string
      secondary: string
    }
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
    '2xl': string
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
  // Transitions
  transitions: {
    fast: string
    normal: string
    slow: string
  }
}

// Light Theme (Base)
export const lightTheme: Theme = {
  name: 'light',
  mode: 'light',
  colors: {
    header: {
      primary: colors.light.bg.primary,
      secondary: colors.primary[600],
    },
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
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
  },
  borderRadius: {
    sm: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
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
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
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

// Dark Theme (Base)
export const darkTheme: Theme = {
  ...lightTheme,
  name: 'dark',
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
