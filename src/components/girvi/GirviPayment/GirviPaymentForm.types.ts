// FILE: src/components/girvi/GirviPayment/GirviPaymentForm.types.ts
import type {
  GirviPaymentType,
  GirviInterestType,
  GirviPaymentMode,
  GirviBalanceSnapshot,
} from '@/types/girvi.types'

export interface GirviPaymentFormProps {
  shopId:        string
  girviId:       string
  girviBalance?: {
    outstandingPrincipal: number
    accruedInterest:      number
    totalAmountDue:       number
    interestRate:         number
    interestType:         GirviInterestType
    lastInterestCalcDate?: string
    girviDate:            string
  }
  onSuccess?: (updatedGirvi: GirviBalanceSnapshot) => void
  onCancel?:  () => void
}

export interface GirviPaymentFormData {
  paymentType:          GirviPaymentType
  interestType:         GirviInterestType
  interestFrom:         string
  interestTo:           string
  interestReceived:     number | string
  principalReceived:    number | string
  discountGiven:        number | string
  paymentDate:          string
  paymentMode:          GirviPaymentMode
  transactionReference: string
  remarks:              string
}