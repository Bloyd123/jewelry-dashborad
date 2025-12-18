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
import AddCustomerPage from './pages/customer/AddCustomer'
// import { RateHistoryTable } from '@/components/metal-rates/MetalRatesDashboard/RateHistoryTable/RateHistoryTable'
import { ShopListPage } from '@/pages/shops/ShopsListPage'

import { Dashboard } from './components/dashboard/pages'
import { NoInternetWrapper } from './components/common'
import { CustomerDetailsPage } from './components/customer'
import ShopDetailsPage from './pages/shops/ShopDetailsPage'
import MetalRatesDashboardPage from '@/components/metal-rates/MetalRatesDashboard/MetalRatesDashboardPage'
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
   <Route path="/customers/add" element={<AddCustomerPage />} />
<Route path="/customers/edit/:customerId" element={<AddCustomerPage />} />
              <Route path="/customerdetail" element={<CustomerDetailsPage/>}/>
              <Route path='/shops' element={ <ShopListPage />}/>
              <Route path='/shops/:id' element={<ShopDetailsPage/>}/>
       <Route path="metal-rates" element={<MetalRatesDashboardPage />} />




              
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
