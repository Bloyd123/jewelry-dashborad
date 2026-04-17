// FILE: src/types/girviCashbook.types.ts
export type CashbookEntryType =
  | 'girvi_jama'
  | 'interest_received'
  | 'principal_received'
  | 'release_received'
  | 'discount_given'
  | 'transfer_out'
  | 'transfer_in'
  | 'transfer_return_in'
  | 'transfer_return_out'

export type FlowType    = 'inflow' | 'outflow'
export type PaymentMode = 'cash' | 'upi' | 'bank_transfer' | 'cheque'

export interface IBreakdown {
  principalAmount:  number
  interestAmount:   number
  discountAmount:   number
  commissionAmount: number
  netAmount:        number
}

export interface IGirviCashbookEntry {
  _id:            string
  organizationId: string
  shopId:         string
  entryNumber:    string
  entryDate:      Date | string

  entryType:            CashbookEntryType
  flowType:             FlowType
  amount:               number
  paymentMode:          PaymentMode
  transactionReference?: string

  breakdown: IBreakdown
  girviId?:    string
  paymentId?:  string
  transferId?: string
  customerId?: string

  girviNumber?:   string
  customerName?:  string
  customerPhone?: string

  openingBalance: number
  closingBalance: number

  createdBy?: any
  remarks?:   string
  deletedAt?: Date | string
  createdAt:  Date | string
  updatedAt:  Date | string
}

export interface IPeriodSummary {
  totalInflow:    number
  totalOutflow:   number
  totalInterest:  number
  totalPrincipal: number
  totalDiscount:  number
  totalEntries:   number
  netFlow:        number
}

export interface IDailySummary extends IPeriodSummary {
  date:            string
  openingBalance:  number
  closingBalance:  number
  newGirviCount:   number
  releaseCount:    number
}

export interface IMonthlySummary extends IPeriodSummary {
  year:            number
  month:           number
  openingBalance:  number
  closingBalance:  number
  newGirviCount:   number
  releaseCount:    number
  transferOutCount: number
  cashInflow:      number
  upiInflow:       number
  byEntryType:     Array<{
    _id:         string
    totalAmount: number
    count:       number
  }>
  dailyBreakdown: Array<{
    _id:           number
    totalInflow:   number
    totalOutflow:  number
    totalInterest: number
    entryCount:    number
  }>
}

export interface IYearlySummary extends IPeriodSummary {
  year:            number
  netFlow:         number
  totalNewGirvis:  number
  totalReleases:   number
  monthlyBreakdown: Array<{
    month:         number
    totalInflow:   number
    totalOutflow:  number
    totalInterest: number
    newGirvis:     number
    releases:      number
    netFlow:       number
  }>
}

export interface ICurrentBalance {
  shopId:         string
  currentBalance: number
}

export interface IGirviCashbookData {
  girviId:     string
  girviNumber: string
  entries:     IGirviCashbookEntry[]
  summary: {
    totalInflow:    number
    totalOutflow:   number
    totalInterest:  number
    totalPrincipal: number
    totalDiscount:  number
    netFlow:        number
  }
}

export interface IGirviCashbookListResponse {
  success: boolean
  message: string
  data: {
    entries:       IGirviCashbookEntry[]
    periodSummary: IPeriodSummary
  }
  meta: {
    pagination: {
      page:    number
      limit:   number
      total:   number
      pages:   number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

export interface IGirviCashbookEntryResponse {
  success: boolean
  message: string
  data: {
    entry: IGirviCashbookEntry
  }
}

export interface ICreateManualEntryForm {
  entryType:            CashbookEntryType
  flowType:             FlowType
  amount:               number
  paymentMode:          PaymentMode
  transactionReference?: string
  entryDate:            string
  girviId?:             string
  customerId?:          string
  breakdown?: {
    principalAmount?: number
    interestAmount?:  number
    discountAmount?:  number
  }
  remarks?: string
}

export interface IGirviCashbookFilters {
  page?:        number
  limit?:       number
  sort?:        string
  entryType?:   CashbookEntryType
  flowType?:    FlowType
  paymentMode?: PaymentMode
  startDate?:   string
  endDate?:     string
  customerId?:  string
  girviId?:     string
}