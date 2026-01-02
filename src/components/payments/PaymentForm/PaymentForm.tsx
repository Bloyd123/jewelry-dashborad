
// FILE: src/components/payment/PaymentForm/PaymentForm.tsx
// Main PaymentForm Component (Route Handler)

import { useMediaQuery } from '@/hooks/useMediaQuery'
import PaymentFormDesktop from './PaymentForm.desktop'
import PaymentFormMobile from './PaymentForm.mobile'
import type { PaymentFormProps } from './PaymentForm.types'

export const PaymentForm = (props: PaymentFormProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <PaymentFormDesktop {...props} />
  ) : (
    <PaymentFormMobile {...props} />
  )
}
