// FILE: src/components/user/UserForm/sections/BasicInfoSection.tsx
// Basic Information Section - Username, Email, Password, Name

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { FormSectionProps } from '../UserForm.types'
import { validatePasswordStrength } from '@/validators/userValidator'

export const BasicInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password strength indicator
  const passwordStrength = data.password
    ? validatePasswordStrength(data.password)
    : null

  const getStrengthColor = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'weak':
        return 'text-status-error'
      case 'medium':
        return 'text-status-warning'
      case 'strong':
        return 'text-status-success'
    }
  }

  return (
    <div className="space-y-4">
      {/* Username */}
      <FormInput
        name="username"
        label={t('user.username')}
        value={data.username || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.username}
        placeholder={t('user.usernamePlaceholder')}
        required
        disabled={disabled}
        maxLength={30}
        helpText={t('user.usernameHelpText')}
      />

      {/* Email */}
      <FormInput
        name="email"
        label={t('user.email')}
        type="email"
        value={data.email || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.email}
        placeholder={t('user.emailPlaceholder')}
        required
        disabled={disabled}
      />

      {/* Password */}
      <div className="relative">
        <FormInput
          name="password"
          label={t('user.password')}
          type={showPassword ? 'text' : 'password'}
          value={data.password || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.password}
          placeholder={t('user.passwordPlaceholder')}
          required
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-text-tertiary hover:text-text-primary"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>

        {/* Password Strength Indicator */}
        {passwordStrength && data.password && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-bg-tertiary">
                <div
                  className={`h-full transition-all ${
                    passwordStrength.strength === 'weak'
                      ? 'w-1/3 bg-status-error'
                      : passwordStrength.strength === 'medium'
                      ? 'w-2/3 bg-status-warning'
                      : 'w-full bg-status-success'
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium ${getStrengthColor(
                  passwordStrength.strength
                )}`}
              >
                {t(`user.passwordStrength.${passwordStrength.strength}`)}
              </span>
            </div>
            {passwordStrength.feedback.length > 0 && (
              <div className="flex items-start gap-1 text-xs text-text-tertiary">
                <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                <span>{passwordStrength.feedback[0]}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <FormInput
          name="confirmPassword"
          label={t('user.confirmPassword')}
          type={showConfirmPassword ? 'text' : 'password'}
          value={data.confirmPassword || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.confirmPassword}
          placeholder={t('user.confirmPasswordPlaceholder')}
          required
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-text-tertiary hover:text-text-primary"
          tabIndex={-1}
        >
          {showConfirmPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>

        {/* Password Match Indicator */}
        {data.password &&
          data.confirmPassword &&
          data.password === data.confirmPassword && (
            <div className="mt-2 flex items-center gap-1 text-xs text-status-success">
              <CheckCircle2 className="h-3 w-3" />
              <span>{t('user.passwordsMatch')}</span>
            </div>
          )}
      </div>

      {/* First Name */}
      <FormInput
        name="firstName"
        label={t('user.firstName')}
        value={data.firstName || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.firstName}
        placeholder={t('user.firstNamePlaceholder')}
        required
        disabled={disabled}
        maxLength={50}
      />

      {/* Last Name */}
      <FormInput
        name="lastName"
        label={t('user.lastName')}
        value={data.lastName || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.lastName}
        placeholder={t('user.lastNamePlaceholder')}
        disabled={disabled}
        maxLength={50}
      />
    </div>
  )
}