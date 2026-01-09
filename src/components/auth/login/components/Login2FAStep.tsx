// FILE: components/auth/login/components/Login2FAStep.tsx
// Two-Factor Authentication Step for Login

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, ArrowLeft, Key } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks/base'
import {
  verify2FALogin,
  verifyBackupCodeLogin,
  setRequires2FA,
} from '@/store/slices/authSlice'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { Button } from '@/components/ui/button'
import { TwoFactorCodeInput } from '@/components/UserProfile/UserprofileModal/2fa/TwoFactorCodeInput'
import { BackupCodeInput } from '@/components/UserProfile/UserprofileModal/2fa/BackupCodeInput'
import { Alert, AlertDescription } from '@/components/common/Alert'
import { Loader } from '@/components/ui/loader/Loader'

export const Login2FAStep: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { handleError } = useErrorHandler()

  const loading = useAppSelector(state => state.auth.isLoading)
  const tempToken = useAppSelector(state => state.auth.tempToken)

  const [mode, setMode] = useState<'authenticator' | 'backup'>('authenticator')
  const [code, setCode] = useState('')
  const [backupCode, setBackupCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const hasCalledRef = useRef(false)

  // Reset hasCalledRef when code changes
  useEffect(() => {
    if (code.length < 6) {
      hasCalledRef.current = false
    }
  }, [code])

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleVerifyAuthenticator = async () => {
    if (code.length !== 6 || !tempToken || hasCalledRef.current) return

    hasCalledRef.current = true
    setError(null)

    try {
      await dispatch(verify2FALogin({ tempToken, token: code })).unwrap()
      // Success - Redux will handle auth state
    } catch (err: any) {
      hasCalledRef.current = false
      handleError(err, errors => {
        setError(Object.values(errors)[0] as string)
      })
    }
  }

  const handleVerifyBackup = async () => {
    if (backupCode.length !== 14 || !tempToken) return

    setError(null)

    try {
      await dispatch(verifyBackupCodeLogin({ tempToken, backupCode })).unwrap()
      // Success - Redux will handle auth state
    } catch (err: any) {
      handleError(err, errors => {
        setError(Object.values(errors)[0] as string)
      })
    }
  }

  const handleBack = () => {
    dispatch(setRequires2FA(false))
    setCode('')
    setBackupCode('')
    setError(null)
  }

  const handleSwitchMode = () => {
    setMode(mode === 'authenticator' ? 'backup' : 'authenticator')
    setCode('')
    setBackupCode('')
    setError(null)
    hasCalledRef.current = false
  }

  // ========================================================================
  // RENDER
  // ========================================================================

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
                onComplete={loading ? undefined : handleVerifyAuthenticator}
                error={error}
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyAuthenticator}
              disabled={loading || code.length !== 6}
              className="w-full"
            >
              {loading && <Loader size="xs" variant="spinner" />}
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
                disabled={loading}
                label={t('auth.2fa.backupCode')}
              />
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyBackup}
              disabled={loading || backupCode.length !== 14}
              className="w-full"
            >
              {loading && <Loader size="xs" variant="spinner" />}
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
            disabled={loading}
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
            disabled={loading}
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
