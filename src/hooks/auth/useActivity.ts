// 
// FILE: hooks/auth/useActivity.ts
// Activity Tracking - trackActivity / useActivityTracking
// 

import { useCallback, useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updateLastActivity } from '@/store/slices/authSlice'
import { useIsAuthenticated } from './useAuthState'

// 
// ACTIVITY ACTION HOOK
// 

export const useActivityAction = () => {
  const dispatch = useAppDispatch()

  const trackActivity = useCallback(() => {
    dispatch(updateLastActivity())
  }, [dispatch])

  return {
    trackActivity,
  }
}

// 
// ACTIVITY TRACKING HOOK
// 

export const useActivityTracking = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useIsAuthenticated()

  useEffect(() => {
    if (!isAuthenticated) return

    const handleActivity = () => {
      dispatch(updateLastActivity())
    }

    const events = ['click', 'keypress', 'scroll', 'mousemove']
    events.forEach(event => {
      window.addEventListener(event, handleActivity)
    })

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated, dispatch])
}