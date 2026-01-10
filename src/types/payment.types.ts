// FILE: types/payment.types.ts
// Payment Module - Complete TypeScript Type Definitions

export type PaymentType =
  | 'sale_payment'
  | 'purchase_payment'
  | 'scheme_payment'
  | 'advance_payment'
  | 'refund'
  | 'other'

export type TransactionType = 'receipt' | 'payment'

export type PaymentMode =
  | 'cash'
  | 'card'
  | 'upi'
  | 'cheque'
  | 'bank_transfer'
  | 'wallet'
  | 'other'

export type PaymentStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'

export type PartyType = 'customer' | 'supplier' | 'other'

export type ReferenceType =
  | 'sale'
  | 'purchase'
  | 'scheme_enrollment'
  | 'order'
  | 'none'

export type ChequeStatus = 'pending' | 'cleared' | 'bounced'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type ReceiptSendMethod = 'email' | 'sms' | 'whatsapp'

export type ExportFormat = 'excel' | 'csv'

// MAIN PAYMENT INTERFACE

export interface Payment {
  _id: string
  organizationId: string
  shopId: string
  paymentNumber: string
  paymentDate: string
  paymentType: PaymentType
  transactionType: TransactionType
  amount: number
  paymentMode: PaymentMode
  status: PaymentStatus
  transactionId?: string

  // Party Details
  party: {
    partyType: PartyType
    partyId: string
    partyName: string
    partyPhone?: string
    partyEmail?: string
  }

  // Reference
  reference: {
    referenceType: ReferenceType
    referenceId?: string
    referenceNumber?: string
  }

  // Payment Mode Specific Details
  paymentDetails: {
    cardDetails?: CardDetails
    upiDetails?: UPIDetails
    chequeDetails?: ChequeDetails
    bankTransferDetails?: BankTransferDetails
    walletDetails?: WalletDetails
  }

  // Reconciliation
  reconciliation: Reconciliation

  // Receipt
  receipt: Receipt

  // Approval
  approval: Approval

  // Refund Info
  refund: RefundInfo

  notes?: string
  processedBy?: User
  createdBy?: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

// NESTED INTERFACES

export interface CardDetails {
  cardType?: 'credit' | 'debit'
  last4Digits?: string
  cardHolderName?: string
  bankName?: string
  transactionId?: string
}

export interface UPIDetails {
  upiId?: string
  transactionId?: string
  upiApp?: string
}

export interface ChequeDetails {
  chequeNumber: string
  chequeDate: string
  bankName: string
  branchName?: string
  accountNumber?: string
  chequeStatus: ChequeStatus
  clearanceDate?: string
  bounceReason?: string
}

export interface BankTransferDetails {
  accountNumber?: string
  ifscCode?: string
  bankName?: string
  branchName?: string
  transactionId?: string
  transferDate?: string
}

export interface WalletDetails {
  walletProvider?: string
  walletNumber?: string
  transactionId?: string
}

export interface Reconciliation {
  isReconciled: boolean
  reconciledAt?: string
  reconciledBy?: string
  reconciledWith?: string
  discrepancy?: number
  notes?: string
}

export interface Receipt {
  receiptGenerated: boolean
  receiptNumber?: string
  receiptUrl?: string
  receiptSentAt?: string
  receiptSentTo?: string
}

export interface Approval {
  approvalRequired: boolean
  approvalStatus: ApprovalStatus
  approvedBy?: string
  approvedAt?: string
  rejectionReason?: string
}

export interface RefundInfo {
  isRefund: boolean
  originalPaymentId?: string
  refundReason?: string
  refundedBy?: string
  refundDate?: string
}

export interface User {
  _id: string
  firstName: string
  lastName: string
  email?: string
}

// API REQUEST TYPES

export interface CreatePaymentRequest {
  paymentType: PaymentType
  transactionType: TransactionType
  amount: number
  paymentMode: PaymentMode
  party: {
    partyType: PartyType
    partyId: string
    partyName: string
    partyPhone?: string
    partyEmail?: string
  }
  reference?: {
    referenceType: ReferenceType
    referenceId?: string
    referenceNumber?: string
  }
  paymentDetails?: Payment['paymentDetails']
  transactionId?: string
  notes?: string
}

export interface UpdatePaymentRequest {
  amount?: number
  paymentMode?: PaymentMode
  status?: PaymentStatus
  notes?: string
  paymentDetails?: Payment['paymentDetails']
}

export interface UpdatePaymentStatusRequest {
  status: PaymentStatus
  reason?: string
}

export interface ChequeClearanceRequest {
  clearanceDate?: string
  notes?: string
}

export interface ChequeBounceRequest {
  bounceReason: string
  notes?: string
}

export interface ReconcilePaymentRequest {
  reconciledWith: string
  discrepancy?: number
  notes?: string
}

export interface SendReceiptRequest {
  method: ReceiptSendMethod
  recipient: string
}

export interface BulkReconcileRequest {
  paymentIds: string[]
  reconciledWith: string
  notes?: string
}

export interface BulkExportRequest {
  paymentIds?: string[]
  format: ExportFormat
}

export interface ProcessRefundRequest {
  refundAmount: number
  refundMode: PaymentMode
  refundReason: string
}

export interface ApprovalRequest {
  notes?: string
}

export interface RejectPaymentRequest {
  reason: string
}

// API RESPONSE TYPES

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface PaymentResponse extends ApiResponse<Payment> {}
export interface PaymentsResponse extends PaginatedResponse<Payment> {}

// FILTER & QUERY TYPES

export interface PaymentFilters {
  page?: number
  limit?: number
  sort?: string
  paymentType?: PaymentType
  transactionType?: TransactionType
  paymentMode?: PaymentMode
  status?: PaymentStatus
  partyId?: string
  partyType?: PartyType
  referenceType?: ReferenceType
  referenceId?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  search?: string
}

// ANALYTICS & DASHBOARD TYPES

export interface PaymentAnalytics {
  analytics: Array<{
    _id: {
      date: string
      transactionType: TransactionType
    }
    count: number
    totalAmount: number
  }>
  summary: {
    totalReceipts: {
      amount: number
      count: number
    }
    totalPayments: {
      amount: number
      count: number
    }
    netCashFlow: number
    paymentModeBreakdown: PaymentModeBreakdown[]
  }
}

export interface PaymentModeBreakdown {
  _id: PaymentMode
  count: number
  totalAmount: number
}

export interface PaymentDashboard {
  todayCollection: CashCollection
  weekCollection: number
  monthCollection: number
  pendingChequesCount: number
  unreconciledCount: number
  recentPayments: Payment[]
}

export interface CashCollection {
  date: string
  cashReceived: {
    amount: number
    count: number
  }
  cashPaid: {
    amount: number
    count: number
  }
  netCashBalance: number
}

export interface DigitalCollection {
  breakdown: PaymentModeBreakdown[]
  totalDigitalCollection: number
}

export interface PartyPaymentSummary {
  totalReceived: number
  totalPaid: number
  totalPending: number
  lastPaymentDate: string | null
  paymentModeBreakdown: {
    [key in PaymentMode]?: {
      count: number
      amount: number
    }
  }
}

export interface ReconciliationSummary {
  totalPayments: number
  reconciled: {
    count: number
    amount: number
  }
  unreconciled: {
    count: number
    amount: number
  }
  totalDiscrepancy: number
}

// UTILITY TYPES

export interface PaymentStats {
  count: number
  totalAmount: number
}

export interface BulkOperationResult {
  success: boolean
  message: string
  data: {
    processedCount: number
    totalProvided: number
    failedIds?: string[]
  }
}

// FORM TYPES (for React Hook Form or similar)

export interface PaymentFormData {
  paymentType: PaymentType
  transactionType: TransactionType
  amount: string | number
  paymentMode: PaymentMode
  partyType: PartyType
  partyId: string
  partyName: string
  partyPhone?: string
  referenceType?: ReferenceType
  referenceId?: string
  referenceNumber?: string
  transactionId?: string
  notes?: string

  // Cheque specific
  chequeNumber?: string
  chequeDate?: string
  bankName?: string

  // UPI specific
  upiId?: string
  upiApp?: string

  // Card specific
  cardType?: 'credit' | 'debit'
  last4Digits?: string
  cardHolderName?: string
}

// CONSTANTS

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  cash: 'Cash',
  card: 'Card',
  upi: 'UPI',
  cheque: 'Cheque',
  bank_transfer: 'Bank Transfer',
  wallet: 'Wallet',
  other: 'Other',
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  receipt: 'Money In (Receipt)',
  payment: 'Money Out (Payment)',
}

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  sale_payment: 'Sale Payment',
  purchase_payment: 'Purchase Payment',
  scheme_payment: 'Scheme Payment',
  advance_payment: 'Advance Payment',
  refund: 'Refund',
  other: 'Other',
}
