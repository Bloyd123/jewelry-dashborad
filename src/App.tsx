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
import { RateHistoryTable } from '@/components/metal-rates/MetalRatesDashboard/RateHistoryTable/RateHistoryTable'
import { ShopListPage } from '@/pages/shops/ShopsListPage'

import { Dashboard } from './components/dashboard/pages'
import { NoInternetWrapper } from './components/common'
import { CustomerDetailsPage } from './components/customer'
import ShopDetailsPage from './pages/shops/ShopDetailsPage'
import { CurrentRatesCards } from '@/components/metal-rates/MetalRatesDashboard'
import { TrendChart } from '@/components/metal-rates/MetalRatesDashboard'
import { QuickInsights } from '@/components/metal-rates/MetalRatesDashboard/QuickInsights'
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
              <Route path='metalrate' element={<CurrentRatesCards 
                    loading={false}
                    onCardClick={(metal, purity) => console.log(metal, purity)}
                  />}/>
                <Route path='/trendchart' element={<TrendChart 
  shopId="674def456abc789012345678"
  metalType="gold"
  defaultPeriod={90}
/>}/>
<Route path='/ratehistory' 
          element={
            <RateHistoryTable 
            />
          }/>
          <Route path='/quick' 
          element={
 <QuickInsights shopId="your-shop-id" />
          }/>




              
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
