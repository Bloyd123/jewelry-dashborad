// ============================================================================
// FILE: components/auth/resetpassword/ResetPasswordMobile.tsx
// ============================================================================

import React from 'react'
import { Shield } from 'lucide-react'

import ResetPasswordForm from '../components/ResetPasswordForm'

const ResetPasswordMobile: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white transition-colors duration-200 dark:bg-gray-950">
      
      {/* Mobile Header - SAME AS LOGIN */}
      <div className="flex-none px-6 pb-8 pt-12">
        {/* Icon */}
        <div className="flex justify-center mb-6 mt-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full dark:bg-amber-900">
            <Shield className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Set a New Password
          </h2>

          <p className="text-base text-gray-600 dark:text-gray-400">
            Your new password must be at least 6 characters long and secure.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-1 items-start justify-center px-6 pb-6">
        <div className="w-full max-w-md">
          <ResetPasswordForm />

          {/* ⭐ Contact Support (Added for Mobile) */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Need help?{' '}
            <button
              type="button"
              className="font-medium text-amber-500 transition-colors duration-200 hover:text-amber-600 dark:hover:text-amber-400"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordMobile;