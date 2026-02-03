// FILE: src/components/auth/2fa/Disable2FAModal.tsx
// Disable 2FA Confirmation Modal
//  UPDATED: Uses new Redux architecture and useAuth hook

import { useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Eye, EyeOff } from 'lucide-react'
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@/components/ui/overlay/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/common/Alert'
import { TwoFactorCodeInput } from './TwoFactorCodeInput'
import { Loader } from '@/components/ui/loader/Loader'

// TYPES

export interface Disable2FAModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// COMPONENT

export const Disable2FAModal: React.FC<Disable2FAModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const { handleError } = useErrorHandler()

  //  NEW: Use useAuth hook instead of direct dispatch
  const { disable2FA, isLoading } = useAuth()

  // State
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // HANDLERS

  const handleDisable = async () => {
    setError(null)

    // Validation
    if (!password) {
      setError('Password is required')
      return
    }
    if (code.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    try {
      //  NEW: Use disable2FA from useAuth hook
      const result = await disable2FA(password, code)

      if (result.success) {
        onOpenChange(false)
        onSuccess?.()

        // Reset state
        setTimeout(() => {
          setPassword('')
          setCode('')
          setError(null)
        }, 300)
      }
    } catch (err: any) {
      handleError(err, errors => {
        setError(Object.values(errors)[0] as string)
      })
    }
  }

  const handleCancel = () => {
    onOpenChange(false)

    // Reset state
    setTimeout(() => {
      setPassword('')
      setCode('')
      setError(null)
    }, 300)
  }

  // RENDER

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      closeOnOutsideClick={false}
    >
      <ModalHeader title="auth.2fa.disable2FA" />

      <ModalBody className="space-y-6">
        {/* Warning */}
        <Alert variant="warning">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>
            <p className="font-medium">{t('auth.2fa.disableWarningTitle')}</p>
            <p className="mt-1 text-xs">
              {t('auth.2fa.disableWarningMessage')}
            </p>
          </AlertDescription>
        </Alert>

        {/* Confirmation text */}
        <div className="space-y-2">
          <p className="text-sm text-text-secondary">
            {t('auth.2fa.disableConfirmText')}
          </p>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.2fa.password')}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('auth.2fa.enterPassword')}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* 2FA Code Input */}
        <div className="space-y-2">
          <Label>{t('auth.2fa.authenticatorCode')}</Label>
          <TwoFactorCodeInput
            value={code}
            onChange={setCode}
            onComplete={handleDisable}
            error={error}
          />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </ModalBody>

      <ModalFooter align="right">
        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="destructive"
          onClick={handleDisable}
          disabled={isLoading || !password || code.length !== 6}
        >
          {isLoading && <Loader size="xs" variant="spinner" />}
          {t('auth.2fa.disable2FA')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
