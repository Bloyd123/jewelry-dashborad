// FILE: components/auth/resetpassword/pages/index.tsx

import React, { useEffect, useState } from 'react'

import ResetPasswordDesktop from '../components/ResetPasswordDesktop'
import ResetPasswordMobile from '../components/ResetPasswordMobile'

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
