// ============================================================================
// FILE 1: components/auth/forgotpassword/pages/index.tsx
// ============================================================================

import React, { useEffect, useState } from 'react'

import ForgotPasswordDesktop from '../components/ForgotPasswordDesktop'
import ForgotPasswordMobile from '../components/ForgotPasswordMobile'

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
