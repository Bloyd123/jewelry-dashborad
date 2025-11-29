// ============================================================================
// FILE: App.tsx
// Main Application Component
// ============================================================================

import { useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { initializeAuth } from './store/slices/authSlice';
import { setTheme } from './store/slices/uiSlice';
import { NotificationProvider } from './context/NotificationContext';
import ToastContainer from './components/common/ToastContainer';

// // Layouts
// import MainLayout from './layouts/MainLayout';
// import AuthLayout from './layouts/AuthLayout';

// // Public Pages
// import LoginPage from './pages/auth/LoginPage';
// import RegisterPage from './pages/auth/RegisterPage';
// import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
// import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// // Protected Pages
// import DashboardPage from './pages/DashboardPage';
// import ProfilePage from './pages/ProfilePage';
// import SettingsPage from './pages/SettingsPage';

// // Shop Pages
// import ShopsPage from './pages/shops/ShopsPage';
// import ShopDetailsPage from './pages/shops/ShopDetailsPage';
// import CreateShopPage from './pages/shops/CreateShopPage';

// // Components
// import LoadingScreen from './components/common/LoadingScreen';
// import ProtectedRoute from './components/auth/ProtectedRoute';
// import NotFoundPage from './pages/NotFoundPage';

// ============================================================================
// APP COMPONENT
// ============================================================================

function App() {
  const dispatch = useAppDispatch();
  // const { isInitializing, isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);

  // ========================================
  // Initialize App
  // ========================================
  useEffect(() => {
    // Initialize authentication state
    dispatch(initializeAuth());

    // Apply theme
    dispatch(setTheme(theme));

    // Handle system theme changes in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'auto') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [dispatch, theme]);

  // ========================================
  // Show Loading Screen During Initialization
  // ========================================
  // if (isInitializing) {
  //   return <LoadingScreen message="Loading application..." />;
  // }

  // ========================================
  // Render Routes
  // ========================================
  return (
    
    // <BrowserRouter>
    //   <Routes>
    //     {/* ========================================
    //         PUBLIC ROUTES (Auth Pages)
    //         ======================================== */}
    //     <Route element={<AuthLayout />}>
    //       <Route
    //         path="/login"
    //         element={
    //           isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
    //         }
    //       />
    //       <Route
    //         path="/register"
    //         element={
    //           isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
    //         }
    //       />
    //       <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    //       <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    //     </Route>

    //     {/* ========================================
    //         PROTECTED ROUTES (Main App)
    //         ======================================== */}
    //     <Route
    //       element={
    //         <ProtectedRoute>
    //           <MainLayout />
    //         </ProtectedRoute>
    //       }
    //     >
    //       {/* Dashboard */}
    //       <Route path="/dashboard" element={<DashboardPage />} />

    //       {/* Profile & Settings */}
    //       <Route path="/profile" element={<ProfilePage />} />
    //       <Route path="/settings" element={<SettingsPage />} />

    //       {/* Shops */}
    //       <Route path="/shops" element={<ShopsPage />} />
    //       <Route path="/shops/create" element={<CreateShopPage />} />
    //       <Route path="/shops/:shopId" element={<ShopDetailsPage />} />

    //       {/* Add more protected routes here */}
    //       {/* <Route path="/inventory" element={<InventoryPage />} /> */}
    //       {/* <Route path="/orders" element={<OrdersPage />} /> */}
    //       {/* <Route path="/customers" element={<CustomersPage />} /> */}
    //     </Route>

    //     {/* ========================================
    //         DEFAULT & ERROR ROUTES
    //         ======================================== */}
    //     <Route
    //       path="/"
    //       element={
    //         isAuthenticated ? (
    //           <Navigate to="/dashboard" replace />
    //         ) : (
    //           <Navigate to="/login" replace />
    //         )
    //       }
    //     />
    //     <Route path="/404" element={<NotFoundPage />} />
    //     <Route path="*" element={<Navigate to="/404" replace />} />
    //   </Routes>
    // </BrowserRouter>
    <>
       <NotificationProvider>
          <h1>Hello</h1>
          <ToastContainer />
       </NotificationProvider>
    </>
  );
}

export default App;