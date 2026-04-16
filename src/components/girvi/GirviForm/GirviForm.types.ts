// FILE: src/components/girvi/GirviForm/GirviForm.types.ts

import type { Girvi } from '@/types/girvi.types'

export interface GirviFormProps {
  initialData?: Partial<GirviFormData>
  shopId: string
  girviId?: string          // for edit mode
  onSuccess?: () => void
  onCancel?: () => void
  mode?: 'create' | 'edit' | 'view'
}

export interface GirviFormSectionProps {
  data: Partial<GirviFormData>
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
  onBlur?: (name: string) => void
  disabled?: boolean
}


export interface GirviItemFormData {
  itemName: string
  itemType: 'gold' | 'silver' | 'diamond' | 'platinum' | 'other'
  description?: string
  quantity: number
  grossWeight: number | string
  lessWeight: number | string
  netWeight?: number          // computed: grossWeight - lessWeight
  tunch?: number | string
  purity?: string
  ratePerGram?: number | string
  approxValue?: number        // computed: netWeight × (tunch/100) × ratePerGram
  userGivenValue?: number | string
  finalValue?: number         // computed: userGivenValue || approxValue
  condition: 'good' | 'fair' | 'poor'
}


export interface GirviFormData {
  customerId: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string

  items: GirviItemFormData[]

  girviDate: string
  dueDate?: string
  gracePeriodDays?: number | string
  girviSlipNumber?: string
  witnessName?: string

  principalAmount: number | string
  loanToValueRatio?: number | string

  interestRate: number | string
  interestType: 'simple' | 'compound'
  calculationBasis: 'monthly' | 'daily'

  paymentMode: 'cash' | 'upi' | 'bank_transfer' | 'cheque'
  transactionReference?: string

  notes?: string
  internalNotes?: string
  tags?: string[]
  attachments?: File[]
}



export interface GirviSummary {
  totalItems: number
  totalGrossWeight: number
  totalNetWeight: number
  totalApproxValue: number
  principalAmount: number
  loanToValueRatio?: number
  interestRate: number
  interestType: string
  customerName?: string
  girviDate?: string
  dueDate?: string
}