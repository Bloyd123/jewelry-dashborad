// FILE: src/store/api/paymentApi.ts
// Payment Module - RTK Query API Slice (43 Endpoints)

import { baseApi } from './baseApi'
import { PAYMENT_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  Payment,
  PaymentFilters,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  UpdatePaymentStatusRequest,
  ChequeClearanceRequest,
  ChequeBounceRequest,
  ReconcilePaymentRequest,
  SendReceiptRequest,
  BulkReconcileRequest,
  BulkExportRequest,
  ProcessRefundRequest,
  ApprovalRequest,
  RejectPaymentRequest,
  PaymentsResponse,
  PaymentResponse,
  PaymentAnalytics,
  PaymentDashboard,
  CashCollection,
  DigitalCollection,
  PartyPaymentSummary,
  ReconciliationSummary,
  PaymentModeBreakdown,
  BulkOperationResult,
  ExportFormat,
} from '@/types/payment.types'

// ─────────────────────────────────────────────────────────────
// EXTRA RESPONSE TYPES (not in types file but needed here)
// ─────────────────────────────────────────────────────────────

interface PendingChequesResponse {
  success: boolean
  message: string
  data: Payment[]
  count: number
}

interface TodayPaymentsResponse {
  success: boolean
  message: string
  data: {
    payments: Payment[]
    totalByMode: PaymentModeBreakdown[]
  }
}

interface PartyPaymentSummaryResponse {
  success: boolean
  message: string
  data: PartyPaymentSummary
}

interface ReconciliationSummaryResponse {
  success: boolean
  message: string
  data: ReconciliationSummary
}

interface DigitalCollectionResponse {
  success: boolean
  message: string
  data: DigitalCollection
}

interface CashCollectionResponse {
  success: boolean
  message: string
  data: CashCollection
}

interface PaymentModeBreakdownResponse {
  success: boolean
  message: string
  data: PaymentModeBreakdown[]
}

// ─────────────────────────────────────────────────────────────
// ENDPOINT BUILDER HELPERS
// ─────────────────────────────────────────────────────────────

const buildUrl = (template: string, params: Record<string, string>) =>
  replacePathParams(template, params)

// ─────────────────────────────────────────────────────────────
// RTK QUERY API SLICE
// ─────────────────────────────────────────────────────────────

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    // ══════════════════════════════════════════
    // 1. PAYMENT CRUD OPERATIONS
    // ══════════════════════════════════════════

    // POST /shops/:shopId/payments
    createPayment: build.mutation<Payment, { shopId: string } & CreatePaymentRequest>({
      query: ({ shopId, ...body }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.CREATE, { shopId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      invalidatesTags: (_res, _err, { shopId }) => [
        { type: 'PaymentList', id: shopId },
        { type: 'PaymentDashboard', id: shopId },
        { type: 'PaymentAnalytics', id: shopId },
      ],
    }),

    // GET /shops/:shopId/payments
    getAllPayments: build.query<PaymentsResponse, { shopId: string } & PaymentFilters>({
      query: ({ shopId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.GET_ALL, { shopId }),
        params,
      }),
      providesTags: (_res, _err, { shopId }) => [
        { type: 'PaymentList', id: shopId },
      ],
    }),

    // GET /shops/:shopId/payments/:paymentId
    getPaymentById: build.query<Payment, { shopId: string; paymentId: string }>({
      query: ({ shopId, paymentId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.GET_BY_ID, { shopId, paymentId }),
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      providesTags: (_res, _err, { paymentId }) => [
        { type: 'Payment', id: paymentId },
      ],
    }),

    // PUT /shops/:shopId/payments/:paymentId
    updatePayment: build.mutation<
      Payment,
      { shopId: string; paymentId: string } & UpdatePaymentRequest
    >({
      query: ({ shopId, paymentId, ...body }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.UPDATE, { shopId, paymentId }),
        method: 'PUT',
        body,
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      invalidatesTags: (_res, _err, { shopId, paymentId }) => [
        { type: 'Payment', id: paymentId },
        { type: 'PaymentList', id: shopId },
      ],
    }),

    // DELETE /shops/:shopId/payments/:paymentId
    deletePayment: build.mutation<void, { shopId: string; paymentId: string }>({
      query: ({ shopId, paymentId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.DELETE, { shopId, paymentId }),
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { shopId, paymentId }) => [
        { type: 'Payment', id: paymentId },
        { type: 'PaymentList', id: shopId },
        { type: 'PaymentDashboard', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // 2. PAYMENT STATUS MANAGEMENT
    // ══════════════════════════════════════════

    // PATCH /shops/:shopId/payments/:paymentId/status
    updatePaymentStatus: build.mutation<
      Payment,
      { shopId: string; paymentId: string } & UpdatePaymentStatusRequest
    >({
      query: ({ shopId, paymentId, ...body }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.UPDATE_STATUS, { shopId, paymentId }),
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      invalidatesTags: (_res, _err, { shopId, paymentId }) => [
        { type: 'Payment', id: paymentId },
        { type: 'PaymentList', id: shopId },
      ],
    }),

    // PATCH /shops/:shopId/payments/:paymentId/complete
    markPaymentAsCompleted: build.mutation<Payment, { shopId: string; paymentId: string }>({
      query: ({ shopId, paymentId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.MARK_COMPLETED, { shopId, paymentId }),
        method: 'PATCH',
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      invalidatesTags: (_res, _err, { shopId, paymentId }) => [
        { type: 'Payment', id: paymentId },
        { type: 'PaymentList', id: shopId },
        { type: 'PaymentDashboard', id: shopId },
      ],
    }),

    // PATCH /shops/:shopId/payments/:paymentId/cancel
    cancelPayment: build.mutation<
      Payment,
      { shopId: string; paymentId: string; reason: string }
    >({
      query: ({ shopId, paymentId, reason }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.CANCEL, { shopId, paymentId }),
        method: 'PATCH',
        body: { reason },
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      invalidatesTags: (_res, _err, { shopId, paymentId }) => [
        { type: 'Payment', id: paymentId },
        { type: 'PaymentList', id: shopId },
        { type: 'PaymentDashboard', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // 3. CHEQUE MANAGEMENT
    // ══════════════════════════════════════════

    // GET /shops/:shopId/payments/cheques/pending
    getPendingCheques: build.query<Payment[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.CHEQUES_PENDING, { shopId }),
      }),
      transformResponse: (res: PendingChequesResponse) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'PendingCheques', id: shopId },
      ],
    }),

    // PATCH /shops/:shopId/payments/:paymentId/cheque/clear
    clearCheque: build.mutation<
      Payment,
      { shopId: string; paymentId: string } & ChequeClearanceRequest
    >({
      query: ({ shopId, paymentId, ...body }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.CHEQUE_CLEAR, { shopId, paymentId }),
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      invalidatesTags: (_res, _err, { shopId, paymentId }) => [
        { type: 'Payment', id: paymentId },
        { type: 'PaymentList', id: shopId },
        { type: 'PendingCheques', id: shopId },
        { type: 'ClearedCheques', id: shopId },
        { type: 'PaymentDashboard', id: shopId },
      ],
    }),

    // PATCH /shops/:shopId/payments/:paymentId/cheque/bounce
    bounceCheque: build.mutation<
      Payment,
      { shopId: string; paymentId: string } & ChequeBounceRequest
    >({
      query: ({ shopId, paymentId, ...body }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.CHEQUE_BOUNCE, { shopId, paymentId }),
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      invalidatesTags: (_res, _err, { shopId, paymentId }) => [
        { type: 'Payment', id: paymentId },
        { type: 'PaymentList', id: shopId },
        { type: 'PendingCheques', id: shopId },
        { type: 'BouncedCheques', id: shopId },
      ],
    }),

    // GET /shops/:shopId/payments/cheques/bounced
    getBouncedCheques: build.query<Payment[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.CHEQUES_BOUNCED, { shopId }),
      }),
      transformResponse: (res: PendingChequesResponse) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'BouncedCheques', id: shopId },
      ],
    }),

    // GET /shops/:shopId/payments/cheques/cleared
    getClearedCheques: build.query<
      Payment[],
      { shopId: string; startDate?: string; endDate?: string }
    >({
      query: ({ shopId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.CHEQUES_CLEARED, { shopId }),
        params,
      }),
      transformResponse: (res: PendingChequesResponse) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'ClearedCheques', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // 4. RECONCILIATION
    // ══════════════════════════════════════════

    // GET /shops/:shopId/payments/reconciliation/pending
    getUnreconciledPayments: build.query<Payment[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.RECONCILIATION_PENDING, { shopId }),
      }),
      transformResponse: (res: PendingChequesResponse) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'UnreconciledPayments', id: shopId },
      ],
    }),

    // POST /shops/:shopId/payments/:paymentId/reconcile
    reconcilePayment: build.mutation<
      Payment,
      { shopId: string; paymentId: string } & ReconcilePaymentRequest
    >({
      query: ({ shopId, paymentId, ...body }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.RECONCILE, { shopId, paymentId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      invalidatesTags: (_res, _err, { shopId, paymentId }) => [
        { type: 'Payment', id: paymentId },
        { type: 'PaymentList', id: shopId },
        { type: 'UnreconciledPayments', id: shopId },
        { type: 'ReconciliationSummary', id: shopId },
      ],
    }),

    // GET /shops/:shopId/payments/reconciliation/summary
    getReconciliationSummary: build.query<
      ReconciliationSummary,
      { shopId: string; startDate?: string; endDate?: string }
    >({
      query: ({ shopId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.RECONCILIATION_SUMMARY, { shopId }),
        params,
      }),
      transformResponse: (res: ReconciliationSummaryResponse) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'ReconciliationSummary', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // 5. RECEIPT GENERATION
    // ══════════════════════════════════════════

    // GET /shops/:shopId/payments/:paymentId/receipt
    getReceipt: build.query<Payment, { shopId: string; paymentId: string }>({
      query: ({ shopId, paymentId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.RECEIPT, { shopId, paymentId }),
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      providesTags: (_res, _err, { paymentId }) => [
        { type: 'Receipt', id: paymentId },
      ],
    }),

    // POST /shops/:shopId/payments/:paymentId/receipt/send
    sendReceipt: build.mutation<
      void,
      { shopId: string; paymentId: string } & SendReceiptRequest
    >({
      query: ({ shopId, paymentId, ...body }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.RECEIPT_SEND, { shopId, paymentId }),
        method: 'POST',
        body,
      }),
    }),

    // POST /shops/:shopId/payments/:paymentId/receipt/regenerate
    regenerateReceipt: build.mutation<Payment, { shopId: string; paymentId: string }>({
      query: ({ shopId, paymentId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.RECEIPT_REGENERATE, { shopId, paymentId }),
        method: 'POST',
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      invalidatesTags: (_res, _err, { paymentId }) => [
        { type: 'Receipt', id: paymentId },
      ],
    }),

    // ══════════════════════════════════════════
    // 6. PARTY-SPECIFIC PAYMENTS
    // ══════════════════════════════════════════

    // GET /shops/:shopId/payments/party/:partyId
    getPartyPayments: build.query<
      PaymentsResponse,
      {
        shopId: string
        partyId: string
        page?: number
        limit?: number
        paymentType?: string
        status?: string
      }
    >({
      query: ({ shopId, partyId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.PARTY_PAYMENTS, { shopId, partyId }),
        params,
      }),
      providesTags: (_res, _err, { partyId }) => [
        { type: 'PartyPayments', id: partyId },
      ],
    }),

    // GET /shops/:shopId/payments/party/:partyId/summary
    getPartyPaymentSummary: build.query<
      PartyPaymentSummary,
      { shopId: string; partyId: string }
    >({
      query: ({ shopId, partyId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.PARTY_PAYMENT_SUMMARY, { shopId, partyId }),
      }),
      transformResponse: (res: PartyPaymentSummaryResponse) => res.data,
      providesTags: (_res, _err, { partyId }) => [
        { type: 'PartyPaymentSummary', id: partyId },
      ],
    }),

    // GET /shops/:shopId/payments/customers/:customerId
    getCustomerPayments: build.query<
      PaymentsResponse,
      { shopId: string; customerId: string; page?: number; limit?: number }
    >({
      query: ({ shopId, customerId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.CUSTOMER_PAYMENTS, { shopId, customerId }),
        params,
      }),
      providesTags: (_res, _err, { customerId }) => [
        { type: 'PartyPayments', id: customerId },
      ],
    }),

    // GET /shops/:shopId/payments/suppliers/:supplierId
    getSupplierPayments: build.query<
      PaymentsResponse,
      { shopId: string; supplierId: string; page?: number; limit?: number }
    >({
      query: ({ shopId, supplierId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.SUPPLIER_PAYMENTS, { shopId, supplierId }),
        params,
      }),
      providesTags: (_res, _err, { supplierId }) => [
        { type: 'PartyPayments', id: supplierId },
      ],
    }),

    // ══════════════════════════════════════════
    // 7. PAYMENT MODE ANALYTICS
    // ══════════════════════════════════════════

    // GET /shops/:shopId/payments/by-mode
    getPaymentsByMode: build.query<
      PaymentModeBreakdown[],
      { shopId: string; startDate?: string; endDate?: string }
    >({
      query: ({ shopId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.BY_MODE, { shopId }),
        params,
      }),
      transformResponse: (res: PaymentModeBreakdownResponse) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'PaymentAnalytics', id: shopId },
      ],
    }),

    // GET /shops/:shopId/payments/cash-collection
    getCashCollection: build.query<CashCollection, { shopId: string; date?: string }>({
      query: ({ shopId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.CASH_COLLECTION, { shopId }),
        params,
      }),
      transformResponse: (res: CashCollectionResponse) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'CashCollection', id: shopId },
      ],
    }),

    // GET /shops/:shopId/payments/digital-collection
    getDigitalCollection: build.query<
      DigitalCollection,
      { shopId: string; startDate?: string; endDate?: string }
    >({
      query: ({ shopId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.DIGITAL_COLLECTION, { shopId }),
        params,
      }),
      transformResponse: (res: DigitalCollectionResponse) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'PaymentAnalytics', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // 8. PAYMENT ANALYTICS & REPORTS
    // ══════════════════════════════════════════

    // GET /shops/:shopId/payments/analytics
    getPaymentAnalytics: build.query<
      PaymentAnalytics,
      { shopId: string; startDate?: string; endDate?: string; groupBy?: 'day' | 'week' | 'month' }
    >({
      query: ({ shopId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.ANALYTICS, { shopId }),
        params,
      }),
      transformResponse: (res: { success: boolean; data: PaymentAnalytics }) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'PaymentAnalytics', id: shopId },
      ],
    }),

    // GET /shops/:shopId/payments/dashboard
    getPaymentDashboard: build.query<PaymentDashboard, { shopId: string }>({
      query: ({ shopId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.DASHBOARD, { shopId }),
      }),
      transformResponse: (res: { success: boolean; data: PaymentDashboard }) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'PaymentDashboard', id: shopId },
      ],
    }),

    // GET /shops/:shopId/payments/today
    getTodayPayments: build.query<TodayPaymentsResponse['data'], { shopId: string }>({
      query: ({ shopId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.TODAY, { shopId }),
      }),
      transformResponse: (res: TodayPaymentsResponse) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'PaymentList', id: `today-${shopId}` },
      ],
    }),

    // GET /shops/:shopId/payments/pending
    getPendingPayments: build.query<Payment[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.PENDING_PAYMENTS, { shopId }),
      }),
      transformResponse: (res: PendingChequesResponse) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'PaymentList', id: `pending-${shopId}` },
      ],
    }),

    // GET /shops/:shopId/payments/failed
    getFailedPayments: build.query<Payment[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.FAILED_PAYMENTS, { shopId }),
      }),
      transformResponse: (res: PendingChequesResponse) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'PaymentList', id: `failed-${shopId}` },
      ],
    }),

    // ══════════════════════════════════════════
    // 9. PAYMENT REFERENCES
    // ══════════════════════════════════════════

    // GET /shops/:shopId/payments/reference/sale/:saleId
    getSalePayments: build.query<Payment[], { shopId: string; saleId: string }>({
      query: ({ shopId, saleId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.SALE_PAYMENTS, { shopId, saleId }),
      }),
      transformResponse: (res: PendingChequesResponse) => res.data,
      providesTags: (_res, _err, { saleId }) => [
        { type: 'ReferencePayments', id: `sale-${saleId}` },
      ],
    }),

    // GET /shops/:shopId/payments/reference/purchase/:purchaseId
    getPurchasePayments: build.query<Payment[], { shopId: string; purchaseId: string }>({
      query: ({ shopId, purchaseId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.PURCHASE_PAYMENTS, { shopId, purchaseId }),
      }),
      transformResponse: (res: PendingChequesResponse) => res.data,
      providesTags: (_res, _err, { purchaseId }) => [
        { type: 'ReferencePayments', id: `purchase-${purchaseId}` },
      ],
    }),

    // ══════════════════════════════════════════
    // 10. ADVANCED SEARCH & FILTERS
    // ══════════════════════════════════════════

    // GET /shops/:shopId/payments/search
    searchPayments: build.query<Payment[], { shopId: string; q: string; limit?: number }>({
      query: ({ shopId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.SEARCH, { shopId }),
        params,
      }),
      transformResponse: (res: PendingChequesResponse) => res.data,
      providesTags: ['PaymentSearch'],
    }),

    // Lazy version for manual trigger (e.g. search input)
    lazySearchPayments: build.query<Payment[], { shopId: string; q: string; limit?: number }>({
      query: ({ shopId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.SEARCH, { shopId }),
        params,
      }),
      transformResponse: (res: PendingChequesResponse) => res.data,
    }),

    // GET /shops/:shopId/payments/by-date-range
    getPaymentsByDateRange: build.query<
      PaymentsResponse,
      { shopId: string; startDate: string; endDate: string; page?: number; limit?: number }
    >({
      query: ({ shopId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.BY_DATE_RANGE, { shopId }),
        params,
      }),
      providesTags: (_res, _err, { shopId }) => [
        { type: 'PaymentList', id: shopId },
      ],
    }),

    // GET /shops/:shopId/payments/by-amount-range
    getPaymentsByAmountRange: build.query<
      PaymentsResponse,
      {
        shopId: string
        minAmount: number
        maxAmount: number
        page?: number
        limit?: number
      }
    >({
      query: ({ shopId, ...params }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.BY_AMOUNT_RANGE, { shopId }),
        params,
      }),
      providesTags: (_res, _err, { shopId }) => [
        { type: 'PaymentList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // 11. BULK OPERATIONS
    // ══════════════════════════════════════════

    // POST /shops/:shopId/payments/bulk-reconcile
    bulkReconcilePayments: build.mutation<
      BulkOperationResult,
      { shopId: string } & BulkReconcileRequest
    >({
      query: ({ shopId, ...body }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.BULK_RECONCILE, { shopId }),
        method: 'POST',
        body,
      }),
      invalidatesTags: (_res, _err, { shopId }) => [
        { type: 'PaymentList', id: shopId },
        { type: 'UnreconciledPayments', id: shopId },
        { type: 'ReconciliationSummary', id: shopId },
      ],
    }),

    // POST /shops/:shopId/payments/bulk-export
    bulkExportPayments: build.mutation<
      { data: Payment[]; count: number; format: ExportFormat },
      { shopId: string } & BulkExportRequest
    >({
      query: ({ shopId, ...body }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.BULK_EXPORT, { shopId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: {
        success: boolean
        data: Payment[]
        count: number
        format: ExportFormat
      }) => ({ data: res.data, count: res.count, format: res.format }),
    }),

    // POST /shops/:shopId/payments/bulk-print-receipts
    bulkPrintReceipts: build.mutation<
      { data: Payment[]; count: number },
      { shopId: string; paymentIds: string[] }
    >({
      query: ({ shopId, paymentIds }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.BULK_PRINT_RECEIPTS, { shopId }),
        method: 'POST',
        body: { paymentIds },
      }),
      transformResponse: (res: PendingChequesResponse) => ({
        data: res.data,
        count: res.count,
      }),
    }),

    // ══════════════════════════════════════════
    // 12. PAYMENT APPROVAL
    // ══════════════════════════════════════════

    // POST /shops/:shopId/payments/:paymentId/approve
    approvePayment: build.mutation<
      Payment,
      { shopId: string; paymentId: string } & ApprovalRequest
    >({
      query: ({ shopId, paymentId, ...body }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.APPROVE, { shopId, paymentId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      invalidatesTags: (_res, _err, { shopId, paymentId }) => [
        { type: 'Payment', id: paymentId },
        { type: 'PaymentList', id: shopId },
      ],
    }),

    // POST /shops/:shopId/payments/:paymentId/reject
    rejectPayment: build.mutation<
      Payment,
      { shopId: string; paymentId: string } & RejectPaymentRequest
    >({
      query: ({ shopId, paymentId, ...body }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.REJECT, { shopId, paymentId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      invalidatesTags: (_res, _err, { shopId, paymentId }) => [
        { type: 'Payment', id: paymentId },
        { type: 'PaymentList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // 13. REFUND MANAGEMENT
    // ══════════════════════════════════════════

    // POST /shops/:shopId/payments/:paymentId/refund
    processRefund: build.mutation<
      Payment,
      { shopId: string; paymentId: string } & ProcessRefundRequest
    >({
      query: ({ shopId, paymentId, ...body }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.REFUND, { shopId, paymentId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: PaymentResponse) => res.data!,
      invalidatesTags: (_res, _err, { shopId, paymentId }) => [
        { type: 'Payment', id: paymentId },
        { type: 'PaymentList', id: shopId },
        { type: 'Refunds', id: shopId },
        { type: 'PaymentDashboard', id: shopId },
      ],
    }),

    // GET /shops/:shopId/payments/refunds
    getRefunds: build.query<Payment[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: buildUrl(PAYMENT_ENDPOINTS.REFUNDS, { shopId }),
      }),
      transformResponse: (res: PendingChequesResponse) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'Refunds', id: shopId },
      ],
    }),
  }),
})

// ─────────────────────────────────────────────────────────────
// EXPORT ALL AUTO-GENERATED HOOKS
// ─────────────────────────────────────────────────────────────

export const {
  // CRUD
  useCreatePaymentMutation,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,

  // Status
  useUpdatePaymentStatusMutation,
  useMarkPaymentAsCompletedMutation,
  useCancelPaymentMutation,

  // Cheques
  useGetPendingChequesQuery,
  useClearChequeMutation,
useBounceChequeMutation,
  useGetBouncedChequesQuery,
  useGetClearedChequesQuery,

  // Reconciliation
  useGetUnreconciledPaymentsQuery,
  useReconcilePaymentMutation,
  useGetReconciliationSummaryQuery,

  // Receipts
  useGetReceiptQuery,
  useSendReceiptMutation,
  useRegenerateReceiptMutation,

  // Party
  useGetPartyPaymentsQuery,
  useGetPartyPaymentSummaryQuery,
  useGetCustomerPaymentsQuery,
  useGetSupplierPaymentsQuery,

  // Mode Analytics
  useGetPaymentsByModeQuery,
  useGetCashCollectionQuery,
  useGetDigitalCollectionQuery,

  // Reports
  useGetPaymentAnalyticsQuery,
  useGetPaymentDashboardQuery,
  useGetTodayPaymentsQuery,
  useGetPendingPaymentsQuery,
  useGetFailedPaymentsQuery,

  // References
  useGetSalePaymentsQuery,
  useGetPurchasePaymentsQuery,

  // Search & Filters
  useSearchPaymentsQuery,
  useLazySearchPaymentsQuery,
  useGetPaymentsByDateRangeQuery,
  useGetPaymentsByAmountRangeQuery,

  // Bulk
  useBulkReconcilePaymentsMutation,
  useBulkExportPaymentsMutation,
  useBulkPrintReceiptsMutation,

  // Approval
  useApprovePaymentMutation,
  useRejectPaymentMutation,

  // Refunds
  useProcessRefundMutation,
  useGetRefundsQuery,
} = paymentApi