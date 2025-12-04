// ============================================================================
// FILE: store/slices/uiSlice.ts
// UI State Management (Sidebar, Theme, Loading)
// ============================================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ThemeName } from '@/themes/presets'

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface UIState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  themeName: ThemeName // ✅ CHANGED: from 'theme' to 'themeName'
  isLoading: boolean
  loadingMessage: string | null
  mobileMenuOpen: boolean
  accentColor: string
  appearance: 'default' | 'compact' | 'comfortable'
   language: 'en' | 'hi' | 'mr'
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const getInitialTheme = (): ThemeName => {
  const savedTheme = localStorage.getItem('themeName')
  
  // ✅ NEW: Check if it's a valid theme name
  const validThemes: ThemeName[] = [
    'default',
    'defaultDark',
    'legacy',
    'light',
    'light2',
    'light3',
    'light4',
    'light5',
  ]
  
  if (savedTheme && validThemes.includes(savedTheme as ThemeName)) {
    return savedTheme as ThemeName
  }
  
  return 'default'
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  themeName: getInitialTheme(), // ✅ CHANGED
  isLoading: false,
  loadingMessage: null,
  mobileMenuOpen: false,
  accentColor: localStorage.getItem('accentColor') || 'amber',
  appearance: (localStorage.getItem('appearance') as any) || 'default',
  language: (localStorage.getItem('language') as 'en' | 'hi' | 'mr') || 'en',
}

// ============================================================================
// SLICE
// ============================================================================

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },

    toggleSidebarCollapsed: state => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },

    // Mobile Menu
    toggleMobileMenu: state => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },

    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload
    },

    // ✅ CHANGED: Theme now accepts ThemeName
    setTheme: (state, action: PayloadAction<ThemeName>) => {
      state.themeName = action.payload
      localStorage.setItem('themeName', action.payload)
      // Note: CSS variables will be updated by useThemeSync hook
    },

    // ✅ NEW: Cycle through themes
    cycleTheme: state => {
      const themes: ThemeName[] = [
        'default',
        'defaultDark',
        'legacy',
        'light',
        'light2',
        'light3',
        'light4',
        'light5',
      ]
      const currentIndex = themes.indexOf(state.themeName)
      const nextIndex = (currentIndex + 1) % themes.length
      state.themeName = themes[nextIndex]
      localStorage.setItem('themeName', themes[nextIndex])
    },

    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload
      localStorage.setItem('accentColor', action.payload)
    },

    setAppearance: (
      state,
      action: PayloadAction<'default' | 'compact' | 'comfortable'>
    ) => {
      state.appearance = action.payload
      localStorage.setItem('appearance', action.payload)
    },

    // ✅ REMOVED: toggleTheme (no longer needed with multi-theme)

    // Loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
      if (!action.payload) {
        state.loadingMessage = null
      }
    },
    setLanguage: (state, action: PayloadAction<'en' | 'hi'>) => {
  state.language = action.payload
  localStorage.setItem('language', action.payload)
},

    setLoadingWithMessage: (
      state,
      action: PayloadAction<{ isLoading: boolean; message?: string }>
    ) => {
      state.isLoading = action.payload.isLoading
      state.loadingMessage = action.payload.message || null
    },

    // Reset UI state
    resetUI: state => {
      state.sidebarOpen = true
      state.sidebarCollapsed = false
      state.isLoading = false
      state.loadingMessage = null
      state.mobileMenuOpen = false
    },
  },
})

// ============================================================================
// EXPORT ACTIONS & REDUCER
// ============================================================================

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  toggleMobileMenu,
  setMobileMenuOpen,
  setTheme,
  cycleTheme, // ✅ NEW
  setLoading,
  setLoadingWithMessage,
  resetUI,
  setAccentColor,
  setAppearance,
  setLanguage,
} = uiSlice.actions

export default uiSlice.reducer