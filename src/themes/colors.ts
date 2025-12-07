// ============================================================================
// FILE: themes/colors.ts
// Color Palette Definitions
// ============================================================================

export const colors = {
  // Primary Colors (Orange)
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

  // Additional Theme Colors
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  yellow: {
    50: '#FEFCE8',
    100: '#FEF9C3',
    200: '#FEF08A',
    300: '#FDE047',
    400: '#FACC15',
    500: '#EAB308',
    600: '#CA8A04',
    700: '#A16207',
    800: '#854D0E',
    900: '#713F12',
  },

  emerald: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },
}

export type AccentColor = keyof typeof colors.accent

// Helper function to get accent color
export const getAccentColor = (accent: string): string => {
  return colors.accent[accent as AccentColor] || colors.accent.amber
}

export default colors
