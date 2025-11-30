// ============================================================================
// FILE: src/store/slices/uiSlice.ts
// UI State Management (Sidebar, Theme, Loading)
// ============================================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface UIState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'auto'
  isLoading: boolean
  loadingMessage: string | null
  mobileMenuOpen: boolean
  accentColor: string
  appearance: 'default' | 'compact' | 'comfortable'
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const getInitialTheme = (): 'light' | 'dark' | 'auto' => {
  const savedTheme = localStorage.getItem('theme')
  if (
    savedTheme === 'light' ||
    savedTheme === 'dark' ||
    savedTheme === 'auto'
  ) {
    return savedTheme
  }
  return 'light'
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: getInitialTheme(),
  isLoading: false,
  loadingMessage: null,
  mobileMenuOpen: false,
  accentColor: localStorage.getItem('accentColor') || '#D97706',
  appearance: (localStorage.getItem('appearance') as any) || 'default',
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

    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)

      // Apply theme to document
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (action.payload === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        // Auto mode - check system preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
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

    toggleTheme: state => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      state.theme = newTheme
      localStorage.setItem('theme', newTheme)

      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    // Loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
      if (!action.payload) {
        state.loadingMessage = null
      }
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
  toggleTheme,
  setLoading,
  setLoadingWithMessage,
  resetUI,
  setAccentColor,
  setAppearance,
} = uiSlice.actions

export default uiSlice.reducer
