// ============================================================================
// FILE 1: components/auth/login/pages/index.tsx
// ============================================================================

import React, { useEffect, useState } from 'react'

import LoginDesktop from '../components/LoginDesktop'
import LoginMobile from '../components/LoginMobile'

const LoginPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return isMobile ? <LoginMobile /> : <LoginDesktop />
}

export default LoginPage
