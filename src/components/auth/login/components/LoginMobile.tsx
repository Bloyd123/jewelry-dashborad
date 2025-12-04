// ============================================================================
// FILE 3: components/auth/login/components/LoginMobile.tsx
// ============================================================================

import React from 'react'

import LoginForm from './LoginForm'

const LoginMobile: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 transition-colors duration-200 dark:bg-gray-900">
      {/* Mobile Header - Fixed at top with optimal spacing */}
      <div className="flex-none px-6 pb-8 pt-12">
        {/* Brand Name with elegant spacing */}
        <h1 className="mb-8 mt-8 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Karat Log
        </h1>

        {/* Welcome Text with refined spacing */}
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>

          <p className="text-base text-gray-600 dark:text-gray-400">
            Log in to manage your business
          </p>
        </div>
      </div>

      {/* Mobile Form Container - Properly centered */}
      <div className="flex flex-1 items-center justify-center px-6 pb-6">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="flex-none bg-white px-6 py-3 text-center transition-colors duration-200 dark:bg-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Karat Log. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default LoginMobile
