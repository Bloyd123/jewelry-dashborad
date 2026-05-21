// FILE: src/components/scheme/EnrollmentForm/EnrollmentForm.types.ts

import type { PaymentMode } from '@/types/scheme.types'

export interface EnrollmentFormData {
  // Step 1 — Customer
  customerId:        string
  selectedCustomer?: {
    _id:          string
    firstName:    string
    lastName?:    string
    customerCode: string
    phone:        string
  }

  // Step 2 — Enrollment Details
  installmentAmount: number
  startDate:         string
  notes?:            string

  // Step 3 — Initial Payment (optional)
  hasInitialPayment:  boolean
  initialPayment?: {
    amount:      number
    paymentMode: PaymentMode
  }
}

export interface EnrollmentFormProps {
  shopId:    string
  schemeId:  string
  scheme: {
    schemeName:   string
    installments: {
      installmentAmount: number
      totalInstallments: number
      frequency:         string
    }
    eligibility?: {
      requiresKYC: boolean
    }
  }
  open:      boolean
  onClose:   () => void
  onSuccess: () => void
}