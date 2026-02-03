//
// FILE: hooks/auth/useAuthInitialization.ts
// Auth Initialization - Effect hook for initializing auth on app start
//

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { initializeAuth, selectAuth } from '@/store/slices/authSlice'

//
// AUTH INITIALIZATION HOOK
//

export const useAuthInitialization = () => {
  const dispatch = useAppDispatch()
  const { isInitializing } = useAppSelector(selectAuth)

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(initializeAuth()).unwrap()
      } catch (error) {
        console.error('Auth initialization failed:', error)
      }
    }

    init()
  }, [dispatch])

  return { isInitializing }
}
