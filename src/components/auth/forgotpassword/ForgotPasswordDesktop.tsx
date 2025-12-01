// ============================================================================
// FILE: components/auth/forgotpassword/ForgotPasswordDesktop.tsx
// ============================================================================

import React from 'react'

import forgotPasswordImage from '../../../assets/images/Loginimage.png'

import ForgotPasswordForm from './ForgotPasswordForm'

const ForgotPasswordDesktop: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image Section */}
      <div className="sticky top-0 hidden h-screen overflow-hidden lg:flex lg:w-1/2">
        <img
          src={forgotPasswordImage}
          alt="Jewelry crafting"
          className="h-full w-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
      </div>

      {/* Right Side - Forgot Password Form Section */}
      <div className="flex w-full items-center justify-center bg-stone-50 px-8 py-12 transition-colors duration-200 dark:bg-gray-900 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo & Brand Section */}
          <div className="mb-8 flex items-center justify-center">
            <div className="flex flex-col items-center">
              {/* Brand Name */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                KaratLog
              </h1>
              {/* Forgot Password Header */}
              <div className="mb-10 text-center">
                <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                  Forgot Your Password?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your email below to receive a password reset link.
                </p>
              </div>
            </div>
          </div>

          {/* Forgot Password Form */}
          <div className="rounded-2xl p-8 transition-colors duration-200 dark:bg-gray-800">
            <ForgotPasswordForm />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Karat Log. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordDesktop