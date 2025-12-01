// ============================================================================
// FILE: components/auth/resetpassword/index.tsx
// ============================================================================

import React, { useEffect, useState } from 'react'

import ResetPasswordDesktop from './ResetPasswordDesktop'
import ResetPasswordMobile from './ResetPasswordMobile'

const ResetPasswordPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return isMobile ? <ResetPasswordMobile /> : <ResetPasswordDesktop />
}

export default ResetPasswordPage