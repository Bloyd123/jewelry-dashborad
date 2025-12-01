// ============================================================================
// FILE 1: components/auth/forgotpassword/index.tsx
// ============================================================================

import React, { useEffect, useState } from 'react'

import ForgotPasswordDesktop from './ForgotPasswordDesktop'
import ForgotPasswordMobile from './ForgotPasswordMobile'

const ForgotPasswordPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return isMobile ? <ForgotPasswordMobile /> : <ForgotPasswordDesktop />
}

export default ForgotPasswordPage