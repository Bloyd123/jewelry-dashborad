// FILE: src/types/girvi.types.ts

export type GirviStatus =
  | 'active'
  | 'released'
  | 'transferred'
  | 'partial_released'
  | 'overdue'
  | 'auctioned'

export type GirviItemType =
  | 'gold'
  | 'silver'
  | 'diamond'
  | 'platinum'
  | 'other'

export type GirviItemCondition = 'good' | 'fair' | 'poor'

export type GirviInterestType = 'simple' | 'compound'

export type GirviCalculationBasis = 'monthly' | 'daily'

export type GirviPaymentMode = 'cash' | 'upi' | 'bank_transfer' | 'cheque'

export type GirviPaymentType =
  | 'interest_only'
  | 'principal_partial'
  | 'principal_full'
  | 'interest_principal'
  | 'release_payment'

export type GirviDocumentType = 'girvi_slip' | 'id_proof' | 'photo' | 'other'

export type GirviTransferType = 'outgoing' | 'incoming' | 'return'

export type GirviTransferStatus = 'pending' | 'completed' | 'returned' | 'cancelled'

export type GirviCashbookEntryType =
  | 'girvi_jama'
  | 'interest_received'
  | 'principal_received'
  | 'release_received'
  | 'discount_given'
  | 'transfer_out'
  | 'transfer_in'
  | 'transfer_return_in'
  | 'transfer_return_out'

export type GirviCashbookFlowType = 'inflow' | 'outflow'

export interface GirviItem {
  _id: string
  itemName: string
  itemType: GirviItemType
  description?: string
  quantity: number

  grossWeight: number
  lessWeight: number
  netWeight: number

  tunch?: number         // purity % e.g. 91.6 
  purity?: string        // e.g. '22K', '18K', '92.5', '999'
  ratePerGram?: number   // today's market rate in INR

  approxValue?: number     // auto-calc: netWeight × (tunch/100) × ratePerGram
  userGivenValue?: number  
  finalValue?: number

  condition: GirviItemCondition
}

export interface GirviDocument {
  _id: string
  documentType: GirviDocumentType
  documentUrl?: string
  uploadedAt: string
}

export interface GirviReleaseSummary {
  totalItemsApproxValue: number
  totalPrincipal: number
  totalInterestAccrued: number
  totalInterestReceived: number
  totalPrincipalReceived: number
  totalDiscountGiven: number
  netAmountReceived: number
  releaseInterestType?: GirviInterestType
  releasePaymentMode?: GirviPaymentMode
  releaseRemarks?: string
}

export interface GirviTransferredToParty {
  name?: string
  phone?: string
  address?: string
}

export interface GirviUser {
  _id: string
  firstName: string
  lastName: string
  email?: string
}

export interface GirviCustomer {
  _id: string
  firstName: string
  lastName: string
  phone: string
  customerCode?: string
  email?: string
  address?: {
    city?: string
    state?: string
  }
}


export interface Girvi {
  _id: string
  organizationId: string
  shopId: string
  girviNumber: string
  customerId: string | GirviCustomer  
  status: GirviStatus

  items: GirviItem[]
  totalGrossWeight: number
  totalNetWeight: number
  totalApproxValue: number

  principalAmount: number
  loanToValueRatio?: number
  interestRate: number
  interestType: GirviInterestType
  calculationBasis: GirviCalculationBasis
  girviDate: string
  dueDate?: string
  gracePeriodDays: number

  totalPrincipalPaid: number
  totalInterestPaid: number
  totalDiscountGiven: number
  outstandingPrincipal: number
  accruedInterest: number
  lastInterestCalcDate?: string
  totalAmountDue: number

  isTransferred: boolean
  currentHolderType: 'shop' | 'external_party'
  transferredToParty?: GirviTransferredToParty
  transferInterestRate?: number
  transferInterestType?: GirviInterestType

  releaseDate?: string
  releasedBy?: string | GirviUser
  releaseNotes?: string
  releaseSummary?: GirviReleaseSummary

  girviSlipNumber?: string
  witnessName?: string
  notes?: string
  internalNotes?: string
  documents?: GirviDocument[]

  isOverdue?: boolean
  daysElapsed?: number

  createdBy?: string | GirviUser
  updatedBy?: string | GirviUser
  createdAt: string
  updatedAt: string
  deletedAt?: string
}


export interface GirviPayment {
  _id: string
  girviId: string
  organizationId: string
  shopId: string
  customerId: string
  receiptNumber: string

  paymentType: GirviPaymentType
  interestType: GirviInterestType
  interestRate: number
  interestFrom?: string
  interestTo?: string
  interestDays?: number
  interestCalculated: number
  interestReceived: number

  principalReceived: number
  discountGiven: number
  netAmountReceived: number

  paymentDate: string
  paymentMode: GirviPaymentMode
  transactionReference?: string

  principalBefore: number
  principalAfter: number
  outstandingBefore: number
  outstandingAfter: number

  createdBy?: string
  remarks?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface GirviCashbookEntry {
  _id: string
  organizationId: string
  shopId: string
  entryNumber: string
  entryDate: string
  entryType: GirviCashbookEntryType
  flowType: GirviCashbookFlowType
  amount: number
  paymentMode: GirviPaymentMode
  transactionReference?: string

  breakdown: {
    principalAmount: number
    interestAmount: number
    discountAmount: number
    commissionAmount: number
    netAmount: number
  }

  girviId?: string
  paymentId?: string
  transferId?: string
  customerId?: string
  girviNumber?: string
  customerName?: string
  customerPhone?: string

  openingBalance: number
  closingBalance: number

  createdBy?: string
  remarks?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}


export interface GirviStatistics {
  totalGirvis: number
  activeGirvis: number
  releasedGirvis: number
  transferredGirvis: number
  overdueGirvis: number
  totalPrincipalGiven: number
  totalOutstanding: number
  totalAccruedInterest: number
  totalAmountDue: number
  totalItemsValue: number
  avgInterestRate: number
}


export interface GirviInterestCalculation {
  girviId: string
  girviNumber: string
  principal: number
  interestRate: number
  interestType: GirviInterestType
  calculationBasis: GirviCalculationBasis
  fromDate: string
  toDate: string
  days: number
  months: number
  interestCalculated: number
  totalAmountDue: number

  comparison: {
    simple: {
      interest: number
      totalAmountDue: number
    }
    compound: {
      interest: number
      totalAmountDue: number
    }
  }

  totalPaid: {
    principal: number
    interest: number
    discount: number
  }
}


export interface CreateGirviItemInput {
  itemName: string
  itemType: GirviItemType
  description?: string
  quantity?: number
  grossWeight: number
  lessWeight?: number
  tunch?: number
  purity?: string
  ratePerGram?: number
  userGivenValue?: number
  condition?: GirviItemCondition
}

export interface CreateGirviRequest {
  customerId: string
  items: CreateGirviItemInput[]
  principalAmount: number
  interestRate: number
  interestType?: GirviInterestType
  calculationBasis?: GirviCalculationBasis
  girviDate: string
  dueDate?: string
  gracePeriodDays?: number
  loanToValueRatio?: number
  girviSlipNumber?: string
  witnessName?: string
  notes?: string
  internalNotes?: string
  paymentMode?: GirviPaymentMode   
  transactionReference?: string
}

export interface UpdateGirviRequest {
  interestRate?: number
  interestType?: GirviInterestType
  calculationBasis?: GirviCalculationBasis
  dueDate?: string
  gracePeriodDays?: number
  girviSlipNumber?: string
  witnessName?: string
  notes?: string
  internalNotes?: string
}

export interface ReleaseGirviRequest {
  releaseInterestType: GirviInterestType
  interestReceived: number
  principalReceived: number
  discountGiven?: number
  paymentDate: string
  paymentMode: GirviPaymentMode
  transactionReference?: string
  remarks?: string
}

export interface GetGirvisFilters {
  page?: number
  limit?: number
  sort?: string
  status?: GirviStatus
  customerId?: string
  search?: string
  startDate?: string
  endDate?: string
  overdueOnly?: boolean
}

export interface GetInterestCalculationParams {
  toDate?: string
  interestType?: GirviInterestType
}


export interface GirviResponse {
  success: boolean
  message: string
  data: {
    girvi: Girvi
  }
}

export interface GirvisListResponse {
  success: boolean
  message: string
  data: {
    girvis: Girvi[]
    stats: GirviStatistics
  }
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface ReleaseGirviResponse {
  success: boolean
  message: string
  data: {
    girvi: Girvi
    payment: GirviPayment
    releaseSummary: GirviReleaseSummary
  }
}

export interface GirviStatisticsResponse {
  success: boolean
  message: string
  data: {
    stats: GirviStatistics
  }
}

export interface GirviInterestCalculationResponse {
  success: boolean
  message: string
  data: {
    calculation: GirviInterestCalculation
  }
}


export interface GirviFormData {
  customerId: string
  customerName?: string
  customerPhone?: string

  items: CreateGirviItemInput[]

  principalAmount: number | string
  loanToValueRatio?: number | string
  interestRate: number | string
  interestType: GirviInterestType
  calculationBasis: GirviCalculationBasis

  girviDate: string
  dueDate?: string
  gracePeriodDays?: number | string

  paymentMode: GirviPaymentMode
  transactionReference?: string

  girviSlipNumber?: string
  witnessName?: string
  notes?: string
  internalNotes?: string
}


export const GIRVI_STATUS_LABELS: Record<GirviStatus, string> = {
  active:            'Active',
  released:          'Released',
  transferred:       'Transferred',
  partial_released:  'Partial Released',
  overdue:           'Overdue',
  auctioned:         'Auctioned',
}

export const GIRVI_ITEM_TYPE_LABELS: Record<GirviItemType, string> = {
  gold:     'Gold',
  silver:   'Silver',
  diamond:  'Diamond',
  platinum: 'Platinum',
  other:    'Other',
}

export const GIRVI_PAYMENT_MODE_LABELS: Record<GirviPaymentMode, string> = {
  cash:          'Cash',
  upi:           'UPI',
  bank_transfer: 'Bank Transfer',
  cheque:        'Cheque',
}

export const GIRVI_INTEREST_TYPE_LABELS: Record<GirviInterestType, string> = {
  simple:   'Simple Interest',
  compound: 'Compound Interest',
}

export const GIRVI_CALCULATION_BASIS_LABELS: Record<GirviCalculationBasis, string> = {
  monthly: 'Monthly',
  daily:   'Daily',
}

export const GIRVI_ITEM_CONDITION_LABELS: Record<GirviItemCondition, string> = {
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
}

export const GIRVI_PAYMENT_TYPE_LABELS: Record<GirviPaymentType, string> = {
  interest_only:      'Interest Only',
  principal_partial:  'Partial Principal',
  principal_full:     'Full Principal',
  interest_principal: 'Interest + Principal',
  release_payment:    'Release Payment',
}
export interface GirviPaymentFormData {
  paymentType:  GirviPaymentType
  interestType: GirviInterestType
 
  interestFrom?: string
  interestTo?:   string
 
  interestReceived:  number | string
  principalReceived: number | string
  discountGiven:     number | string
 
  paymentDate:          string
  paymentMode:          GirviPaymentMode
  transactionReference?: string
  remarks?:             string
}
 
 
export interface AddGirviPaymentRequest {
  paymentType:          GirviPaymentType
  interestType:         GirviInterestType
  interestFrom?:        string
  interestTo?:          string
  interestReceived:     number
  principalReceived:    number
  discountGiven?:       number
  paymentDate:          string
  paymentMode:          GirviPaymentMode
  transactionReference?: string
  remarks?:             string
}
 
export interface GetGirviPaymentsFilters {
  page?:        number
  limit?:       number
  sort?:        string
  paymentType?: GirviPaymentType
  paymentMode?: GirviPaymentMode
  startDate?:   string
  endDate?:     string
}
 
export interface GetShopGirviPaymentsFilters {
  page?:        number
  limit?:       number
  sort?:        string
  paymentType?: GirviPaymentType
  paymentMode?: GirviPaymentMode
  customerId?:  string
  startDate?:   string
  endDate?:     string
}
 
 
export interface GirviPaymentSummary {
  totalInterestReceived:  number
  totalPrincipalReceived: number
  totalDiscountGiven:     number
  totalNetReceived:       number
  paymentCount:           number
}
 
export interface GirviShopPaymentSummary {
  totalInterestReceived:  number
  totalPrincipalReceived: number
  totalDiscountGiven:     number
  totalNetReceived:       number
  totalPayments:          number
  cashPayments:           number
  upiPayments:            number
}
 
export interface GirviBalanceSnapshot {
  outstandingPrincipal: number
  totalInterestPaid:    number
  totalPrincipalPaid:   number
  totalDiscountGiven:   number
  totalAmountDue:       number
  status:               GirviStatus
}
 
export interface AddGirviPaymentResponse {
  success: boolean
  message: string
  data: {
    payment:      GirviPayment
    updatedGirvi: GirviBalanceSnapshot
  }
}
 
export interface GirviPaymentsListResponse {
  success: boolean
  message: string
  data: {
    payments: GirviPayment[]
    summary:  GirviPaymentSummary
  }
  pagination: {
    currentPage:  number
    totalPages:   number
    totalItems:   number
    itemsPerPage: number
    hasNextPage:  boolean
    hasPrevPage:  boolean
  }
}
 
export interface GirviPaymentResponse {
  success: boolean
  message: string
  data: {
    payment: GirviPayment
  }
}
 
export interface GirviShopPaymentsListResponse {
  success: boolean
  message: string
  data: {
    payments: GirviPayment[]
    summary:  GirviShopPaymentSummary
  }
  pagination: {
    currentPage:  number
    totalPages:   number
    totalItems:   number
    itemsPerPage: number
    hasNextPage:  boolean
    hasPrevPage:  boolean
  }
}