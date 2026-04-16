// FILE: src/types/openingBalance.types.ts

// ================================================================
// SUB-INTERFACES
// ================================================================

export interface BankAccount {
  bankName: string
  accountNumber?: string
  balance: number
}

export interface CashBalance {
  cash: number
  bank: BankAccount[]
  totalCash?: number
  totalBank?: number
  totalCashAndBank?: number
}

export interface PartyBalance {
  partyType: 'customer' | 'supplier'
  partyId: string
  partyModel: 'Customer' | 'Supplier'
  partyName: string
  direction: 'we_owe' | 'they_owe'
  amount: number
  notes?: string
  ledgerEntryId?: string
}

export interface MetalBalance {
  partyType: 'customer' | 'supplier'
  partyId: string
  partyModel: 'Customer' | 'Supplier'
  partyName: string
  metalType: 'gold' | 'silver' | 'platinum'
  direction: 'we_owe' | 'they_owe'
  weight: number
  weightUnit: 'gram' | 'tola' | 'kg'
  referenceRate?: number
  notes?: string
  metalLedgerEntryId?: string
}

export interface MetalStock {
  weight: number
  value: number
  purity: string
}

export interface StockBalance {
  totalStockValue: number
  metalStock?: {
    gold: MetalStock
    silver: MetalStock
    platinum: MetalStock
  }
  hasIndividualProducts?: boolean
  totalProducts?: number
}

export interface OpeningBalanceSummary {
  totalPartyBalances: number
  totalMetalBalances: number
  totalCashAndBankBalance: number
  totalStockValue: number
  netWorth: number
}

// ================================================================
// MAIN ENTITY
// ================================================================

export interface OpeningBalance {
  _id: string
  organizationId: string
  shopId: string
  openingDate: string
  status: 'draft' | 'confirmed'
  cashBalance: CashBalance
  partyBalances: PartyBalance[]
  metalBalances: MetalBalance[]
  stockBalance: StockBalance
  summary: OpeningBalanceSummary
  confirmedBy?: string
  confirmedAt?: string
  notes?: string
  createdBy: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
}

// ================================================================
// SETUP STATUS
// ================================================================

export interface SetupStatus {
  isOpeningBalanceSet: boolean
  openingDate: string | null
  openingBalanceStatus: 'not_started' | 'draft' | 'confirmed'
  hasCashBalance: boolean
  hasPartyBalances: boolean
  hasMetalBalances: boolean
  hasStockBalance: boolean
}

// ================================================================
// REQUEST TYPES
// ================================================================

export interface CreateOrUpdateOpeningBalanceInput {
  openingDate?: string
  cashBalance?: {
    cash?: number
    bank?: {
      bankName: string
      accountNumber?: string
      balance: number
    }[]
  }
  partyBalances?: Omit<PartyBalance, 'ledgerEntryId'>[]
  metalBalances?: Omit<MetalBalance, 'metalLedgerEntryId'>[]
  stockBalance?: {
    totalStockValue?: number
    metalStock?: {
      gold?: Partial<MetalStock>
      silver?: Partial<MetalStock>
      platinum?: Partial<MetalStock>
    }
  }
  notes?: string
}

// ================================================================
// RESPONSE TYPES
// ================================================================

export interface OpeningBalanceResponse {
  success: boolean
  message: string
  data: OpeningBalance | { exists: boolean; message?: string; data?: OpeningBalance }
}

export interface SetupStatusResponse {
  success: boolean
  message: string
  data: SetupStatus
}

export interface ConfirmOpeningBalanceResponse {
  success: boolean
  message: string
  data: OpeningBalance
}