// ============================================================================
// FILE: components/auth/forgotpassword/components/ForgotPasswordMobile.tsx
// ============================================================================

import React from 'react'

import ForgotPasswordForm from './ForgotPasswordForm'

const ForgotPasswordMobile: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8 transition-colors duration-200 dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Logo & Brand Section */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex flex-col items-center">
            {/* Brand Name */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              KaratLog
            </h1>
            {/* Forgot Password Header */}
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Forgot Your Password?
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your email below to receive a password reset link.
              </p>
            </div>
          </div>
        </div>

        {/* Forgot Password Form */}
        <div className="rounded-2xl p-6 transition-colors duration-200 dark:bg-gray-800">
          <ForgotPasswordForm />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Karat Log. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordMobile