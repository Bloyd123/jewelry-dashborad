// FILE: src/components/auth/2fa/Enable2FAModal/Step1Introduction.tsx
// Step 1: Introduction & How It Works

import { useTranslation } from 'react-i18next'
import { Shield, Download, Smartphone, Key, CheckCircle } from 'lucide-react'
import { ModalBody, ModalFooter } from '@/components/ui/overlay/Modal'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/common/Alert'
import { Loader } from '@/components/ui/loader/Loader'

// TYPES

export interface Step1IntroductionProps {
  onNext: () => void
  onCancel: () => void
  loading?: boolean
  error?: string | null
}

// COMPONENT

export const Step1Introduction: React.FC<Step1IntroductionProps> = ({
  onNext,
  onCancel,
  loading = false,
  error,
}) => {
  const { t } = useTranslation()

  const steps = [
    { icon: Download, text: t('auth.2fa.step1Download') },
    { icon: Smartphone, text: t('auth.2fa.step2Scan') },
    { icon: Key, text: t('auth.2fa.step3Enter') },
    { icon: CheckCircle, text: t('auth.2fa.step4Save') },
  ]

  const recommendedApps = [
    'Google Authenticator',
    'Microsoft Authenticator',
    'Authy',
  ]

  return (
    <>
      <ModalBody className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-accent/10 flex h-16 w-16 items-center justify-center rounded-full">
            <Shield className="h-8 w-8 text-accent" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-text-primary">
            {t('auth.2fa.enableTitle')}
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            {t('auth.2fa.enableDescription')}
          </p>
        </div>

        {/* How it works */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-text-primary">
            {t('auth.2fa.howItWorks')}
          </h4>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-tertiary">
                  <step.icon className="h-4 w-4 text-text-secondary" />
                </div>
                <p className="mt-1 text-sm text-text-secondary">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended apps */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-text-primary">
            {t('auth.2fa.recommendedApps')}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {recommendedApps.map(app => (
              <div
                key={app}
                className="rounded-lg border border-border-primary bg-bg-secondary px-3 py-2 text-center transition-colors hover:bg-bg-tertiary"
              >
                <Smartphone className="mx-auto mb-1 h-5 w-5 text-text-secondary" />
                <p className="text-xs text-text-secondary">{app}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </ModalBody>

      <ModalFooter align="right">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button onClick={onNext} disabled={loading}>
          {loading && <Loader size="xs" variant="spinner" />}
          {t('auth.2fa.getStarted')}
        </Button>
      </ModalFooter>
    </>
  )
}
