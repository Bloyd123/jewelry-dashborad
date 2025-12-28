// ============================================================================
// FILE: src/components/payment/PaymentForm/PaymentForm.types.ts
// PaymentForm Types and Interfaces
// ============================================================================

import type { Payment } from '@/types/payment.types'

export interface PaymentFormProps {
  initialData?: Partial<PaymentFormData>
  shopId: string
  paymentId?: string // For edit mode
  onSuccess?: () => void
  onCancel?: () => void
  mode?: 'create' | 'edit' | 'view'
}

export interface FormSectionProps {
  data: Partial<PaymentFormData>
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
  onBlur?: (name: string) => void
  disabled?: boolean
}

export interface PaymentFormData {
  // Transaction Type
  transactionType: 'receipt' | 'payment'

  // Basic Info
  paymentType: string
  amount: number | string
  paymentDate: string
  paymentTime: string

  // Party Details
  partyType: 'customer' | 'supplier' | 'other'
  partyId: string
  partyName: string
  partyPhone?: string
  partyEmail?: string

  // Reference Link
  referenceType: 'sale' | 'purchase' | 'scheme_enrollment' | 'order' | 'none'
  referenceId?: string
  referenceNumber?: string

  // Payment Mode
  paymentMode:
    | 'cash'
    | 'card'
    | 'upi'
    | 'cheque'
    | 'bank_transfer'
    | 'wallet'
    | 'other'

  // Cash Details
  receivedAmount?: number
  returnAmount?: number

  // UPI Details
  upiApp?: string
  upiId?: string
  upiTransactionId?: string

  // Card Details
  cardType?: 'credit' | 'debit'
  cardNetwork?: 'visa' | 'mastercard' | 'rupay' | 'amex' | 'other'
  last4Digits?: string
  cardBankName?: string
  authorizationCode?: string
  terminalId?: string

  // Cheque Details
  chequeNumber?: string
  chequeDate?: string
  chequeBankName?: string
  chequeBranchName?: string
  chequeIfscCode?: string
  chequeAccountNumber?: string
  expectedClearanceDate?: string

  // Bank Transfer Details
  transferType?: 'neft' | 'rtgs' | 'imps' | 'other'
  transferTransactionId?: string
  transferReferenceNumber?: string
  fromBank?: string
  fromAccountNumber?: string
  toBank?: string
  toAccountNumber?: string
  transferIfscCode?: string

  // Wallet Details
  walletProvider?: string
  walletNumber?: string
  walletTransactionId?: string

  // Additional Details
  notes?: string
  tags?: string[]
  attachments?: File[]
}

// For summary panel
export interface PaymentSummary {
  amount: number
  transactionType: 'receipt' | 'payment'
  paymentMode: string
  partyName: string
  partyPhone?: string
  referenceNumber?: string
  paymentDate: string
  status?: string
}
