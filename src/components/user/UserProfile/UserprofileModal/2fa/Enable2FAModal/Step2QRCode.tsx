// FILE: src/components/auth/2fa/Enable2FAModal/Step2QRCode.tsx
// Step 2: Scan QR Code

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, Copy, Check } from 'lucide-react'
import { ModalBody, ModalFooter } from '@/components/ui/overlay/Modal'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/common/Alert'
import { Loader } from '@/components/ui/loader/Loader'

// TYPES

export interface Step2QRCodeProps {
  qrCode: string
  secret: string
  onNext: () => void
  onBack: () => void
  loading?: boolean
  error?: string | null
}
const formatSecret = (secret: string): string => {
  if (!secret) return ''

  // Remove any existing spaces
  const cleaned = secret.replace(/\s/g, '')

  // Add space every 4 characters
  return cleaned.match(/.{1,4}/g)?.join('') || cleaned
}
// COMPONENT

export const Step2QRCode: React.FC<Step2QRCodeProps> = ({
  qrCode,
  secret,
  onNext,
  onBack,
  loading = false,
  error,
}) => {
  const { t } = useTranslation()
  const [secretCopied, setSecretCopied] = useState(false)

  // HANDLERS

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret.replace(/\s/g, ''))
    setSecretCopied(true)
    setTimeout(() => setSecretCopied(false), 2000)
  }

  // RENDER

  return (
    <>
      <ModalBody className="space-y-6">
        {/* Step indicator */}
        <div className="text-center">
          <p className="text-xs text-text-tertiary">{t('auth.2fa.step2of4')}</p>
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-text-primary">
            {t('auth.2fa.scanQRTitle')}
          </h4>
          <ol className="list-decimal space-y-2 pl-4 text-sm text-text-secondary">
            <li>{t('auth.2fa.openAuthApp')}</li>
            <li>{t('auth.2fa.tapAddAccount')}</li>
            <li>{t('auth.2fa.scanThisQR')}</li>
          </ol>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="rounded-lg border-2 border-border-primary bg-white p-4">
            {qrCode ? (
              <img src={qrCode} alt="QR Code" className="h-48 w-48" />
            ) : (
              <div className="flex h-48 w-48 items-center justify-center">
                <Loader size="lg" variant="spinner" />
              </div>
            )}
          </div>
        </div>

        {/* Manual entry */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">
            {t('auth.2fa.cantScan')}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-border-primary bg-bg-tertiary px-3 py-2">
              <code className="break-all font-mono text-sm tracking-wider text-text-primary">
                {formatSecret(secret)}
              </code>
            </div>
            <Button variant="outline" size="icon" onClick={handleCopySecret}>
              {secretCopied ? (
                <Check className="h-4 w-4 text-status-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          {/* {secretCopied && (
            <p className="text-xs text-status-success">{t('common.copied')}</p>
          )} */}
        </div>

        {/* Helper Info */}
        <Alert variant="info">
          <AlertDescription>
            <p className="text-xs">{t('auth.2fa.qrCodeInfo')}</p>
          </AlertDescription>
        </Alert>

        {/* Error Alert */}
        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </ModalBody>

      <ModalFooter align="between">
        <Button variant="ghost" onClick={onBack} disabled={loading}>
          <ChevronLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>
        <Button onClick={onNext} disabled={loading || !qrCode}>
          {loading && <Loader size="xs" variant="spinner" />}
          {t('common.continue')}
        </Button>
      </ModalFooter>
    </>
  )
}
