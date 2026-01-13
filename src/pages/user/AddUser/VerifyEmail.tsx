
// FILE: src/pages/auth/VerifyEmail.tsx
// Email Verification Page (Token Verification)

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Mail,
  ArrowRight 
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

type VerificationStatus = 'verifying' | 'success' | 'error' | 'expired'

export default function VerifyEmail() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
//   const { verifyEmail } = useAuth()
  
  const [status, setStatus] = useState<VerificationStatus>('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage(t('auth.verifyEmail.noToken'))
      return
    }

    verifyEmailToken(token)
  }, [searchParams])

  const verifyEmailToken = async (token: string) => {
    try {
    //   await verifyEmail(token)
      setStatus('success')
      setMessage(t('auth.verifyEmail.successMessage'))
    } catch (error: any) {
      if (error.message?.includes('expired')) {
        setStatus('expired')
        setMessage(t('auth.verifyEmail.expiredMessage'))
      } else {
        setStatus('error')
        setMessage(error.message || t('auth.verifyEmail.errorMessage'))
      }
    }
  }

  const handleContinue = () => {
    navigate('/login')
  }

  const handleResend = () => {
    navigate('/resend-verification')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <Card className="w-full max-w-md border-border-primary bg-bg-secondary">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-tertiary">
            {status === 'verifying' && (
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="h-8 w-8 text-status-success" />
            )}
            {(status === 'error' || status === 'expired') && (
              <XCircle className="h-8 w-8 text-status-error" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-text-primary">
            {status === 'verifying' && t('auth.verifyEmail.verifying')}
            {status === 'success' && t('auth.verifyEmail.successTitle')}
            {status === 'error' && t('auth.verifyEmail.errorTitle')}
            {status === 'expired' && t('auth.verifyEmail.expiredTitle')}
          </h1>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Message */}
          <p className="text-center text-text-secondary">
            {message || t('auth.verifyEmail.verifyingMessage')}
          </p>

          {/* Actions based on status */}
          <div className="space-y-3">
            {status === 'success' && (
              <>
                <Button
                  onClick={handleContinue}
                  className="w-full"
                  size="lg"
                >
                  {t('auth.verifyEmail.continueToLogin')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="text-center text-sm text-text-tertiary">
                  {t('auth.verifyEmail.successDescription')}
                </div>
              </>
            )}

            {(status === 'error' || status === 'expired') && (
              <>
                <Button
                  onClick={handleResend}
                  className="w-full"
                  size="lg"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {t('auth.verifyEmail.resendLink')}
                </Button>

                <Button
                  onClick={handleContinue}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  {t('auth.verifyEmail.backToLogin')}
                </Button>
              </>
            )}

            {status === 'verifying' && (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="rounded-lg bg-bg-tertiary p-4">
            <p className="text-sm text-text-secondary text-center">
              {t('auth.verifyEmail.helpText')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}