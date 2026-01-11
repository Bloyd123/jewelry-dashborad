// FILE: src/components/auth/2fa/Enable2FAModal/Step4BackupCodes.tsx
// Step 4: Save Backup Codes

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { ModalBody, ModalFooter } from '@/components/ui/overlay/Modal'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/common/Alert'
import { BackupCodesDisplay } from '../BackupCodesDisplay'

// TYPES

export interface Step4BackupCodesProps {
  codes: string[]
  onComplete: () => void
}

// COMPONENT

export const Step4BackupCodes: React.FC<Step4BackupCodesProps> = ({
  codes,
  onComplete,
}) => {
  const { t } = useTranslation()
  const [savedConfirmed, setSavedConfirmed] = useState(false)

  return (
    <>
      <ModalBody className="space-y-6">
        {/* Step indicator */}
        <div className="text-center">
          <p className="text-xs text-text-tertiary">{t('auth.2fa.step4of4')}</p>
        </div>

        {/* Success message */}
        <Alert variant="success">
          <CheckCircle className="h-5 w-5" />
          <AlertDescription>
            <p className="font-medium">{t('auth.2fa.2faEnabled')}</p>
            <p className="mt-1 text-xs">{t('auth.2fa.nowMoreSecure')}</p>
          </AlertDescription>
        </Alert>

        {/* Warning */}
        <Alert variant="warning">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>
            <p className="font-medium">{t('auth.2fa.importantWarning')}</p>
            <p className="mt-1 text-xs">{t('auth.2fa.saveCodesWarning')}</p>
          </AlertDescription>
        </Alert>

        {/* Backup Codes Display */}
        <BackupCodesDisplay codes={codes} />

        {/* Confirmation Checkbox */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={savedConfirmed}
              onChange={e => setSavedConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-border-primary text-accent transition-colors focus:ring-2 focus:ring-accent focus:ring-offset-2"
            />
            <span className="select-none text-sm text-text-secondary">
              {t('auth.2fa.confirmSavedCodes')}
            </span>
          </label>
        </div>

        {/* Additional Info */}
        <Alert variant="info">
          <AlertDescription>
            <p className="text-xs">{t('auth.2fa.backupCodesInfo')}</p>
          </AlertDescription>
        </Alert>
      </ModalBody>

      <ModalFooter align="right">
        <Button onClick={onComplete} disabled={!savedConfirmed}>
          {t('auth.2fa.completeSetup')}
        </Button>
      </ModalFooter>
    </>
  )
}
