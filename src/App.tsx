// ============================================================================
// FILE: App.tsx
// Main Application Component
// ============================================================================

import { useEffect } from 'react'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './config/routes.config'
import LoginPage from './components/auth/login/pages'
import ForgotPasswordPage from './components/auth/forgotpassword/pages'
import ToastContainer from './components/common/ToastContainer'
import { NotificationProvider } from './context/NotificationContext'
import { useAppDispatch } from './store/hooks'
import { initializeAuth } from './store/slices/authSlice'
import ResetPasswordPage from './components/auth/resetpassword/pages'
import { useThemeSync } from './hooks/useThemeSync'
import { MainLayout } from './components/layout/MainLayout/MainLayout'
// import { CustomerForm } from './components/customer/CustomerForm'
import AddCustomerPage from './pages/customer/AddCustomer'
// import CustomerCard from './components/customer/CustomerCard'

import { Dashboard } from './components/dashboard/pages'
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
            <Route path="/" element={<Navigate to={ROUTES.login} replace />} />
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route
              path={ROUTES.forgotPassword}
              element={<ForgotPasswordPage />}
            />
            <Route
              path={ROUTES.resetPassword}
              element={<ResetPasswordPage />}
            />
            {/* Protected Routes with Layout */}
            <Route path="/" element={<MainLayout />}>
              <Route
                index
                element={<Navigate to={ROUTES.dashboard} replace />}
              />
              <Route path={ROUTES.dashboard} element={<Dashboard />} />
      {/* ← REPLACE: Customer routes */}
              {/* <Route path="/customers" element={<CustomerListPage />} /> */}
              <Route path="/customers/add" element={<AddCustomerPage />} />
              <Route path="/customers/:customerId/edit" element={<AddCustomerPage />} />

              
              <Route
                path="*"
                element={<Navigate to={ROUTES.dashboard} replace />}
              />
            </Route>
          </Routes>
          <ToastContainer />
        </NotificationProvider>
      </BrowserRouter>
    </NoInternetWrapper>
  )
}

export default App
