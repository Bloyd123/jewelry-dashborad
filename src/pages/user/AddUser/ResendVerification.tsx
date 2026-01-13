
// FILE: src/pages/auth/ResendVerification.tsx
// Resend Email Verification Page

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function ResendVerification() {
  const { t } = useTranslation()
  const navigate = useNavigate()
//   const { resendVerification } = useAuth()

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError(t('auth.verifyEmail.emailRequired'))
      return
    }

    setIsLoading(true)

    try {
    //   await resendVerification(email)
      setIsSuccess(true)
    } catch (error: any) {
      setError(error.message || t('auth.verifyEmail.resendError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/login')
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
        <Card className="w-full max-w-md border-border-primary bg-bg-secondary">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-tertiary">
              <CheckCircle2 className="h-8 w-8 text-status-success" />
            </div>

            <h1 className="text-2xl font-bold text-text-primary">
              {t('auth.verifyEmail.emailSent')}
            </h1>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-center text-text-secondary">
              {t('auth.verifyEmail.emailSentDescription')}
            </p>

            <div className="rounded-lg bg-bg-tertiary p-4">
              <p className="text-sm font-medium text-text-primary mb-2">
                {t('auth.verifyEmail.checkInbox')}
              </p>
              <p className="text-sm text-text-secondary">
                {email}
              </p>
            </div>

            <Button
              onClick={handleBack}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('auth.verifyEmail.backToLogin')}
            </Button>

            <p className="text-center text-sm text-text-tertiary">
              {t('auth.verifyEmail.checkSpam')}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <Card className="w-full max-w-md border-border-primary bg-bg-secondary">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-tertiary">
            <Mail className="h-8 w-8 text-accent" />
          </div>

          <h1 className="text-2xl font-bold text-text-primary">
            {t('auth.verifyEmail.resendTitle')}
          </h1>

          <p className="text-text-secondary mt-2">
            {t('auth.verifyEmail.resendDescription')}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-text-primary"
              >
                {t('auth.verifyEmail.emailLabel')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.verifyEmail.emailPlaceholder')}
                disabled={isLoading}
                className="bg-bg-tertiary border-border-primary text-text-primary"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-status-error/10 border border-status-error/20 p-3">
                <p className="text-sm text-status-error">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('auth.verifyEmail.sending')}
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    {t('auth.verifyEmail.sendLink')}
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('auth.verifyEmail.backToLogin')}
              </Button>
            </div>

            {/* Help Text */}
            <div className="rounded-lg bg-bg-tertiary p-4">
              <p className="text-sm text-text-secondary text-center">
                {t('auth.verifyEmail.helpTextResend')}
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
