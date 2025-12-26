// ============================================================================
// FILE: /purchase.types.ts
// Purchase Module TypeScript Types - Matches Backend Schema
// ============================================================================

// Enums
export type PurchaseType = 
  | 'new_stock' 
  | 'old_gold' 
  | 'exchange' 
  | 'consignment' 
  | 'repair_return' 
  | 'sample';

export type PurchaseStatus = 
  | 'draft' 
  | 'pending' 
  | 'ordered' 
  | 'received' 
  | 'partial_received' 
  | 'completed' 
  | 'cancelled' 
  | 'returned';

export type PaymentStatus = 
  | 'paid' 
  | 'partial' 
  | 'unpaid' 
  | 'overdue';

export type PaymentMode = 
  | 'cash' 
  | 'card' 
  | 'upi' 
  | 'cheque' 
  | 'bank_transfer' 
  | 'mixed' 
  | 'credit';

export type MetalType = 
  | 'gold' 
  | 'silver' 
  | 'platinum' 
  | 'diamond' 
  | 'mixed';

export type DocumentType = 
  | 'invoice' 
  | 'receipt' 
  | 'delivery_note' 
  | 'certificate' 
  | 'other';

export type ApprovalStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected';

// Interfaces
export interface IPurchaseItem {
  _id?: string;
  productId?: string | null;
  productCode?: string;
  productName: string;
  category?: string;
  metalType: MetalType;
  purity: string;
  grossWeight: number;
  stoneWeight: number;
  netWeight: number;
  weightUnit: string;
  quantity: number;
  ratePerGram: number;
  makingCharges: number;
  stoneCharges: number;
  otherCharges: number;
  itemTotal: number;
  huid?: string;
  isHallmarked: boolean;
  description?: string;
}

export interface ISupplierDetails {
  supplierName: string;
  supplierCode?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  gstNumber?: string;
}

export interface IPaymentRecord {
  _id?: string;
  amount: number;
  paymentMode: PaymentMode;
  paymentDate: Date | string;
  transactionId?: string;
  referenceNumber?: string;
  chequeNumber?: string;
  chequeDate?: Date | string;
  bankName?: string;
  notes?: string;
  receivedBy?: string;
}

export interface IPayment {
  paymentMode: PaymentMode;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  paymentTerms?: string;
  dueDate?: Date | string;
  payments: IPaymentRecord[];
}

export interface IFinancials {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  roundOff: number;
  grandTotal: number;
  totalPaid: number;
  totalDue: number;
}

export interface IDelivery {
  expectedDate?: Date | string;
  receivedDate?: Date | string;
  receivedBy?: string;
  deliveryAddress?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface IDocument {
  _id?: string;
  documentType: DocumentType;
  documentUrl: string;
  documentNumber?: string;
  uploadedAt?: Date | string;
}

export interface IPurchase {
  _id: string;
  organizationId: string;
  shopId: string;
  purchaseNumber: string;
  supplierId: string;
  supplierDetails: ISupplierDetails;
  purchaseDate: Date | string;
  purchaseType: PurchaseType;
  items: IPurchaseItem[];
  financials: IFinancials;
  payment: IPayment;
  status: PurchaseStatus;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date | string;
  rejectedBy?: string;
  rejectedAt?: Date | string;
  rejectionReason?: string;
  delivery: IDelivery;
  documents: IDocument[];
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  createdBy: string;
  updatedBy?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string;
}

// API Response Types
export interface IPurchaseListResponse {
  success: boolean;
  message: string;
  data: {
    purchases: IPurchase[];
    page: number;
    limit: number;
    total: number;
  };
}

export interface IPurchaseResponse {
  success: boolean;
  message: string;
  data: IPurchase;
}

export interface IPurchaseAnalytics {
  totalPurchases: number;
  totalPurchaseValue: number;
  pendingPurchases: number;
  paymentStatusBreakdown: Array<{
    _id: PaymentStatus;
    count: number;
  }>;
  topSuppliers: Array<{
    _id: string;
    totalPurchases: number;
    totalValue: number;
    supplier: {
      businessName: string;
      supplierCode: string;
    };
  }>;
  monthlyTrend: Array<{
    _id: { year: number; month: number };
    count: number;
    totalValue: number;
  }>;
}

// Form Types
export interface ICreatePurchaseForm {
  supplierId: string;
  purchaseDate?: Date | string;
  purchaseType?: PurchaseType;
  items: IPurchaseItem[];
  payment?: {
    paymentMode?: PaymentMode;
    paidAmount?: number;
    paymentTerms?: string;
    dueDate?: Date | string;
  };
  delivery?: {
    expectedDate?: Date | string;
    deliveryAddress?: string;
  };
  notes?: string;
  tags?: string[];
}

export interface IUpdatePurchaseForm extends Partial<ICreatePurchaseForm> {}

export interface IReceivePurchaseForm {
  receivedBy?: string;
  receivedDate?: Date | string;
  notes?: string;
}

export interface IAddPaymentForm {
  amount: number;
  paymentMode: PaymentMode;
  paymentDate?: Date | string;
  transactionId?: string;
  referenceNumber?: string;
  chequeNumber?: string;
  chequeDate?: Date | string;
  bankName?: string;
  notes?: string;
}

// Filter Types
export interface IPurchaseFilters {
  page?: number;
  limit?: number;
  sort?: string;
  supplierId?: string;
  status?: PurchaseStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Utility Types
export type PurchaseCardData = Pick<
  IPurchase,
  '_id' | 'purchaseNumber' | 'purchaseDate' | 'status' | 'supplierDetails'
> & {
  totalAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
};

export type PurchaseSummary = {
  purchaseNumber: string;
  supplierName: string;
  date: string;
  amount: number;
  status: PurchaseStatus;
  paymentStatus: PaymentStatus;
};