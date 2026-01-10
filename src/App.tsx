// FILE: src/App.tsx
// Clean Main Application Component

import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router'
import ToastContainer from './components/common/ToastContainer'
import { NotificationProvider } from './context/NotificationContext'
import { NoInternetWrapper } from './components/common'
import { useAppDispatch } from './store/hooks'
import { initializeAuth } from './store/slices/authSlice'
import { useThemeSync } from './hooks/useThemeSync'

function App() {
  const dispatch = useAppDispatch()

  // Sync theme with system preferences
  useThemeSync()

  // Initialize authentication state on app mount
  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  return (
    <NoInternetWrapper>
      <BrowserRouter>
        <NotificationProvider>
          <AppRouter />
          <ToastContainer />
        </NotificationProvider>
      </BrowserRouter>
    </NoInternetWrapper>
  )
}

export default App
