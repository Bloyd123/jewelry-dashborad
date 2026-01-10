// FILE: components/auth/forgotpassword/components/ForgotPasswordForm.tsx

import React, { useState, useCallback } from 'react'
import { Mail, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes.config'
import { useAuth } from '@/hooks/useAuth'
import { useNotification } from '@/hooks/useNotification'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useTranslation } from 'react-i18next'
import type {
  ForgotPasswordFormState,
  ForgotPasswordRequest,
} from '@/types/auth.types'
import { validateForgotPasswordForm } from '@/validators/forgotPasswordValidation'

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotification()
  const { forgotPassword } = useAuth()

  const { handleError } = useErrorHandler()
  const { t } = useTranslation()
  // Form State
  const [formData, setFormData] = useState<ForgotPasswordFormState>({
    email: '',
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = useCallback((): boolean => {
    const result = validateForgotPasswordForm(formData)
    setErrors(result.errors)
    return result.isValid
  }, [formData])

  // Handle Input Change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      setFormData(prev => ({
        ...prev,
        email: value,
      }))

      // Clear error for this field
      if (errors.email) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.email
          return newErrors
        })
      }
    },
    [errors]
  )

  // Handle Submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) {
        showError('Please fix the form errors')
        return
      }

      setLoading(true)

      try {
        const forgotPasswordData: ForgotPasswordRequest = {
          email: formData.email.trim(),
        }
        await forgotPassword(forgotPasswordData)
        showSuccess(
          t('auth.forgotPassword.success'),
          t('auth.forgotPassword.title')
        )
        navigate(ROUTES.login)
      } catch (error: any) {
        handleError(error, setErrors)
      } finally {
        setLoading(false)
      }
    },
    [formData, validateForm, forgotPassword, showSuccess, showError, navigate]
  )

  // Handle Back to Login
  const handleBackToLogin = useCallback(() => {
    navigate(ROUTES.login)
  }, [navigate])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email Address
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            placeholder="Enter your email"
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full transform rounded-lg bg-amber-500 py-3.5 font-semibold text-white transition-all duration-200 hover:scale-[1.01] hover:bg-amber-600 active:scale-[0.99] active:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300 dark:disabled:bg-amber-700"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Sending...
          </div>
        ) : (
          'Send Reset Link'
        )}
      </button>

      {/* Back to Login Link */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleBackToLogin}
          disabled={loading}
          className="inline-flex items-center text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </button>
      </div>
    </form>
  )
}

export default ForgotPasswordForm
