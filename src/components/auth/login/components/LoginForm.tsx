// FILE: components/auth/login/components/LoginForm.tsx
// ✅ FIXED: Proper Redux integration and 2FA handling

import React, { useState, useCallback } from 'react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks/base'
import { ROUTES } from '@/config/routes.config'
import { useAuth } from '@/hooks/auth'
import { useNotification } from '@/hooks/useNotification'
import type { LoginRequest, LoginFormState } from '@/types/auth.types'
import { validateLoginForm } from '@/validators/loginValidation'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useTranslation } from 'react-i18next'

// ✅ FIXED: Import correct selectors
import { selectRequires2FA, selectIsLoading } from '@/store/slices/authSlice'

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotification()
  const { login } = useAuth()
  const { t } = useTranslation()
  const { handleError } = useErrorHandler()

  // ✅ FIXED: Get 2FA state from Redux using selector
  const requires2FA = useAppSelector(selectRequires2FA)
  const isAuthLoading = useAppSelector(selectIsLoading)

  // Form State
  const [formData, setFormData] = useState<LoginFormState>({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = useCallback((): boolean => {
    const result = validateLoginForm(formData)
    setErrors(result.errors)
    return result.isValid
  }, [formData])

  // Handle Input Change
  const handleInputChange = useCallback(
    (field: keyof LoginFormState) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = field === 'rememberMe' ? e.target.checked : e.target.value

        setFormData(prev => ({
          ...prev,
          [field]: value,
        }))

        // Clear error for this field
        if (errors[field]) {
          setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
          })
        }
      },
    [errors]
  )

  // ✅ FIXED: Handle Submit with proper 2FA flow
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) {
        showError(t('errors.validation.fixFormErrors'))
        return
      }

      setLoading(true)
      setErrors({}) // Clear previous errors

      try {
        const loginData: LoginRequest = {
          email: formData.email.trim(),
          password: formData.password,
          rememberMe: formData.rememberMe,
        }

        if (import.meta.env.DEV) {
          console.log('📝 [LoginForm] Submitting login for:', loginData.email)
        }

        const result = await login(loginData)

        if (import.meta.env.DEV) {
          console.log('📝 [LoginForm] Login result:', result)
          console.log('📝 [LoginForm] requires2FA:', requires2FA)
        }

        // ✅ FIXED: Proper 2FA check from Redux state
        if (requires2FA) {
          // 2FA is required - LoginPage component will handle showing 2FA step
          if (import.meta.env.DEV) {
            console.log('🔐 [LoginForm] 2FA required - waiting for verification')
          }
          // Don't show success message or navigate - let 2FA step handle it
        } else {
          // ✅ FIXED: Login successful without 2FA
          if (import.meta.env.DEV) {
            console.log('✅ [LoginForm] Login successful - navigating to dashboard')
          }
          
          showSuccess(
            t('auth.login.success') || 'Login Successful',
            t('auth.login.welcomeBack') || 'Welcome back!'
          )
          
          // Navigate to dashboard or intended route
          navigate(ROUTES.dashboard, { replace: true })
        }
      } catch (error: any) {
        console.error('❌ [LoginForm] Login error:', error)
        
        // ✅ FIXED: Proper error handling
        handleError(error, (validationErrors) => {
          if (typeof validationErrors === 'string') {
            // Single error message
            showError(validationErrors)
          } else if (validationErrors && typeof validationErrors === 'object') {
            // Validation errors object
            setErrors(validationErrors as Record<string, string>)
            
            // Show first error as notification
            const firstError = Object.values(validationErrors)[0]
            if (firstError) {
              showError(String(firstError))
            }
          } else {
            // Generic error
            showError(t('auth.login.error') || 'Login failed. Please try again.')
          }
        })
      } finally {
        setLoading(false)
      }
    },
    [
      formData,
      validateForm,
      login,
      requires2FA,
      showSuccess,
      showError,
      navigate,
      t,
      handleError,
    ]
  )

  // Handle Forgot Password
  const handleForgotPassword = useCallback(() => {
    navigate(ROUTES.forgotPassword)
  }, [navigate])

  // Handle Sign Up
  const handleSignUp = useCallback(() => {
    navigate(ROUTES.signup)
  }, [navigate])

  // ✅ FIXED: Combined loading state
  const isLoading = loading || isAuthLoading

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t('auth.login.email') || 'Email'}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            disabled={isLoading}
            placeholder={t('auth.login.emailPlaceholder') || 'Enter your email'}
            autoComplete="email"
            className={`w-full border bg-white py-3 pl-12 pr-4 dark:bg-gray-900 ${
              errors.email 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-700'
            } rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:placeholder-gray-600`}
          />
        </div>
        {errors.email && (
          <p className="mt-2 flex items-center text-sm text-red-500 dark:text-red-400">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t('auth.login.password') || 'Password'}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange('password')}
            disabled={isLoading}
            placeholder={t('auth.login.passwordPlaceholder') || 'Enter your password'}
            autoComplete="current-password"
            className={`w-full border bg-white py-3 pl-12 pr-12 dark:bg-gray-900 ${
              errors.password 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-700'
            } rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:placeholder-gray-600`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 flex items-center text-sm text-red-500 dark:text-red-400">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleInputChange('rememberMe')}
            disabled={isLoading}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-white text-amber-500 focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900"
          />
          <span className="ml-2 select-none text-sm text-gray-600 dark:text-gray-400">
            {t('auth.login.rememberMe') || 'Remember me'}
          </span>
        </label>

        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isLoading}
          className="text-sm font-medium text-amber-500 transition-colors duration-200 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-amber-400"
        >
          {t('auth.login.forgotPassword') || 'Forgot Password?'}
        </button>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full transform rounded-lg bg-amber-500 py-3.5 font-semibold text-white transition-all duration-200 hover:scale-[1.01] hover:bg-amber-600 active:scale-[0.99] active:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300 dark:disabled:bg-amber-700"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            {t('auth.login.loggingIn') || 'Logging in...'}
          </div>
        ) : (
          t('auth.login.submit') || 'Log In'
        )}
      </button>

      {/* Sign Up Link */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t('auth.login.noAccount') || "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={handleSignUp}
          disabled={isLoading}
          className="font-medium text-amber-500 transition-colors duration-200 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-amber-400"
        >
          {t('auth.login.signUp') || 'Sign Up'}
        </button>
      </div>
    </form>
  )
}

export default LoginForm