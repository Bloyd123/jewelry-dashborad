// ============================================================================
// FILE: src/components/auth/2fa/Enable2FAModal/Step3VerifyCode.tsx
// Step 3: Verify Code
// ============================================================================

import { useTranslation } from 'react-i18next'
import { ChevronLeft, Clock } from 'lucide-react'
import { ModalBody, ModalFooter } from '@/components/ui/overlay/Modal'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/common/Alert'
import { TwoFactorCodeInput } from '../TwoFactorCodeInput'
import { Loader } from '@/components/ui/loader/Loader'

// ============================================================================
// TYPES
// ============================================================================

export interface Step3VerifyCodeProps {
  code: string
  onChange: (code: string) => void
  onVerify: () => void
  onBack: () => void
  loading?: boolean
  error?: string | null
}

// ============================================================================
// COMPONENT
// ============================================================================

export const Step3VerifyCode: React.FC<Step3VerifyCodeProps> = ({
  code,
  onChange,
  onVerify,
  onBack,
  loading = false,
  error,
}) => {
  const { t } = useTranslation()

  const isCodeComplete = code.length === 6

  return (
    <>
      <ModalBody className="space-y-6">
        {/* Step indicator */}
        <div className="text-center">
          <p className="text-xs text-text-tertiary">{t('auth.2fa.step3of4')}</p>
        </div>

        {/* Instructions */}
        <div className="space-y-2 text-center">
          <h4 className="text-sm font-medium text-text-primary">
            {t('auth.2fa.enterCodeTitle')}
          </h4>
          <p className="text-sm text-text-secondary">
            {t('auth.2fa.enterCodeDescription')}
          </p>
        </div>

        {/* Code Input */}
        <div className="flex justify-center">
        <TwoFactorCodeInput
          value={code}
          onChange={onChange}
          onComplete={loading ? undefined : onVerify}  
          error={error}
          disabled={loading}
        />
        </div>

        {/* Helper text with icon */}
        <div className="flex items-center justify-center gap-2 text-xs text-text-tertiary">
          <Clock className="h-3 w-3" />
          <span>{t('auth.2fa.codeRefreshes')}</span>
        </div>

        {/* Troubleshooting */}
        <Alert variant="info">
          <AlertDescription>
            <p className="mb-2 text-xs font-medium">
              {t('auth.2fa.havingTrouble')}
            </p>
            <ul className="list-disc space-y-1 pl-4 text-xs">
              <li>{t('auth.2fa.checkPhoneTime')}</li>
              <li>{t('auth.2fa.waitNewCode')}</li>
              <li>{t('auth.2fa.rescanQR')}</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Error Alert */}
        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success hint */}
        {isCodeComplete && !error && !loading && (
          <Alert variant="success">
            <AlertDescription>
              <p className="text-xs">
                {t('auth.2fa.codeReady')}
              </p>
            </AlertDescription>
          </Alert>
        )}
      </ModalBody>

      <ModalFooter align="between">
        <Button variant="ghost" onClick={onBack} disabled={loading}>
          <ChevronLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>
        <Button
          onClick={onVerify}
          disabled={loading || !isCodeComplete}
        >
          {loading && <Loader size="xs" variant="spinner" />}
          {t('auth.2fa.verifyAndContinue')}
        </Button>
      </ModalFooter>
    </>
  )
}