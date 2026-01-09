// FILE: src/pages/payment/PaymentFormPage.tsx
// Usage Example - Payment Form Page

import { useNavigate, useParams } from 'react-router-dom'
import { PaymentForm } from '@/components/payments/PaymentForm'

export const PaymentFormPage = () => {
  const navigate = useNavigate()
  const { shopId, paymentId } = useParams()

  const handleSuccess = () => {
    // Navigate back to payments list after successful save
    navigate(`/shops/${shopId}/payments`)
  }

  const handleCancel = () => {
    // Navigate back without saving
    navigate(`/shops/${shopId}/payments`)
  }

  return (
    <PaymentForm
      shopId={shopId!}
      paymentId={paymentId}
      mode={paymentId ? 'edit' : 'create'}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}
