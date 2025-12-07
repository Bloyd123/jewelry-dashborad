// ============================================================================
// FILE: components/common/NoInternetWrapper.tsx
// Wrapper Component to Check Internet Connection
// ============================================================================

import { useState, useEffect, ReactNode } from 'react'
import { NoInternet } from './NoInternet'

interface NoInternetWrapperProps {
  children: ReactNode
}

export const NoInternetWrapper = ({ children }: NoInternetWrapperProps) => {
  const [isOnline, setIsOnline] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const checkInternetConnection = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      setIsOnline(response.ok)
    } catch (error) {
      setIsOnline(false)
    }
  }

  useEffect(() => {
    setIsMounted(true)

    const handleOnline = () => checkInternetConnection()
    const handleOffline = () => setIsOnline(false)

    // Initial check
    if (navigator.onLine) {
      checkInternetConnection()
    } else {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isMounted) {
    return null
  }

  return isOnline ? (
    <>{children}</>
  ) : (
    <NoInternet checkInternetConnection={checkInternetConnection} />
  )
}
