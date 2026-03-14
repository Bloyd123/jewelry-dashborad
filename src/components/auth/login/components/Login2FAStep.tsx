// FILE: components/auth/login/components/Login2FAStep.tsx

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

import {
  setRequires2FA,
  selectIsLoading,
  selectTempToken,
} from '@/store/slices/authSlice'

export const Login2FAStep: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { handleError } = useErrorHandler()

  const { verify2FALogin, verifyBackupCode } = useAuth()

  const loading = useAppSelector(selectIsLoading)
  const tempToken = useAppSelector(selectTempToken)

  const [mode, setMode] = useState<'authenticator' | 'backup'>('authenticator')
  const [code, setCode] = useState('')
  const [backupCode, setBackupCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const hasCalledRef = useRef(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (code.length < 6) {
      hasCalledRef.current = false
    }
  }, [code])

  useEffect(() => {
    if (backupCode.length < 14) {
      hasCalledRef.current = false
    }
  }, [backupCode])

  const handleVerifyAuthenticator = async () => {
    if (code.length !== 6 || !tempToken || hasCalledRef.current || isVerifying)
      return

    hasCalledRef.current = true
    setIsVerifying(true)
    setError(null)

    try {
      const result = await verify2FALogin(tempToken, code)

      if (!isMountedRef.current) return

      if (result.success) {
        if (import.meta.env.DEV) {
          console.log('✅ [Login2FAStep] 2FA verification successful')
        }
      } else {
        hasCalledRef.current = false
        setError(t('auth.2fa.invalidCode') || 'Invalid verification code')
      }
    } catch (err: any) {
      if (!isMountedRef.current) return

      hasCalledRef.current = false

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
      const result = await verifyBackupCode(tempToken, backupCode)

      if (!isMountedRef.current) return

      if (result.success) {
        if (import.meta.env.DEV) {
          console.log('✅ [Login2FAStep] Backup code verification successful')
        }

        if (result.data?.remainingBackupCodes !== undefined) {
          const remaining = result.data.remainingBackupCodes
          if (remaining <= 2) {
            console.warn(`⚠️ Only ${remaining} backup codes remaining`)
          }
        }
      } else {
        setError(t('auth.2fa.invalidBackupCode') || 'Invalid backup code')
      }
    } catch (err: any) {
      if (!isMountedRef.current) return

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

  const isLoading = loading || isVerifying

  return (
    <div className="w-full max-w-md">
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

      <div className="space-y-6 rounded-2xl bg-bg-secondary p-8 shadow-sm">
        {mode === 'authenticator' ? (
          <>
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

        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
