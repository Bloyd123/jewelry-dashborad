// ============================================================================
// FILE: components/auth/resetpassword/ResetPasswordForm.tsx
// ============================================================================

import React, { useState, useCallback, useEffect } from 'react'
import { Eye, EyeOff, Lock, Shield } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import { useNotification } from '@/hooks/useNotification'
import type { ResetPasswordRequest, ResetPasswordFormState } from '@/types/auth.types'
import { validateResetPasswordForm } from '@/validators/resetPasswordValidation'
import { ValidationError, ApiError } from '@/utils/errors'

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()
  const { showSuccess, showError } = useNotification()
  const { resetPassword } = useAuth()

  // Form State
  const [formData, setFormData] = useState<ResetPasswordFormState>({
    token: token || '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak')

  // Update token if URL parameter changes
  useEffect(() => {
    if (token) {
      setFormData(prev => ({ ...prev, token }))
    }
  }, [token])

  // Password strength calculator
  const calculatePasswordStrength = useCallback((password: string) => {
    if (password.length === 0) return 'weak'
    
    let strength = 0
    
    // Length check
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    
    if (strength <= 2) return 'weak'
    if (strength <= 4) return 'medium'
    return 'strong'
  }, [])

  const validateForm = useCallback((): boolean => {
    const result = validateResetPasswordForm(formData)
    setErrors(result.errors)
    return result.isValid
  }, [formData])

  // Handle Input Change
  const handleInputChange = useCallback(
    (field: keyof ResetPasswordFormState) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        setFormData(prev => ({
          ...prev,
          [field]: value,
        }))

        // Update password strength for new password
        if (field === 'newPassword') {
          setPasswordStrength(calculatePasswordStrength(value))
        }

        // Clear error for this field
        if (errors[field]) {
          setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
          })
        }
      },
    [errors, calculatePasswordStrength]
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
        const resetData: ResetPasswordRequest = {
          token: formData.token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }

        await resetPassword(resetData)

        showSuccess('Password reset successful!', 'You can now login with your new password')
        
        // Navigate to login after short delay
        setTimeout(() => {
          navigate('/auth/login')
        }, 2000)
      } catch (error: any) {
        // Validation errors (422)
        if (error instanceof ValidationError) {
          setErrors(error.validationErrors)
          showError(error.message, 'Validation Failed')
          return
        }

        // Generic API error
        if (error instanceof ApiError) {
          showError(error.message, 'Error')
          return
        }

        // Fallback (network, unknown)
        showError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [formData, validateForm, resetPassword, showSuccess, showError, navigate]
  )



  // Get password strength color and label
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-yellow-500'
      case 'medium':
        return 'bg-yellow-600'
      case 'strong':
        return 'bg-green-500'
      default:
        return 'bg-gray-300'
    }
  }

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'w-1/3'
      case 'medium':
        return 'w-2/3'
      case 'strong':
        return 'w-full'
      default:
        return 'w-0'
    }
  }

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'Weak'
      case 'medium':
        return 'Medium'
      case 'strong':
        return 'Strong'
      default:
        return ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* New Password Field */}
      <div>
        <label
          htmlFor="newPassword"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          New Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleInputChange('newPassword')}
            disabled={loading}
            placeholder="Enter your new password"
            autoComplete="new-password"
            className={`w-full border bg-white py-3 pl-12 pr-12 dark:bg-gray-900 ${
              errors.newPassword
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-700'
            } rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:placeholder-gray-600`}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            disabled={loading}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
          >
            {showNewPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.newPassword && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                <div
                  className={`h-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
                ></div>
              </div>
              <span className="ml-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                {getStrengthLabel()}
              </span>
            </div>
          </div>
        )}

        {errors.newPassword && (
          <p className="mt-2 flex items-center text-sm text-red-500 dark:text-red-400">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
            {errors.newPassword}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Confirm New Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            disabled={loading}
            placeholder="Confirm your new password"
            autoComplete="new-password"
            className={`w-full border bg-white py-3 pl-12 pr-12 dark:bg-gray-900 ${
              errors.confirmPassword
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-700'
            } rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:placeholder-gray-600`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-2 flex items-center text-sm text-red-500 dark:text-red-400">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Reset Password Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full transform rounded-lg bg-amber-500 py-3.5 font-semibold text-white transition-all duration-200 hover:scale-[1.01] hover:bg-amber-600 active:scale-[0.99] active:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300 dark:disabled:bg-amber-700"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Resetting Password...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Shield className="mr-2 h-5 w-5" />
            Reset Password
          </div>
        )}
      </button>

    </form>
  )
}

export default ResetPasswordForm