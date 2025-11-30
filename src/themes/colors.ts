// ============================================================================
// FILE: themes/colors.ts
// Color Palette Definitions
// ============================================================================

export const colors = {
  // Primary Colors
  primary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Accent Colors (Customizable)
  accent: {
    amber: '#D97706',
    blue: '#3B82F6',
    emerald: '#10B981',
    rose: '#F43F5E',
    purple: '#A855F7',
    teal: '#14B8A6',
  },

  // Neutral/Gray
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Dark Mode Specific
  dark: {
    bg: {
      primary: '#0F172A', // Main background
      secondary: '#1E293B', // Card background
      tertiary: '#334155', // Hover states
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
    },
    border: '#334155',
  },

  // Light Mode Specific
  light: {
    bg: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      tertiary: '#6B7280',
    },
    border: '#E5E7EB',
  },

  // Semantic Colors
  semantic: {
    success: {
      light: '#10B981',
      dark: '#34D399',
    },
    warning: {
      light: '#F59E0B',
      dark: '#FBBF24',
    },
    error: {
      light: '#EF4444',
      dark: '#F87171',
    },
    info: {
      light: '#3B82F6',
      dark: '#60A5FA',
    },
  },

  // Gold/Jewelry Specific
  metal: {
    gold: '#FFD700',
    silver: '#C0C0C0',
    platinum: '#E5E4E2',
    rose: '#B76E79',
  },
}

export type AccentColor = keyof typeof colors.accent

// Helper function to get accent color
export const getAccentColor = (accent: string): string => {
  return colors.accent[accent as AccentColor] || colors.accent.amber
}

export default colors
