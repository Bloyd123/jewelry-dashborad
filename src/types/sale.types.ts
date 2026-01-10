// FILE: types/sales.types.ts
// Complete TypeScript Types for Sales Module

export type SaleStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'returned'

export type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'overdue'

export type PaymentMode =
  | 'cash'
  | 'card'
  | 'upi'
  | 'cheque'
  | 'bank_transfer'
  | 'mixed'
  | 'credit'

export type SaleType =
  | 'retail'
  | 'wholesale'
  | 'exchange'
  | 'order_fulfillment'
  | 'repair_billing'
  | 'estimate'

export type MetalType = 'gold' | 'silver' | 'platinum' | 'diamond' | 'mixed'

export type DeliveryType = 'immediate' | 'scheduled' | 'courier' | 'pickup'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type DiscountType = 'percentage' | 'flat' | 'none'

export type MakingChargesType = 'per_gram' | 'flat' | 'percentage'

export type WeightUnit = 'gram' | 'kg' | 'tola'

export type DocumentType =
  | 'invoice'
  | 'receipt'
  | 'estimate'
  | 'certificate'
  | 'warranty'
  | 'other'

// MAIN INTERFACES

export interface SaleItem {
  _id?: string
  productId?: string | null
  productName: string
  productCode?: string
  category?: string
  hsnCode?: string
  metalType: MetalType
  purity?: string
  grossWeight: number
  stoneWeight: number
  netWeight: number
  weightUnit: WeightUnit
  ratePerGram: number
  metalValue: number
  stoneValue: number
  makingCharges: number
  makingChargesType: MakingChargesType
  otherCharges: number
  taxableAmount: number
  gstPercentage: number
  cgst: number
  sgst: number
  igst: number
  totalGst: number
  discount: {
    type: DiscountType
    value: number
    amount: number
  }
  itemTotal: number
  quantity: number
  huid?: string
  isHallmarked: boolean
  warrantyPeriod?: number
  warrantyExpiryDate?: string
  notes?: string
}

export interface OldGoldItem {
  metalType: string
  purity: string
  grossWeight: number
  stoneWeight: number
  netWeight: number
  ratePerGram: number
  totalValue: number
  description?: string
}

export interface OldGoldExchange {
  hasExchange: boolean
  items: OldGoldItem[]
  totalValue: number
}

export interface Financials {
  subtotal: number
  totalMetalValue: number
  totalStoneValue: number
  totalMakingCharges: number
  totalOtherCharges: number
  totalDiscount: number
  oldGoldValue: number
  totalTaxableAmount: number
  totalCGST: number
  totalSGST: number
  totalIGST: number
  totalGST: number
  roundOff: number
  grandTotal: number
  netPayable: number
}

export interface PaymentRecord {
  _id?: string
  amount: number
  paymentMode: PaymentMode
  paymentDate: string
  transactionId?: string
  referenceNumber?: string
  bankName?: string
  cardLast4?: string
  upiId?: string
  chequeNumber?: string
  chequeDate?: string
  notes?: string
  receivedBy?: string
}

export interface Payment {
  totalAmount: number
  paidAmount: number
  dueAmount: number
  paymentStatus: PaymentStatus
  paymentMode: PaymentMode
  dueDate?: string
  payments: PaymentRecord[]
}

export interface Delivery {
  deliveryType: DeliveryType
  deliveryDate?: string
  deliveryAddress?: string
  deliveredAt?: string
  deliveredBy?: string
  courierDetails?: {
    courierName: string
    trackingNumber: string
    awbNumber: string
  }
}

export interface Return {
  isReturned: boolean
  returnDate?: string
  returnReason?: string
  refundAmount?: number
  returnedBy?: string
}

export interface Document {
  _id?: string
  documentType: DocumentType
  documentUrl: string
  documentNumber?: string
  uploadedAt: string
}

export interface CustomerDetails {
  customerName: string
  customerCode: string
  phone: string
  email?: string
  address?: string
  gstNumber?: string
  panNumber?: string
}

export interface Sale {
  _id: string
  organizationId: string
  shopId: string
  invoiceNumber: string
  saleDate: string
  customerId: string
  customerDetails: CustomerDetails
  saleType: SaleType
  items: SaleItem[]
  oldGoldExchange: OldGoldExchange
  financials: Financials
  payment: Payment
  delivery: Delivery
  status: SaleStatus
  return: Return
  documents: Document[]
  schemeId?: string | null
  orderId?: string | null
  notes?: string
  internalNotes?: string
  termsAndConditions?: string
  tags: string[]
  salesPerson?: string
  approvalStatus: ApprovalStatus
  approvedBy?: string
  approvedAt?: string
  createdBy: string
  updatedBy?: string
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
  totalItems?: number
  totalQuantity?: number
}

// API REQUEST/RESPONSE TYPES

export interface CreateSaleRequest {
  customerId: string
  items: Omit<
    SaleItem,
    | '_id'
    | 'netWeight'
    | 'metalValue'
    | 'taxableAmount'
    | 'cgst'
    | 'sgst'
    | 'igst'
    | 'totalGst'
    | 'itemTotal'
  >[]
  saleType?: SaleType
  payment: {
    paymentMode: PaymentMode
    paidAmount?: number
    dueDate?: string
  }
  oldGoldExchange?: {
    hasExchange: boolean
    items?: OldGoldItem[]
  }
  delivery?: Partial<Delivery>
  notes?: string
  tags?: string[]
}

export interface UpdateSaleRequest extends Partial<CreateSaleRequest> {
  status?: SaleStatus
}

export interface SalesFilters {
  page?: number
  limit?: number
  customerId?: string
  salesPerson?: string
  status?: SaleStatus
  paymentStatus?: PaymentStatus
  saleType?: SaleType
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  search?: string
  sort?: string
}

export interface PaginatedSalesResponse {
  success: boolean
  message: string
  data: {
    sales: Sale[]
    total: number
    page: number
    limit: number
  }
}

export interface SingleSaleResponse {
  success: boolean
  message: string
  data: Sale
}

export interface AddPaymentRequest {
  amount: number
  paymentMode: PaymentMode
  paymentDate?: string
  transactionId?: string
  referenceNumber?: string
  bankName?: string
  cardLast4?: string
  upiId?: string
  chequeNumber?: string
  chequeDate?: string
  notes?: string
}

export interface ReturnSaleRequest {
  returnReason: string
  itemsToReturn?: Array<{
    productId: string
    quantity: number
  }>
  refundAmount: number
  refundMode?: PaymentMode
  returnDate?: string
}

export interface ApplyDiscountRequest {
  discountType: 'percentage' | 'flat'
  discountValue: number
  discountReason?: string
}

export interface SendInvoiceRequest {
  method: 'email' | 'sms' | 'whatsapp'
  recipient: string
}

export interface BulkOperationRequest {
  saleIds: string[]
  reason?: string
  method?: 'email' | 'sms' | 'whatsapp'
}

export interface SalesAnalytics {
  totalSales: number
  totalAmount: number
  totalDiscount: number
  totalGST: number
  averageOrderValue: number
  paidSales: number
  unpaidSales: number
}

export interface SalesDashboard {
  today: {
    count: number
    value: number
  }
  recentSales: Sale[]
  pendingPayments: number
}

export interface CustomerSalesSummary {
  totalSales: number
  totalAmount: number
  totalDue: number
  lastPurchase: string | null
}

export interface SalesPersonPerformance {
  totalSales: number
  totalValue: number
  averageValue: number
}
