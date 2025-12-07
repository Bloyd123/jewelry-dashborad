// ============================================================================
// FILE: hooks/useThemeSync.ts
// Theme Sync Hook - Sync Theme to CSS Variables
// ============================================================================

import { useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { getThemeByName } from '@/themes/presets'

export const useThemeSync = () => {
  const { themeName } = useAppSelector(state => state.ui)

  useEffect(() => {
    const currentTheme = getThemeByName(themeName)
    const root = document.documentElement

    // Set theme name and mode as data attributes
    root.setAttribute('data-theme', themeName)
    root.setAttribute('data-mode', currentTheme.mode)

    const { colors } = currentTheme

    // ========== Header Colors ==========
    root.style.setProperty('--header-primary', colors.header.primary)
    root.style.setProperty('--header-secondary', colors.header.secondary)

    // ========== Background Colors ==========
    root.style.setProperty('--bg-primary', colors.background.primary)
    root.style.setProperty('--bg-secondary', colors.background.secondary)
    root.style.setProperty('--bg-tertiary', colors.background.tertiary)

    // ========== Text Colors ==========
    root.style.setProperty('--text-primary', colors.text.primary)
    root.style.setProperty('--text-secondary', colors.text.secondary)
    root.style.setProperty('--text-tertiary', colors.text.tertiary)
    root.style.setProperty('--text-accent', colors.text.accent)

    // ========== Border Colors ==========
    root.style.setProperty('--border-primary', colors.border.primary)
    root.style.setProperty('--border-secondary', colors.border.secondary)

    // ========== Status Colors ==========
    root.style.setProperty('--status-success', colors.status.success)
    root.style.setProperty('--status-warning', colors.status.warning)
    root.style.setProperty('--status-error', colors.status.error)
    root.style.setProperty('--status-info', colors.status.info)

    // ========== Primary/Accent Colors ==========
    root.style.setProperty('--primary-color', colors.primary)
    root.style.setProperty('--accent-color', colors.accent)

    // ========== Sidebar Colors (Derived) ==========
    root.style.setProperty('--sidebar-bg', colors.background.secondary)
    root.style.setProperty('--sidebar-text', colors.text.primary)
    root.style.setProperty('--sidebar-text-muted', colors.text.secondary)
    root.style.setProperty('--sidebar-hover', colors.background.tertiary)
    root.style.setProperty('--sidebar-active', colors.primary)
    root.style.setProperty('--sidebar-border', colors.border.primary)

    // ========== Shadows ==========
    root.style.setProperty('--shadow-sm', currentTheme.shadows.sm)
    root.style.setProperty('--shadow-md', currentTheme.shadows.md)
    root.style.setProperty('--shadow-lg', currentTheme.shadows.lg)
    root.style.setProperty('--shadow-xl', currentTheme.shadows.xl)

    // ========== Spacing ==========
    root.style.setProperty('--spacing-xs', currentTheme.spacing.xs)
    root.style.setProperty('--spacing-sm', currentTheme.spacing.sm)
    root.style.setProperty('--spacing-md', currentTheme.spacing.md)
    root.style.setProperty('--spacing-lg', currentTheme.spacing.lg)
    root.style.setProperty('--spacing-xl', currentTheme.spacing.xl)
    root.style.setProperty('--spacing-2xl', currentTheme.spacing['2xl'])

    // ========== Border Radius ==========
    root.style.setProperty('--radius-sm', currentTheme.borderRadius.sm)
    root.style.setProperty('--radius-md', currentTheme.borderRadius.md)
    root.style.setProperty('--radius-lg', currentTheme.borderRadius.lg)
    root.style.setProperty('--radius-xl', currentTheme.borderRadius.xl)
    root.style.setProperty('--radius-full', currentTheme.borderRadius.full)

    // ========== Typography ==========
    root.style.setProperty(
      '--font-sans',
      currentTheme.typography.fontFamily.sans
    )
    root.style.setProperty(
      '--font-mono',
      currentTheme.typography.fontFamily.mono
    )

    // ========== Transitions ==========
    root.style.setProperty('--transition-fast', currentTheme.transitions.fast)
    root.style.setProperty(
      '--transition-normal',
      currentTheme.transitions.normal
    )
    root.style.setProperty('--transition-slow', currentTheme.transitions.slow)
  }, [themeName])
}
