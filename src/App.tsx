// ============================================================================
// FILE: src/App.tsx
// Root Application Component
// ============================================================================

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store'
import { getCurrentUserAction } from './store/slices/authSlice'
import { setTheme } from './store/slices/uiSlice'
// import AppRouter from './router/AppRouter'

function App() {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { theme } = useAppSelector((state) => state.ui)

  // ============================================
  // INITIALIZE APP
  // ============================================
  useEffect(() => {
    // Check if user is already logged in (on app load)
    if (isAuthenticated) {
      dispatch(getCurrentUserAction())
    }

    // Apply saved theme
    dispatch(setTheme(theme))
  }, [])

  // ============================================
  // RENDER
  // ============================================
  // return <AppRouter />
  return(
    <>
    <h1>Hello</h1>
    </>
  )
}

export default App