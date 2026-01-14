// FILE: src/pages/auth/VerificationSuccess.tsx
// Verification Success Page (Alternative dedicated page)

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'

export default function VerificationSuccess() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login')
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  const handleContinue = () => {
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary p-4">
      <Card className="w-full max-w-md border-border-primary bg-bg-secondary">
        <CardHeader className="pb-4 text-center">
          {/* Success Icon with Animation */}
          <div className="relative mx-auto mb-4">
            <div className="absolute inset-0 animate-ping">
              <div className="bg-status-success/20 h-16 w-16 rounded-full" />
            </div>
            <div className="bg-status-success/10 relative mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <CheckCircle2 className="h-8 w-8 text-status-success" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-text-primary">
            {t('auth.verifyEmail.successTitle')}
          </h1>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Message */}
          <div className="space-y-2 text-center">
            <p className="text-text-secondary">
              {t('auth.verifyEmail.successMessage')}
            </p>
            <div className="flex items-center justify-center gap-1 text-sm text-accent">
              <Sparkles className="h-4 w-4" />
              <span>{t('auth.verifyEmail.accountActivated')}</span>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-3 rounded-lg bg-bg-tertiary p-4">
            <p className="text-sm font-medium text-text-primary">
              {t('auth.verifyEmail.nowYouCan')}
            </p>
            <ul className="space-y-2">
              {[
                t('auth.verifyEmail.benefit1'),
                t('auth.verifyEmail.benefit2'),
                t('auth.verifyEmail.benefit3'),
              ].map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-status-success" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <Button onClick={handleContinue} className="w-full" size="lg">
            {t('auth.verifyEmail.continueToLogin')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Auto-redirect notice */}
          <p className="text-center text-sm text-text-tertiary">
            {t('auth.verifyEmail.autoRedirect')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
