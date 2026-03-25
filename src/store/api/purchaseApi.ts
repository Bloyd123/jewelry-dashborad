// FILE: src/store/api/purchaseApi.ts

import { baseApi } from './baseApi'
import { PURCHASE_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  IPurchase,
  IPurchaseListResponse,
  IPurchaseResponse,
  IPurchaseAnalytics,
  IPurchaseFilters,
  ICreatePurchaseForm,
  IUpdatePurchaseForm,
  IReceivePurchaseForm,
  IAddPaymentForm,
  IPaymentRecord,
  IDocument,
} from '@/types/purchase.types'

// ─────────────────────────────────────────────
// EXTRA INPUT TYPES (RTK Query ke liye)
// ─────────────────────────────────────────────

interface ShopInput {
  shopId: string
}

interface PurchaseInput extends ShopInput {
  purchaseId: string
}

interface GetAllPurchasesInput extends ShopInput, IPurchaseFilters {}

interface SearchInput extends ShopInput {
  q: string
  limit?: number
}

interface DateRangeInput extends ShopInput {
  startDate: string
  endDate: string
  page?: number
  limit?: number
}

interface BySupplierInput extends ShopInput {
  supplierId: string
  page?: number
  limit?: number
  status?: string
  paymentStatus?: string
}

interface UpdateStatusInput extends PurchaseInput {
  status: string
}

interface ReceiveInput extends PurchaseInput {
  data: IReceivePurchaseForm
}

interface CancelInput extends PurchaseInput {
  reason: string
}

interface ReturnInput extends PurchaseInput {
  reason: string
}

interface ApproveInput extends PurchaseInput {
  notes?: string
}

interface RejectInput extends PurchaseInput {
  reason: string
}

interface BulkIdsInput extends ShopInput {
  purchaseIds: string[]
}

interface AddPaymentInput extends PurchaseInput {
  data: IAddPaymentForm
}

interface UploadDocInput extends PurchaseInput {
  documentType: string
  documentUrl: string
  documentNumber?: string
}

// ─────────────────────────────────────────────
// RTK QUERY API SLICE
// ─────────────────────────────────────────────

export const purchaseApi = baseApi.injectEndpoints({
  endpoints: build => ({

    // ══════════════════════════════════════════
    // GET ALL PURCHASES
    // ══════════════════════════════════════════
    getPurchases: build.query<IPurchaseListResponse, GetAllPurchasesInput>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.GET_ALL, { shopId }),
        params,
      }),
      providesTags: (result, _error, { shopId }) => [
        { type: 'PurchaseList', id: shopId },
        ...(result?.data?.purchases ?? []).map(p => ({
          type: 'Purchase' as const,
          id: p._id,
        })),
      ],
    }),

    // ══════════════════════════════════════════
    // GET PURCHASE BY ID
    // ══════════════════════════════════════════
    getPurchaseById: build.query<IPurchase, PurchaseInput>({
      query: ({ shopId, purchaseId }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.GET_BY_ID, { shopId, purchaseId }),
      }),
      transformResponse: (res: IPurchaseResponse) => res.data,
      providesTags: (_result, _error, { purchaseId }) => [
        { type: 'Purchase', id: purchaseId },
      ],
    }),

    // ══════════════════════════════════════════
    // SEARCH PURCHASES
    // ══════════════════════════════════════════
    searchPurchases: build.query<IPurchase[], SearchInput>({
      query: ({ shopId, q, limit }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.SEARCH, { shopId }),
        params: { q, limit },
      }),
      transformResponse: (res: any) => res.data,
      providesTags: ['PurchaseSearch'],
    }),

    // ══════════════════════════════════════════
    // GET BY DATE RANGE
    // ══════════════════════════════════════════
    getPurchasesByDateRange: build.query<IPurchaseListResponse, DateRangeInput>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.BY_DATE_RANGE, { shopId }),
        params,
      }),
      providesTags: (result, _error, { shopId }) => [
        { type: 'PurchaseList', id: `${shopId}-daterange` },
      ],
    }),

    // ══════════════════════════════════════════
    // GET BY SUPPLIER
    // ══════════════════════════════════════════
    getPurchasesBySupplier: build.query<IPurchaseListResponse, BySupplierInput>({
      query: ({ shopId, supplierId, ...params }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.BY_SUPPLIER, { shopId, supplierId }),
        params,
      }),
      providesTags: (_result, _error, { supplierId }) => [
        { type: 'PurchaseList', id: `supplier-${supplierId}` },
      ],
    }),

    // ══════════════════════════════════════════
    // GET PENDING PURCHASES
    // ══════════════════════════════════════════
    getPendingPurchases: build.query<IPurchaseListResponse, ShopInput & { page?: number; limit?: number }>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.PENDING, { shopId }),
        params,
      }),
      providesTags: (_result, _error, { shopId }) => [
        { type: 'PurchaseList', id: `${shopId}-pending` },
      ],
    }),

    // ══════════════════════════════════════════
    // GET UNPAID PURCHASES
    // ══════════════════════════════════════════
    getUnpaidPurchases: build.query<IPurchaseListResponse, ShopInput & { page?: number; limit?: number }>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.UNPAID, { shopId }),
        params,
      }),
      providesTags: (_result, _error, { shopId }) => [
        { type: 'PurchaseList', id: `${shopId}-unpaid` },
      ],
    }),

    // ══════════════════════════════════════════
    // GET ANALYTICS
    // ══════════════════════════════════════════
    getPurchaseAnalytics: build.query<IPurchaseAnalytics, ShopInput & { startDate?: string; endDate?: string }>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.ANALYTICS, { shopId }),
        params,
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { shopId }) => [
        { type: 'PurchaseAnalytics', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // CREATE PURCHASE
    // ══════════════════════════════════════════
    createPurchase: build.mutation<IPurchase, ShopInput & ICreatePurchaseForm>({
      query: ({ shopId, ...data }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.CREATE, { shopId }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (res: IPurchaseResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId }) => [
        { type: 'PurchaseList', id: shopId },
        { type: 'PurchaseAnalytics', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // UPDATE PURCHASE
    // ══════════════════════════════════════════
    updatePurchase: build.mutation<IPurchase, PurchaseInput & IUpdatePurchaseForm>({
      query: ({ shopId, purchaseId, ...data }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.UPDATE, { shopId, purchaseId }),
        method: 'PUT',
        body: data,
      }),
      transformResponse: (res: IPurchaseResponse) => res.data,
      invalidatesTags: (_result, _error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // DELETE PURCHASE
    // ══════════════════════════════════════════
    deletePurchase: build.mutation<void, PurchaseInput>({
      query: ({ shopId, purchaseId }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.DELETE, { shopId, purchaseId }),
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // UPDATE STATUS
    // ══════════════════════════════════════════
    updatePurchaseStatus: build.mutation<IPurchase, UpdateStatusInput>({
      query: ({ shopId, purchaseId, status }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.UPDATE_STATUS, { shopId, purchaseId }),
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (res: IPurchaseResponse) => res.data,
      invalidatesTags: (_result, _error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // RECEIVE PURCHASE
    // ══════════════════════════════════════════
    receivePurchase: build.mutation<IPurchase, ReceiveInput>({
      query: ({ shopId, purchaseId, data }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.RECEIVE, { shopId, purchaseId }),
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: IPurchaseResponse) => res.data,
      invalidatesTags: (_result, _error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
        { type: 'PurchaseAnalytics', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // CANCEL PURCHASE
    // ══════════════════════════════════════════
    cancelPurchase: build.mutation<IPurchase, CancelInput>({
      query: ({ shopId, purchaseId, reason }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.CANCEL, { shopId, purchaseId }),
        method: 'PATCH',
        body: { reason },
      }),
      transformResponse: (res: IPurchaseResponse) => res.data,
      invalidatesTags: (_result, _error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // RETURN PURCHASE
    // ══════════════════════════════════════════
    returnPurchase: build.mutation<IPurchase, ReturnInput>({
      query: ({ shopId, purchaseId, reason }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.RETURN, { shopId, purchaseId }),
        method: 'PATCH',
        body: { reason },
      }),
      transformResponse: (res: IPurchaseResponse) => res.data,
      invalidatesTags: (_result, _error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // APPROVE PURCHASE
    // ══════════════════════════════════════════
    approvePurchase: build.mutation<IPurchase, ApproveInput>({
      query: ({ shopId, purchaseId, notes }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.APPROVE, { shopId, purchaseId }),
        method: 'POST',
        body: { notes },
      }),
      transformResponse: (res: IPurchaseResponse) => res.data,
      invalidatesTags: (_result, _error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // REJECT PURCHASE
    // ══════════════════════════════════════════
    rejectPurchase: build.mutation<IPurchase, RejectInput>({
      query: ({ shopId, purchaseId, reason }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.REJECT, { shopId, purchaseId }),
        method: 'POST',
        body: { reason },
      }),
      transformResponse: (res: IPurchaseResponse) => res.data,
      invalidatesTags: (_result, _error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // BULK APPROVE
    // ══════════════════════════════════════════
    bulkApprovePurchases: build.mutation<{ approvedCount: number }, BulkIdsInput>({
      query: ({ shopId, purchaseIds }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.BULK_APPROVE, { shopId }),
        method: 'POST',
        body: { purchaseIds },
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_result, _error, { shopId }) => [
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // BULK DELETE
    // ══════════════════════════════════════════
    bulkDeletePurchases: build.mutation<{ deletedCount: number }, BulkIdsInput>({
      query: ({ shopId, purchaseIds }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.BULK_DELETE, { shopId }),
        method: 'POST',
        body: { purchaseIds },
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_result, _error, { shopId }) => [
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // ADD PAYMENT
    // ══════════════════════════════════════════
    addPayment: build.mutation<any, AddPaymentInput>({
      query: ({ shopId, purchaseId, data }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.ADD_PAYMENT, { shopId, purchaseId }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_result, _error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchasePayments', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // GET PAYMENTS
    // ══════════════════════════════════════════
    getPurchasePayments: build.query<IPaymentRecord[], PurchaseInput>({
      query: ({ shopId, purchaseId }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.GET_PAYMENTS, { shopId, purchaseId }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { purchaseId }) => [
        { type: 'PurchasePayments', id: purchaseId },
      ],
    }),

    // ══════════════════════════════════════════
    // UPLOAD DOCUMENT
    // ══════════════════════════════════════════
    uploadDocument: build.mutation<IPurchase, UploadDocInput>({
      query: ({ shopId, purchaseId, ...data }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.UPLOAD_DOC, { shopId, purchaseId }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (res: IPurchaseResponse) => res.data,
      invalidatesTags: (_result, _error, { purchaseId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseDocs', id: purchaseId },
      ],
    }),

    // ══════════════════════════════════════════
    // GET DOCUMENTS
    // ══════════════════════════════════════════
    getPurchaseDocuments: build.query<IDocument[], PurchaseInput>({
      query: ({ shopId, purchaseId }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.GET_DOCS, { shopId, purchaseId }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { purchaseId }) => [
        { type: 'PurchaseDocs', id: purchaseId },
      ],
    }),
  }),
})

// ─────────────────────────────────────────────
// EXPORT ALL HOOKS
// ─────────────────────────────────────────────
export const {
  // Queries
  useGetPurchasesQuery,
  useGetPurchaseByIdQuery,
  useSearchPurchasesQuery,
  useLazySearchPurchasesQuery,
  useGetPurchasesByDateRangeQuery,
  useGetPurchasesBySupplierQuery,
  useGetPendingPurchasesQuery,
  useGetUnpaidPurchasesQuery,
  useGetPurchaseAnalyticsQuery,
  useGetPurchasePaymentsQuery,
  useGetPurchaseDocumentsQuery,

  // Mutations
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
  useUpdatePurchaseStatusMutation,
  useReceivePurchaseMutation,
  useCancelPurchaseMutation,
  useReturnPurchaseMutation,
  useApprovePurchaseMutation,
  useRejectPurchaseMutation,
  useBulkApprovePurchasesMutation,
  useBulkDeletePurchasesMutation,
  useAddPaymentMutation,
  useUploadDocumentMutation,
} = purchaseApi