// ============================================================================
// FILE: themes/index.ts
// Theme System Exports
// ============================================================================

// Export color palette
export { colors, getAccentColor } from './colors'
export type { AccentColor } from './colors'

// Export theme interfaces and defaults
export { lightTheme, darkTheme, getTheme } from './default.theme'
export type { Theme } from './default.theme'

// Export dark theme variations
export { darkThemeCustom, darkBlueTheme, darkEmeraldTheme } from './dark.theme'

// Export all theme presets
export {
  defaultTheme,
  defaultDarkTheme,
  legacyTheme,
  emeraldDarkTheme,
  light2Theme,
  light3Theme,
  light4Theme,
  light5Theme,
  themes,
  getThemeByName,
  getAllThemeNames,
  isValidThemeName,
} from './presets'
export type { ThemeName } from './presets'
