// FILE: src/components/girviTransfer/GirviTransferForm/GirviTransferForm.types.ts

import type {
  InterestType,
  PaymentMode,
  PartyType,
} from '@/types/girviTransfer.types'

export interface GirviTransferFormData {
  // From Party
  fromPartyName:    string
  fromPartyPhone?:  string
  fromPartyAddress?: string
  fromPartyType?:   PartyType

  // To Party
  toPartySupplierId?:  string  
  toPartyName:         string
  toPartyPhone?:       string
  toPartyAddress?:     string
  toPartyType?:        PartyType
  toPartyInterestRate: number
  toPartyInterestType: InterestType

  // Transfer Details
  transferDate:            string
  ourInterestTillTransfer?: number
  ourInterestType?:         InterestType
  partyPrincipalAmount:    number
  transferAmount?:         number
  commission?:             number
  paymentMode?:            PaymentMode
  transactionReference?:   string
  notes?:                  string
}

export interface GirviTransferFormProps {
  shopId:     string
  girviId:    string
  onSuccess?: () => void
  onCancel?:  () => void
  mode?:      'create'
  // Girvi info for pre-filling
  girviInfo?: {
    girviNumber:         string
    principalAmount:     number
    outstandingPrincipal: number
    interestRate:        number
    interestType:        InterestType
    supplierName?:       string
  }
}

export interface FormSectionProps {
  data:      Partial<GirviTransferFormData>
  errors:    Record<string, string>
  onChange:  (name: string, value: any) => void
  onBlur?:   (name: string) => void
  disabled?: boolean
}