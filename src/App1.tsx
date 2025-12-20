// // ============================================================================
// // FILE: App.tsx
// // Main Application Component with Router
// // ============================================================================
// import { useEffect } from 'react'
// import { BrowserRouter } from 'react-router-dom'
// import AppRouter from './router/AppRouter'
// import ToastContainer from './components/common/ToastContainer'
// import { NotificationProvider } from './context/NotificationContext'
// import { useAppDispatch } from './store/hooks'
// import { initializeAuth } from './store/slices/authSlice'
// import { useThemeSync } from './hooks/useThemeSync'
// import { NoInternetWrapper } from './components/common'

// // ============================================================================
// // APP COMPONENT
// // ============================================================================
// function App() {
//   const dispatch = useAppDispatch()
//   useThemeSync()

//   // ========================================
//   // Initialize App
//   // ========================================
//   useEffect(() => {
//     // Initialize authentication state
//     dispatch(initializeAuth())
//   }, [dispatch])

//   // ========================================
//   // Render Application
//   // ========================================
//   return (
//     <NoInternetWrapper>
//       <BrowserRouter>
//         <NotificationProvider>
//           <AppRouter />
//           <ToastContainer />
//         </NotificationProvider>
//       </BrowserRouter>
//     </NoInternetWrapper>
//   )
// }

// export default App
