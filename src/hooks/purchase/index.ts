// FILE: src/features/purchase/hooks/index.ts
// Purchase Module Hooks - Central Export

// ============================================
// LIST & QUERY HOOKS
// ============================================
export {
  usePurchaseList,
  usePurchaseById,
  usePurchaseSearch,
  useSupplierPurchases,
  usePurchasesByDateRange,
  usePendingPurchases,
  useUnpaidPurchases,
  usePurchaseSearchEager,
} from './usePurchasesList'

// ============================================
// ACTION HOOKS (CRUD & Mutations)
// ============================================
export { usePurchaseActions } from './usePurchaseActions'

// ============================================
// ANALYTICS & REPORTS HOOKS
// ============================================
export {
  usePurchaseAnalytics,
  usePurchaseSummary,
  usePaymentStatusBreakdown,
  useTopSuppliers,
  useMonthlyTrend,
  usePurchaseComparison,
  useYearOverYearAnalytics,
  usePurchasePerformanceMetrics,
} from './usePurchaseAnalytics'

// ============================================
// PAYMENT MANAGEMENT HOOKS
// ============================================
export {
  usePurchasePayments,
  usePaymentHistory,
  usePaymentSummary,
  useRecentPayments,
  usePaymentModeAnalytics,
  usePaymentValidation,
  usePaymentTimeline,
} from './usePurchasePayments'

// ============================================
// DOCUMENT MANAGEMENT HOOKS
// ============================================
export {
  usePurchaseDocuments,
  useDocumentsByType,
  useInvoiceDocuments,
  useReceiptDocuments,
  useCertificateDocuments,
  useRecentDocuments,
  useDocumentValidation,
  useDocumentOrganizer,
  useMissingDocuments,
  useDocumentSearch,
} from './usePurchaseDocuments'

// ============================================
// RE-EXPORT TYPES
// ============================================
export type {
  IPurchase,
  IPurchaseItem,
  ICreatePurchaseForm,
  IUpdatePurchaseForm,
  IReceivePurchaseForm,
  IAddPaymentForm,
  IPurchaseFilters,
  IPurchaseAnalytics,
  IPaymentRecord,
  IDocument,
  PurchaseStatus,
  PaymentStatus,
  PurchaseType,
} from '@/types/purchase.types'