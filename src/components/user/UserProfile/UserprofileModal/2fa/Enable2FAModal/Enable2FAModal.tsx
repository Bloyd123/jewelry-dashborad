// FILE: src/components/auth/2fa/Enable2FAModal/Enable2FAModal.tsx
// Enable 2FA Modal - Main Container with Step Navigation

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, ModalHeader } from '@/components/ui/overlay/Modal'
import { Step1Introduction } from './Step1Introduction'
import { Step2QRCode } from './Step2QRCode'
import { Step3VerifyCode } from './Step3VerifyCode'
import { Step4BackupCodes } from './Step4BackupCodes'
import { useAppDispatch, useAppSelector } from '@/store/hooks/base'
import { enable2FA, verify2FA } from '@/store/slices/authSlice'
import { useErrorHandler } from '@/hooks/useErrorHandler'

// TYPES

export interface Enable2FAModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

type Step = 1 | 2 | 3 | 4

// COMPONENT

export const Enable2FAModal: React.FC<Enable2FAModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { handleError } = useErrorHandler()
  const loading = useAppSelector(state => state.auth.isLoading)

  const [step, setStep] = useState<Step>(1)
  const [error, setError] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState('')

  // STEP 1 HANDLERS

  const handleStep1Next = async () => {
    setError(null)
    try {
      const result = await dispatch(enable2FA()).unwrap()
      setQrCode(result.qrCodeDataURL)
      setSecret(result.secret)
      setStep(2)
    } catch (err: any) {
      handleError(err, errors => {
        setError(Object.values(errors)[0] as string)
      })
    }
  }

  // 🆕 REPLACE handleStep3Verify
  const handleStep3Verify = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setError(null)
    try {
      const result = await dispatch(verify2FA(verificationCode)).unwrap()
      setBackupCodes(result.backupCodes)
      setStep(4)
    } catch (err: any) {
      handleError(err, errors => {
        setError(Object.values(errors)[0] as string)
      })
    }
  }

  const handleStep1Cancel = () => {
    onOpenChange(false)
    resetState()
  }

  // STEP 2 HANDLERS

  const handleStep2Next = () => {
    setStep(3)
    setError(null)
  }

  const handleStep2Back = () => {
    setStep(1)
    setError(null)
  }

  // STEP 3 HANDLERS

  const handleStep3Back = () => {
    setStep(2)
    setError(null)
  }

  // STEP 4 HANDLERS

  const handleStep4Complete = () => {
    onOpenChange(false)
    onSuccess?.()
    resetState()
  }

  // HELPERS

  const resetState = () => {
    setTimeout(() => {
      setStep(1)
      setVerificationCode('')
      setError(null)
      setQrCode('')
      setSecret('')
      setBackupCodes([])
    }, 300)
  }

  const getModalTitle = () => {
    switch (step) {
      case 1:
        return 'auth.2fa.enableTitle'
      case 2:
      case 3:
      case 4:
        return 'auth.2fa.enable2FA'
      default:
        return 'auth.2fa.enable2FA'
    }
  }

  // RENDER

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      closeOnOutsideClick={false}
      closeOnEscape={step === 1} // Only allow ESC on first step
    >
      <ModalHeader title={getModalTitle()} />

      {step === 1 && (
        <Step1Introduction
          onNext={handleStep1Next}
          onCancel={handleStep1Cancel}
          loading={loading}
          error={error}
        />
      )}

      {step === 2 && (
        <Step2QRCode
          qrCode={qrCode}
          secret={secret}
          onNext={handleStep2Next}
          onBack={handleStep2Back}
          loading={loading}
          error={error}
        />
      )}

      {step === 3 && (
        <Step3VerifyCode
          code={verificationCode}
          onChange={setVerificationCode}
          onVerify={handleStep3Verify}
          onBack={handleStep3Back}
          loading={loading}
          error={error}
        />
      )}

      {step === 4 && (
        <Step4BackupCodes
          codes={backupCodes}
          onComplete={handleStep4Complete}
        />
      )}
    </Modal>
  )
}
