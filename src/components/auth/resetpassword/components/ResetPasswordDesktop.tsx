// FILE: components/auth/resetpassword/components/ResetPasswordDesktop.tsx

import React from 'react'
import { Shield } from 'lucide-react'

import ResetPasswordForm from './ResetPasswordForm'
import resetPasswordImage from '../../../../assets/images/Loginimage.png'

const ResetPasswordDesktop: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Full Image (Like LoginDesktop) */}
      <div className="sticky top-0 hidden h-screen overflow-hidden lg:flex lg:w-1/2">
        <img
          src={resetPasswordImage}
          alt="Reset Password"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
      </div>

      {/* Right Side - Form + Heading */}
      <div className="flex w-full items-center justify-center bg-white p-8 dark:bg-gray-950 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* ⭐ Top Header (shifted from form to desktop) */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
              <Shield className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Set a New Password
            </h2>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your new password must be at least 6 characters long and include
              an uppercase letter, lowercase letter, and a number.
            </p>
          </div>

          {/* Form */}
          <ResetPasswordForm />

          {/* Contact Support (also moved here) */}
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

export default ResetPasswordDesktop
