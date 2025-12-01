// ============================================================================
// FILE: App.tsx
// Main Application Component
// ============================================================================

import { useEffect } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './components/auth/login'
import ForgotPasswordPage from './components/auth/forgotpassword'
import ToastContainer from './components/common/ToastContainer'
import { NotificationProvider } from './context/NotificationContext'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { initializeAuth } from './store/slices/authSlice'
import { setTheme } from './store/slices/uiSlice'
import ResetPasswordPage from './components/auth/resetpassword'

// ============================================================================
// APP COMPONENT
// ============================================================================

function App() {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector(state => state.ui)

  // ========================================
  // Initialize App
  // ========================================
  useEffect(() => {
    // Initialize authentication state
    dispatch(initializeAuth())

    // Apply theme
    dispatch(setTheme(theme))

    // Handle system theme changes in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'auto') {
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }

    mediaQuery.addEventListener('change', handleThemeChange)
    return () => mediaQuery.removeEventListener('change', handleThemeChange)
  }, [dispatch, theme])

  // ========================================
  // Render Routes
  // ========================================
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path='/auth/signup' element={<ResetPasswordPage/>}/>
        </Routes>
        <ToastContainer />
      </NotificationProvider>
    </BrowserRouter>
  )
}

export default App