// FILE: src/store/api/purchaseApi.ts
// Purchase Module RTK Query API Slice

import { baseApi } from './baseApi'
import { PURCHASE_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  IPurchase,
  IPurchaseListResponse,
  IPurchaseResponse,
  ICreatePurchaseForm,
  IUpdatePurchaseForm,
  IReceivePurchaseForm,
  IAddPaymentForm,
  IPurchaseFilters,
  IPurchaseAnalytics,
  IPaymentRecord,
  IDocument,
  PurchaseStatus,
} from '@/types/purchase.types'

/**
 * Purchase API Slice
 * All purchase-related API endpoints with automatic caching and invalidation
 */
export const purchaseApi = baseApi.injectEndpoints({
  endpoints: build => ({
    
    // 📋 GET ALL PURCHASES (with filters & pagination)
    
    getPurchases: build.query<
      IPurchaseListResponse,
      { shopId: string } & IPurchaseFilters
    >({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.GET_ALL, { shopId }),
        params,
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'PurchaseList', id: shopId },
        ...(result?.data?.purchases || []).map(purchase => ({
          type: 'Purchase' as const,
          id: purchase._id,
        })),
      ],
    }),

    
    // 👤 GET SINGLE PURCHASE BY ID
    
    getPurchaseById: build.query<
      IPurchase,
      { shopId: string; purchaseId: string }
    >({
      query: ({ shopId, purchaseId }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.GET_BY_ID, {
          shopId,
          purchaseId,
        }),
      }),
      transformResponse: (response: IPurchaseResponse) => response.data,
      providesTags: (result, error, { purchaseId }) => [
        { type: 'Purchase', id: purchaseId },
      ],
    }),

    
    // 🔍 SEARCH PURCHASES
    
    searchPurchases: build.query<
      IPurchase[],
      { shopId: string; q: string; limit?: number }
    >({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.SEARCH, { shopId }),
        params,
      }),
      transformResponse: (response: { success: boolean; data: IPurchase[] }) =>
        response.data,
      providesTags: ['PurchaseSearch'],
    }),

    
    // ➕ CREATE PURCHASE
    
    createPurchase: build.mutation<
      IPurchase,
      { shopId: string } & ICreatePurchaseForm
    >({
      query: ({ shopId, ...data }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.CREATE, { shopId }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: IPurchaseResponse) => response.data,
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'PurchaseList', id: shopId },
        'PurchaseAnalytics',
      ],
    }),

    
    // ✏️ UPDATE PURCHASE
    
    updatePurchase: build.mutation<
      IPurchase,
      { shopId: string; purchaseId: string } & IUpdatePurchaseForm
    >({
      query: ({ shopId, purchaseId, ...data }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.UPDATE, {
          shopId,
          purchaseId,
        }),
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IPurchaseResponse) => response.data,
      invalidatesTags: (result, error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    
    // 🗑️ DELETE PURCHASE
    
    deletePurchase: build.mutation<
      void,
      { shopId: string; purchaseId: string }
    >({
      query: ({ shopId, purchaseId }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.DELETE, {
          shopId,
          purchaseId,
        }),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    
    // 🔄 UPDATE PURCHASE STATUS
    
    updatePurchaseStatus: build.mutation<
      IPurchase,
      { shopId: string; purchaseId: string; status: PurchaseStatus }
    >({
      query: ({ shopId, purchaseId, status }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.UPDATE_STATUS, {
          shopId,
          purchaseId,
        }),
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (response: IPurchaseResponse) => response.data,
      invalidatesTags: (result, error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    
    // 📦 RECEIVE PURCHASE
    
    receivePurchase: build.mutation<
      IPurchase,
      { shopId: string; purchaseId: string } & IReceivePurchaseForm
    >({
      query: ({ shopId, purchaseId, ...data }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.RECEIVE, {
          shopId,
          purchaseId,
        }),
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: IPurchaseResponse) => response.data,
      invalidatesTags: (result, error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
        'ProductList', // Inventory updated
      ],
    }),

    
    // ❌ CANCEL PURCHASE
    
    cancelPurchase: build.mutation<
      IPurchase,
      { shopId: string; purchaseId: string; reason: string }
    >({
      query: ({ shopId, purchaseId, reason }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.CANCEL, {
          shopId,
          purchaseId,
        }),
        method: 'PATCH',
        body: { reason },
      }),
      transformResponse: (response: IPurchaseResponse) => response.data,
      invalidatesTags: (result, error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    
    // ✅ APPROVE PURCHASE
    
    approvePurchase: build.mutation<
      IPurchase,
      { shopId: string; purchaseId: string; notes?: string }
    >({
      query: ({ shopId, purchaseId, notes }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.APPROVE, {
          shopId,
          purchaseId,
        }),
        method: 'POST',
        body: { notes },
      }),
      transformResponse: (response: IPurchaseResponse) => response.data,
      invalidatesTags: (result, error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    
    // ❌ REJECT PURCHASE
    
    rejectPurchase: build.mutation<
      IPurchase,
      { shopId: string; purchaseId: string; reason: string }
    >({
      query: ({ shopId, purchaseId, reason }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.REJECT, {
          shopId,
          purchaseId,
        }),
        method: 'POST',
        body: { reason },
      }),
      transformResponse: (response: IPurchaseResponse) => response.data,
      invalidatesTags: (result, error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    
    // 💰 ADD PAYMENT
    
    addPayment: build.mutation<
      IPurchase,
      { shopId: string; purchaseId: string } & IAddPaymentForm
    >({
      query: ({ shopId, purchaseId, ...data }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.ADD_PAYMENT, {
          shopId,
          purchaseId,
        }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: IPurchaseResponse) => response.data,
      invalidatesTags: (result, error, { purchaseId, shopId }) => [
        { type: 'Purchase', id: purchaseId },
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    
    // 💵 GET PAYMENTS
    
    getPayments: build.query<
      IPaymentRecord[],
      { shopId: string; purchaseId: string }
    >({
      query: ({ shopId, purchaseId }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.GET_PAYMENTS, {
          shopId,
          purchaseId,
        }),
      }),
      transformResponse: (response: {
        success: boolean
        data: IPaymentRecord[]
      }) => response.data,
      providesTags: (result, error, { purchaseId }) => [
        { type: 'Purchase', id: purchaseId },
      ],
    }),

    
    // 🏢 GET PURCHASES BY SUPPLIER
    
    getPurchasesBySupplier: build.query<
      IPurchaseListResponse,
      { shopId: string; supplierId: string } & Partial<IPurchaseFilters>
    >({
      query: ({ shopId, supplierId, ...params }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.GET_BY_SUPPLIER, {
          shopId,
          supplierId,
        }),
        params,
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    
    // 📊 GET PURCHASE ANALYTICS
    
    getPurchaseAnalytics: build.query<
      IPurchaseAnalytics,
      { shopId: string; startDate?: string; endDate?: string }
    >({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.GET_ANALYTICS, { shopId }),
        params,
      }),
      transformResponse: (response: {
        success: boolean
        data: IPurchaseAnalytics
      }) => response.data,
      providesTags: ['PurchaseAnalytics'],
    }),

    
    // ⏳ GET PENDING PURCHASES
    
    getPendingPurchases: build.query<IPurchase[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.GET_PENDING, { shopId }),
      }),
      transformResponse: (response: { success: boolean; data: IPurchase[] }) =>
        response.data,
      providesTags: (result, error, { shopId }) => [
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    
    // 💳 GET UNPAID PURCHASES
    
    getUnpaidPurchases: build.query<IPurchase[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.GET_UNPAID, { shopId }),
      }),
      transformResponse: (response: { success: boolean; data: IPurchase[] }) =>
        response.data,
      providesTags: (result, error, { shopId }) => [
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    
    // 🗑️ BULK DELETE PURCHASES
    
    bulkDeletePurchases: build.mutation<
      { deletedCount: number },
      { shopId: string; purchaseIds: string[] }
    >({
      query: ({ shopId, purchaseIds }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.BULK_DELETE, { shopId }),
        method: 'POST',
        body: { purchaseIds },
      }),
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    
    // ✅ BULK APPROVE PURCHASES
    
    bulkApprovePurchases: build.mutation<
      { approvedCount: number },
      { shopId: string; purchaseIds: string[] }
    >({
      query: ({ shopId, purchaseIds }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.BULK_APPROVE, { shopId }),
        method: 'POST',
        body: { purchaseIds },
      }),
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'PurchaseList', id: shopId },
      ],
    }),

    
    // 📄 UPLOAD DOCUMENT
    
    uploadDocument: build.mutation<
      IPurchase,
      {
        shopId: string
        purchaseId: string
        documentType: string
        documentUrl: string
        documentNumber?: string
      }
    >({
      query: ({ shopId, purchaseId, ...data }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.UPLOAD_DOCUMENT, {
          shopId,
          purchaseId,
        }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: IPurchaseResponse) => response.data,
      invalidatesTags: (result, error, { purchaseId }) => [
        { type: 'Purchase', id: purchaseId },
      ],
    }),

    
    // 📄 GET DOCUMENTS
    
    getDocuments: build.query<
      IDocument[],
      { shopId: string; purchaseId: string }
    >({
      query: ({ shopId, purchaseId }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.GET_DOCUMENTS, {
          shopId,
          purchaseId,
        }),
      }),
      transformResponse: (response: { success: boolean; data: IDocument[] }) =>
        response.data,
      providesTags: (result, error, { purchaseId }) => [
        { type: 'Purchase', id: purchaseId },
      ],
    }),

    
    // 📅 GET PURCHASES BY DATE RANGE
    
    getPurchasesByDateRange: build.query<
      IPurchaseListResponse,
      {
        shopId: string
        startDate: string
        endDate: string
        page?: number
        limit?: number
      }
    >({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PURCHASE_ENDPOINTS.BY_DATE_RANGE, { shopId }),
        params,
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'PurchaseList', id: shopId },
      ],
    }),
  }),
})


// 🎣 EXPORT HOOKS (Auto-generated by RTK Query)

export const {
  // Queries
  useGetPurchasesQuery,
  useGetPurchaseByIdQuery,
  useSearchPurchasesQuery,
  useLazySearchPurchasesQuery,
  useGetPaymentsQuery,
  useGetPurchasesBySupplierQuery,
  useGetPurchaseAnalyticsQuery,
  useGetPendingPurchasesQuery,
  useGetUnpaidPurchasesQuery,
  useGetDocumentsQuery,
  useGetPurchasesByDateRangeQuery,

  // Mutations
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
  useUpdatePurchaseStatusMutation,
  useReceivePurchaseMutation,
  useCancelPurchaseMutation,
  useApprovePurchaseMutation,
  useRejectPurchaseMutation,
  useAddPaymentMutation,
  useBulkDeletePurchasesMutation,
  useBulkApprovePurchasesMutation,
  useUploadDocumentMutation,
} = purchaseApi

export default purchaseApi