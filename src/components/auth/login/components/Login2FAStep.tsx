// FILE: components/auth/login/components/Login2FAStep.tsx
// Two-Factor Authentication Step for Login
// ✅ FIXED: Proper Redux integration with complete2FALogin thunk

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, ArrowLeft, Key } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { useAuth } from '@/hooks/auth'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { Button } from '@/components/ui/button'
import { TwoFactorCodeInput } from '@/components/user/UserProfile/UserprofileModal/2fa/TwoFactorCodeInput'
import { BackupCodeInput } from '@/components/user/UserProfile/UserprofileModal/2fa/BackupCodeInput'
import { Alert, AlertDescription } from '@/components/common/Alert'
import { Loader } from '@/components/ui/loader/Loader'

// ✅ FIXED: Import correct selectors and actions
import {
  setRequires2FA,
  selectIsLoading,
  selectTempToken,
} from '@/store/slices/authSlice'

export const Login2FAStep: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { handleError } = useErrorHandler()

  // ✅ FIXED: Use useAuth hook for 2FA verification (now uses thunk)
  const { verify2FALogin, verifyBackupCode } = useAuth()

  // ✅ FIXED: Get state from authSlice using selectors
  const loading = useAppSelector(selectIsLoading)
  const tempToken = useAppSelector(selectTempToken)

  const [mode, setMode] = useState<'authenticator' | 'backup'>('authenticator')
  const [code, setCode] = useState('')
  const [backupCode, setBackupCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const hasCalledRef = useRef(false)
  const isMountedRef = useRef(true)

  // ✅ FIXED: Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // ✅ FIXED: Reset hasCalledRef when code changes
  useEffect(() => {
    if (code.length < 6) {
      hasCalledRef.current = false
    }
  }, [code])

  // ✅ FIXED: Reset hasCalledRef when backup code changes
  useEffect(() => {
    if (backupCode.length < 14) {
      hasCalledRef.current = false
    }
  }, [backupCode])

  // HANDLERS

  const handleVerifyAuthenticator = async () => {
    if (code.length !== 6 || !tempToken || hasCalledRef.current || isVerifying)
      return

    hasCalledRef.current = true
    setIsVerifying(true)
    setError(null)

    try {
      // ✅ FIXED: This now calls the complete2FALogin thunk
      const result = await verify2FALogin(tempToken, code)

      if (!isMountedRef.current) return

      if (result.success) {
        // ✅ Success - Redux state updated, navigation happens automatically
        if (import.meta.env.DEV) {
          console.log('✅ [Login2FAStep] 2FA verification successful')
        }
        // Auth state is now updated - App.tsx will handle redirect
      } else {
        hasCalledRef.current = false
        setError(t('auth.2fa.invalidCode') || 'Invalid verification code')
      }
    } catch (err: any) {
      if (!isMountedRef.current) return

      hasCalledRef.current = false

      // ✅ FIXED: Proper error handling
      if (err?.message) {
        setError(err.message)
      } else {
        handleError(err, errors => {
          if (typeof errors === 'string') {
            setError(errors)
          } else if (errors && typeof errors === 'object') {
            const firstError = Object.values(errors)[0]
            setError(String(firstError))
          } else {
            setError(t('auth.2fa.verificationFailed') || 'Verification failed')
          }
        })
      }
    } finally {
      if (isMountedRef.current) {
        setIsVerifying(false)
      }
    }
  }

  const handleVerifyBackup = async () => {
    if (backupCode.length !== 14 || !tempToken || isVerifying) return

    setIsVerifying(true)
    setError(null)

    try {
      // ✅ FIXED: This now calls the complete2FALogin thunk
      const result = await verifyBackupCode(tempToken, backupCode)

      if (!isMountedRef.current) return

      if (result.success) {
        // ✅ Success - Redux state updated
        if (import.meta.env.DEV) {
          console.log('✅ [Login2FAStep] Backup code verification successful')
        }

        // ✅ FIXED: Show remaining backup codes warning if applicable
        if (result.data?.remainingBackupCodes !== undefined) {
          const remaining = result.data.remainingBackupCodes
          if (remaining <= 2) {
            console.warn(`⚠️ Only ${remaining} backup codes remaining`)
            // Optional: Show toast notification to user
          }
        }
      } else {
        setError(t('auth.2fa.invalidBackupCode') || 'Invalid backup code')
      }
    } catch (err: any) {
      if (!isMountedRef.current) return

      // ✅ FIXED: Proper error handling
      if (err?.message) {
        setError(err.message)
      } else {
        handleError(err, errors => {
          if (typeof errors === 'string') {
            setError(errors)
          } else if (errors && typeof errors === 'object') {
            const firstError = Object.values(errors)[0]
            setError(String(firstError))
          } else {
            setError(t('auth.2fa.verificationFailed') || 'Verification failed')
          }
        })
      }
    } finally {
      if (isMountedRef.current) {
        setIsVerifying(false)
      }
    }
  }

  const handleBack = () => {
    dispatch(setRequires2FA(false))
    setCode('')
    setBackupCode('')
    setError(null)
    hasCalledRef.current = false
    setIsVerifying(false)
  }

  const handleSwitchMode = () => {
    setMode(mode === 'authenticator' ? 'backup' : 'authenticator')
    setCode('')
    setBackupCode('')
    setError(null)
    hasCalledRef.current = false
    setIsVerifying(false)
  }

  // ✅ FIXED: Combined loading state
  const isLoading = loading || isVerifying

  // RENDER

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="bg-accent/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Shield className="h-8 w-8 text-accent" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-text-primary">
          {mode === 'authenticator'
            ? t('auth.2fa.twoFactorVerification')
            : t('auth.2fa.useBackupCode')}
        </h2>
        <p className="text-sm text-text-secondary">
          {mode === 'authenticator'
            ? t('auth.2fa.enterCodeFromApp')
            : t('auth.2fa.enterBackupCodeDescription')}
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6 rounded-2xl bg-bg-secondary p-8 shadow-sm">
        {mode === 'authenticator' ? (
          <>
            {/* Authenticator Code Input */}
            <div className="space-y-4">
              <TwoFactorCodeInput
                value={code}
                onChange={setCode}
                onComplete={isLoading ? undefined : handleVerifyAuthenticator}
                error={error}
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyAuthenticator}
              disabled={isLoading || code.length !== 6}
              className="w-full"
            >
              {isLoading && <Loader size="xs" variant="spinner" />}
              {t('auth.2fa.verify')}
            </Button>
          </>
        ) : (
          <>
            {/* Backup Code Input */}
            <div className="space-y-4">
              <BackupCodeInput
                value={backupCode}
                onChange={setBackupCode}
                onSubmit={handleVerifyBackup}
                error={error}
                disabled={isLoading}
                label={t('auth.2fa.backupCode')}
              />
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyBackup}
              disabled={isLoading || backupCode.length !== 14}
              className="w-full"
            >
              {isLoading && <Loader size="xs" variant="spinner" />}
              {t('auth.2fa.verify')}
            </Button>
          </>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Switch Mode */}
        <div className="space-y-2 border-t border-border-primary pt-4">
          <Button
            variant="ghost"
            onClick={handleSwitchMode}
            disabled={isLoading}
            className="w-full"
          >
            <Key className="mr-2 h-4 w-4" />
            {mode === 'authenticator'
              ? t('auth.2fa.useBackupCode')
              : t('auth.2fa.useAuthenticatorApp')}
          </Button>
        </div>

        {/* Back to Login */}
        <div className="border-t border-border-primary pt-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={isLoading}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('auth.2fa.backToLogin')}
          </Button>
        </div>

        {/* Helper Info */}
        <Alert variant="info">
          <AlertDescription>
            <p className="text-xs">
              {mode === 'authenticator'
                ? t('auth.2fa.authenticatorHint')
                : t('auth.2fa.backupCodeHint')}
            </p>
          </AlertDescription>
        </Alert>
      </div>

      {/* Footer Help */}
      <div className="mt-6 text-center">
        <p className="text-xs text-text-tertiary">
          {t('auth.2fa.havingTrouble')}{' '}
          <button className="text-accent hover:underline">
            {t('auth.2fa.contactSupport')}
          </button>
        </p>
      </div>
    </div>
  )
}
