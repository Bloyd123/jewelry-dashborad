// FILE: src/types/girviTransfer.types.ts

// ─── Enums ────────────────────────────────────────────────────────────────────

export type TransferType = 'outgoing' | 'incoming' | 'return'

export type TransferStatus = 'pending' | 'completed' | 'returned' | 'cancelled'

export type PartyType = 'shop' | 'external'

export type InterestType = 'simple' | 'compound'

export type PaymentMode = 'cash' | 'upi' | 'bank_transfer' | 'cheque'

export type ItemType = 'gold' | 'silver' | 'diamond' | 'platinum' | 'other'

export type ItemCondition = 'good' | 'fair' | 'poor'

// ─── Sub Interfaces ───────────────────────────────────────────────────────────

export interface ITransferParty {
  type:         PartyType
  name:         string
  phone?:       string
  address?:     string
  shopId?:      string
  interestRate?: number
  interestType?: InterestType
}

export interface IItemSnapshot {
  itemName:    string
  itemType:    ItemType
  description?: string
  quantity:    number
  grossWeight: number
  lessWeight:  number
  netWeight:   number
  tunch?:      number
  purity?:     string
  ratePerGram?: number
  approxValue?: number
  finalValue?:  number
  condition?:  ItemCondition
}

// ─── Main Interface ───────────────────────────────────────────────────────────

export interface IGirviTransfer {
  _id:            string
  girviId:        string
  organizationId: string
  shopId:         string
  customerId:     string
  transferNumber: string

  transferType: TransferType

  // Parties
  fromParty: ITransferParty
  toParty:   ITransferParty

  // Transfer Date
  transferDate: Date | string

  // Our side financials
  ourPrincipalAmount:      number
  ourInterestTillTransfer: number
  ourInterestRate:         number
  ourInterestType:         InterestType
  ourTotalDue:             number

  // Party side
  partyPrincipalAmount: number
  partyInterestRate:    number
  partyInterestType:    InterestType

  // Settlement
  transferAmount:       number
  commission:           number
  paymentMode:          PaymentMode
  transactionReference?: string

  // Items
  itemsSnapshot:   IItemSnapshot[]
  totalItemsValue: number

  // Return Details
  returnDate?:                 Date | string
  returnAmount?:               number
  partyInterestCharged?:       number
  partyInterestDays?:          number
  returnReason?:               string
  returnPaymentMode?:          PaymentMode
  returnTransactionReference?: string
  returnRemarks?:              string

  // Status
  status: TransferStatus

  // Audit
  createdBy?: string
  updatedBy?: string
  notes?:     string
  deletedAt?: Date | string
  createdAt:  Date | string
  updatedAt:  Date | string
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface IGirviTransferListResponse {
  success: boolean
  message: string
  data: {
    transfers: IGirviTransfer[]
    summary?:  ITransferSummary
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

export interface IGirviTransferResponse {
  success: boolean
  message: string
  data: {
    transfer:     IGirviTransfer
    updatedGirvi?: any
    partySummary?: IPartySummary
  }
}

export interface ITransferSummary {
  totalTransfers:      number
  activeTransfers:     number
  returnedTransfers:   number
  totalPartyPrincipal: number
  totalTransferAmount: number
  totalPartyInterest:  number
  totalReturnAmount:   number
}

export interface IPartySummary {
  partyPrincipalAmount:  number
  partyInterestRate:     number
  partyInterestType:     InterestType
  partyDays:             number
  partyInterestCalc:     number
  partyInterestCharged:  number
  returnAmount:          number
}

export interface IPartyInterestCalculation {
  transferId:              string
  transferNumber:          string
  toPartyName:             string
  partyPrincipalAmount:    number
  partyInterestRate:       number
  partyInterestType:       InterestType
  fromDate:                Date | string
  toDate:                  Date | string
  days:                    number
  months:                  number
  partyInterestCalculated: number
  totalPayableToParty:     number
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface ITransferOutForm {
  fromParty: {
    name:     string
    phone?:   string
    address?: string
    type?:    PartyType
  }
  toParty: {
    name:         string
    phone?:       string
    address?:     string
    type?:        PartyType
    shopId?:      string
    interestRate: number
    interestType: InterestType
  }
  transferDate:           string
  ourInterestTillTransfer?: number
  ourInterestType?:         InterestType
  partyPrincipalAmount:   number
  transferAmount?:        number
  commission?:            number
  paymentMode?:           PaymentMode
  transactionReference?:  string
  notes?:                 string
}

export interface ITransferReturnForm {
  returnDate:                  string
  partyInterestCharged:        number
  returnAmount:                number
  returnPaymentMode:           PaymentMode
  returnTransactionReference?: string
  returnReason?:               string
  returnRemarks?:              string
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface IGirviTransferFilters {
  page?:         number
  limit?:        number
  sort?:         string
  status?:       TransferStatus
  transferType?: TransferType
  startDate?:    string
  endDate?:      string
}