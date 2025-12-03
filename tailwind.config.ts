// ============================================================================
// FILE: tailwind.config.js
// Tailwind Configuration with CSS Variables
// ============================================================================

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable dark mode via class
  theme: {
    extend: {
      // ========== Colors (CSS Variables) ==========
      colors: {
        // Header
        header: {
          primary: 'var(--header-primary)',
          secondary: 'var(--header-secondary)',
        },

        // Background
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },

        // Text
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          accent: 'var(--text-accent)',
        },

        // Border
        border: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
        },

        // Status
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          error: 'var(--status-error)',
          info: 'var(--status-info)',
        },

        // Primary/Accent
        accent: 'var(--accent-color)',
        primary: 'var(--primary-color)',

        // Sidebar
        sidebar: {
          bg: 'var(--sidebar-bg)',
          text: 'var(--sidebar-text)',
          muted: 'var(--sidebar-text-muted)',
          hover: 'var(--sidebar-hover)',
          active: 'var(--sidebar-active)',
          border: 'var(--sidebar-border)',
        },
      },

      // ========== Spacing ==========
      spacing: {
        sidebar: 'var(--sidebar-width)',
        'sidebar-collapsed': 'var(--sidebar-collapsed-width)',
      },

      // ========== Border Radius ==========
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },

      // ========== Box Shadow ==========
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },

      // ========== Font Family ==========
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },

      // ========== Font Size ==========
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },

      // ========== Transitions ==========
      transitionDuration: {
        fast: 'var(--transition-fast)',
        normal: 'var(--transition-normal)',
        slow: 'var(--transition-slow)',
      },

      // ========== Z-Index ==========
      zIndex: {
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
      },
    },
  },
  plugins: [],
}