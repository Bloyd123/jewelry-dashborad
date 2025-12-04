// ============================================================================
// FILE: App.tsx
// Main Application Component
// ============================================================================

import { useEffect } from 'react'

import { BrowserRouter, Routes, Route,Navigate  } from 'react-router-dom'

import LoginPage from './components/auth/login'
import ForgotPasswordPage from './components/auth/forgotpassword'
import ToastContainer from './components/common/ToastContainer'
import { NotificationProvider } from './context/NotificationContext'
import { useAppDispatch} from './store/hooks'
import { initializeAuth } from './store/slices/authSlice'
import ResetPasswordPage from './components/auth/resetpassword'
import { useThemeSync } from './hooks/useThemeSync'
import { DashboardLayout } from './layouts/DashboardLayout'
import Dashboard from './pages/dashboard'
import { NoInternetWrapper } from './components/common'
// ============================================================================
// APP COMPONENT
// ============================================================================

function App() {
  const dispatch = useAppDispatch()
    useThemeSync()


  // ========================================
  // Initialize App
  // ========================================
  useEffect(() => {
    // Initialize authentication state
    dispatch(initializeAuth())
  }, [dispatch])

  // ========================================
  // Render Routes
  // ========================================
  return (
    <NoInternetWrapper> 
    <BrowserRouter>
      <NotificationProvider>
        <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path='/auth/signup' element={<ResetPasswordPage/>}/>
                    {/* Protected Routes with Layout */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
        <ToastContainer />
      </NotificationProvider>
    </BrowserRouter>
    </NoInternetWrapper>
  )
}

export default App