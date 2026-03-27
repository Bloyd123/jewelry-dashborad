// FILE: src/store/api/salesApi.ts
import { baseApi } from './baseApi'
import { replacePathParams } from '@/utils/api'
import type {
  Sale,
  SalesFilters,
  CreateSaleRequest,
  UpdateSaleRequest,
  PaginatedSalesResponse,
  SingleSaleResponse,
  AddPaymentRequest,
  ReturnSaleRequest,
  ApplyDiscountRequest,
  SendInvoiceRequest,
  BulkOperationRequest,
  SalesAnalytics,
  SalesDashboard,
  CustomerSalesSummary,
  SalesPersonPerformance,
  OldGoldItem,
  Document,
  SaleStatus,
} from '@/types/sale.types'
import {SALE_ENDPOINTS} from '@/api/endpoints'


export const salesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    getSales: build.query<PaginatedSalesResponse, { shopId: string } & SalesFilters>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(SALE_ENDPOINTS.GET_ALL, { shopId }),
        params,
      }),
      providesTags: (result, _error, { shopId }) => [
        { type: 'SaleList', id: shopId },
        ...(result?.data?.sales || []).map((sale) => ({
          type: 'Sale' as const,
          id: sale._id,
        })),
      ],
    }),

    getSaleById: build.query<Sale, { shopId: string; saleId: string }>({
      query: ({ shopId, saleId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.GET_BY_ID, { shopId, saleId }),
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      providesTags: (_result, _error, { saleId }) => [{ type: 'Sale', id: saleId }],
    }),

    createSale: build.mutation<Sale, { shopId: string } & CreateSaleRequest>({
      query: ({ shopId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.CREATE, { shopId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId }) => [
        { type: 'SaleList', id: shopId },
        { type: 'SaleDashboard', id: shopId },
      ],
    }),

    updateSale: build.mutation<Sale, { shopId: string; saleId: string } & UpdateSaleRequest>({
      query: ({ shopId, saleId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.UPDATE, { shopId, saleId }),
        method: 'PUT',
        body,
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
      ],
    }),

    deleteSale: build.mutation<void, { shopId: string; saleId: string; reason?: string }>({
      query: ({ shopId, saleId, reason }) => ({
        url: replacePathParams(SALE_ENDPOINTS.DELETE, { shopId, saleId }),
        method: 'DELETE',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
        { type: 'SaleDashboard', id: shopId },
      ],
    }),

    updateSaleStatus: build.mutation<Sale, { shopId: string; saleId: string; status: SaleStatus }>({
      query: ({ shopId, saleId, status }) => ({
        url: replacePathParams(SALE_ENDPOINTS.UPDATE_STATUS, { shopId, saleId }),
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
        { type: 'SaleDashboard', id: shopId },
      ],
    }),

    confirmSale: build.mutation<Sale, { shopId: string; saleId: string; notes?: string }>({
      query: ({ shopId, saleId, notes }) => ({
        url: replacePathParams(SALE_ENDPOINTS.CONFIRM, { shopId, saleId }),
        method: 'PATCH',
        body: { notes },
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
      ],
    }),

    deliverSale: build.mutation<
      Sale,
      {
        shopId: string
        saleId: string
        deliveryType: string
        deliveryAddress?: string
        receivedBy?: string
      }
    >({
      query: ({ shopId, saleId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.DELIVER, { shopId, saleId }),
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
      ],
    }),

    completeSale: build.mutation<Sale, { shopId: string; saleId: string }>({
      query: ({ shopId, saleId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.COMPLETE, { shopId, saleId }),
        method: 'PATCH',
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
        { type: 'SaleDashboard', id: shopId },
      ],
    }),

    cancelSale: build.mutation<
      Sale,
      { shopId: string; saleId: string; reason: string; refundAmount?: number }
    >({
      query: ({ shopId, saleId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.CANCEL, { shopId, saleId }),
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
        { type: 'SaleDashboard', id: shopId },
      ],
    }),
    addPayment: build.mutation<
      Sale,
      { shopId: string; saleId: string } & AddPaymentRequest
    >({
      query: ({ shopId, saleId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.ADD_PAYMENT, { shopId, saleId }),
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SalePayments', id: saleId },
        { type: 'SaleList', id: shopId },
        { type: 'SaleDashboard', id: shopId },
      ],
    }),

    getSalePayments: build.query<any, { shopId: string; saleId: string }>({
      query: ({ shopId, saleId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.GET_PAYMENTS, { shopId, saleId }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { saleId }) => [{ type: 'SalePayments', id: saleId }],
    }),

    generateReceipt: build.query<any, { shopId: string; saleId: string }>({
      query: ({ shopId, saleId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.GENERATE_RECEIPT, { shopId, saleId }),
      }),
      transformResponse: (res: any) => res.data,
    }),

    sendPaymentReminder: build.mutation<void, { shopId: string; saleId: string }>({
      query: ({ shopId, saleId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.SEND_REMINDER, { shopId, saleId }),
        method: 'POST',
      }),
    }),
    returnSale: build.mutation<
      Sale,
      { shopId: string; saleId: string } & ReturnSaleRequest
    >({
      query: ({ shopId, saleId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.RETURN, { shopId, saleId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
      ],
    }),

    getReturnDetails: build.query<any, { shopId: string; saleId: string }>({
      query: ({ shopId, saleId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.RETURN_DETAILS, { shopId, saleId }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { saleId }) => [{ type: 'Sale', id: saleId }],
    }),

    addOldGold: build.mutation<
      Sale,
      { shopId: string; saleId: string; oldGoldItems: OldGoldItem[]; totalOldGoldValue: number }
    >({
      query: ({ shopId, saleId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.ADD_OLD_GOLD, { shopId, saleId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
      ],
    }),

    removeOldGold: build.mutation<Sale, { shopId: string; saleId: string }>({
      query: ({ shopId, saleId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.REMOVE_OLD_GOLD, { shopId, saleId }),
        method: 'DELETE',
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
      ],
    }),
    generateInvoice: build.query<Blob, { shopId: string; saleId: string }>({
      query: ({ shopId, saleId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.GENERATE_INVOICE, { shopId, saleId }),
        responseHandler: (response) => response.blob(),
      }),
    }),

    sendInvoice: build.mutation<
      void,
      { shopId: string; saleId: string } & SendInvoiceRequest
    >({
      query: ({ shopId, saleId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.SEND_INVOICE, { shopId, saleId }),
        method: 'POST',
        body,
      }),
    }),

    printInvoice: build.mutation<
      any,
      { shopId: string; saleId: string; printerType?: 'thermal_80mm' | 'thermal_58mm' | 'A4' | 'A5' }
    >({
      query: ({ shopId, saleId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.PRINT_INVOICE, { shopId, saleId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: any) => res.data,
    }),
    applyDiscount: build.mutation<
      Sale,
      { shopId: string; saleId: string } & ApplyDiscountRequest
    >({
      query: ({ shopId, saleId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.APPLY_DISCOUNT, { shopId, saleId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
      ],
    }),

    removeDiscount: build.mutation<Sale, { shopId: string; saleId: string }>({
      query: ({ shopId, saleId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.REMOVE_DISCOUNT, { shopId, saleId }),
        method: 'DELETE',
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
      ],
    }),
    uploadDocument: build.mutation<
      Sale,
      {
        shopId: string
        saleId: string
        documentType: Document['documentType']
        documentUrl: string
        documentNumber?: string
      }
    >({
      query: ({ shopId, saleId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.UPLOAD_DOCUMENT, { shopId, saleId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { saleId }) => [
        { type: 'SaleDocuments', id: saleId },
        { type: 'Sale', id: saleId },
      ],
    }),

    getSaleDocuments: build.query<Document[], { shopId: string; saleId: string }>({
      query: ({ shopId, saleId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.GET_DOCUMENTS, { shopId, saleId }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { saleId }) => [{ type: 'SaleDocuments', id: saleId }],
    }),

    approveSale: build.mutation<Sale, { shopId: string; saleId: string; notes?: string }>({
      query: ({ shopId, saleId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.APPROVE, { shopId, saleId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
      ],
    }),

    rejectSale: build.mutation<Sale, { shopId: string; saleId: string; reason: string }>({
      query: ({ shopId, saleId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.REJECT, { shopId, saleId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: SingleSaleResponse) => res.data,
      invalidatesTags: (_result, _error, { shopId, saleId }) => [
        { type: 'Sale', id: saleId },
        { type: 'SaleList', id: shopId },
      ],
    }),
    getSalesAnalytics: build.query<
      SalesAnalytics,
      { shopId: string; startDate?: string; endDate?: string; groupBy?: 'day' | 'week' | 'month' | 'year' }
    >({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(SALE_ENDPOINTS.ANALYTICS, { shopId }),
        params,
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { shopId }) => [{ type: 'SaleAnalytics', id: shopId }],
    }),

    getSalesDashboard: build.query<SalesDashboard, { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.DASHBOARD, { shopId }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { shopId }) => [{ type: 'SaleDashboard', id: shopId }],
    }),

    getTodaySales: build.query<Sale[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.TODAY, { shopId }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { shopId }) => [{ type: 'SaleList', id: `today_${shopId}` }],
    }),

    getPendingSales: build.query<Sale[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.PENDING, { shopId }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { shopId }) => [{ type: 'SaleList', id: `pending_${shopId}` }],
    }),

    getUnpaidSales: build.query<Sale[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.UNPAID, { shopId }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { shopId }) => [{ type: 'SaleList', id: `unpaid_${shopId}` }],
    }),

    getOverdueSales: build.query<Sale[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.OVERDUE, { shopId }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { shopId }) => [{ type: 'SaleList', id: `overdue_${shopId}` }],
    }),
    searchSales: build.query<Sale[], { shopId: string; q: string; limit?: number }>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(SALE_ENDPOINTS.SEARCH, { shopId }),
        params,
      }),
      transformResponse: (res: any) => res.data,
      providesTags: ['SaleSearch'],
    }),

    getSalesByDateRange: build.query<
      PaginatedSalesResponse,
      { shopId: string; startDate: string; endDate: string } & SalesFilters
    >({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(SALE_ENDPOINTS.BY_DATE_RANGE, { shopId }),
        params,
      }),
      providesTags: (_result, _error, { shopId }) => [{ type: 'SaleList', id: shopId }],
    }),

    getSalesByAmountRange: build.query<
      PaginatedSalesResponse,
      { shopId: string; minAmount: number; maxAmount: number } & SalesFilters
    >({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(SALE_ENDPOINTS.BY_AMOUNT_RANGE, { shopId }),
        params,
      }),
      providesTags: (_result, _error, { shopId }) => [{ type: 'SaleList', id: shopId }],
    }),

    getCustomerSales: build.query<
      PaginatedSalesResponse,
      { shopId: string; customerId: string; page?: number; limit?: number }
    >({
      query: ({ shopId, customerId, ...params }) => ({
        url: replacePathParams(SALE_ENDPOINTS.CUSTOMER_SALES, { shopId, customerId }),
        params,
      }),
      providesTags: (_result, _error, { customerId }) => [
        { type: 'SaleList', id: `customer_${customerId}` },
      ],
    }),

    getCustomerSalesSummary: build.query<
      CustomerSalesSummary,
      { shopId: string; customerId: string }
    >({
      query: ({ shopId, customerId }) => ({
        url: replacePathParams(SALE_ENDPOINTS.CUSTOMER_SALES_SUMMARY, { shopId, customerId }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { customerId }) => [
        { type: 'SaleList', id: `customer_summary_${customerId}` },
      ],
    }),

    getSalesPersonSales: build.query<
      PaginatedSalesResponse,
      { shopId: string; userId: string; page?: number; limit?: number }
    >({
      query: ({ shopId, userId, ...params }) => ({
        url: replacePathParams(SALE_ENDPOINTS.SALESPERSON_SALES, { shopId, userId }),
        params,
      }),
      providesTags: (_result, _error, { userId }) => [
        { type: 'SaleList', id: `salesperson_${userId}` },
      ],
    }),

    getSalesPersonPerformance: build.query<
      SalesPersonPerformance,
      { shopId: string; userId: string; startDate?: string; endDate?: string }
    >({
      query: ({ shopId, userId, ...params }) => ({
        url: replacePathParams(SALE_ENDPOINTS.SALESPERSON_PERFORMANCE, { shopId, userId }),
        params,
      }),
      transformResponse: (res: any) => res.data,
    }),
    bulkDeleteSales: build.mutation<
      { deletedCount: number; totalRequested: number },
      { shopId: string } & BulkOperationRequest
    >({
      query: ({ shopId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.BULK_DELETE, { shopId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_result, _error, { shopId }) => [
        { type: 'SaleList', id: shopId },
        { type: 'SaleDashboard', id: shopId },
      ],
    }),

    bulkPrintInvoices: build.mutation<Blob, { shopId: string } & BulkOperationRequest>({
      query: ({ shopId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.BULK_PRINT, { shopId }),
        method: 'POST',
        body,
        responseHandler: (response) => response.blob(),
      }),
    }),

    bulkSendReminders: build.mutation<
      { sentCount: number; totalRequested: number; method: string },
      { shopId: string } & BulkOperationRequest
    >({
      query: ({ shopId, ...body }) => ({
        url: replacePathParams(SALE_ENDPOINTS.BULK_REMINDERS, { shopId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: any) => res.data,
    }),
  }),
})

export const {
  useGetSalesQuery,
  useGetSaleByIdQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,

  useUpdateSaleStatusMutation,
  useConfirmSaleMutation,
  useDeliverSaleMutation,
  useCompleteSaleMutation,
  useCancelSaleMutation,
  useAddPaymentMutation,
  useGetSalePaymentsQuery,
  useGenerateReceiptQuery,
  useSendPaymentReminderMutation,

  useReturnSaleMutation,
  useGetReturnDetailsQuery,

  useAddOldGoldMutation,
  useRemoveOldGoldMutation,
  useGenerateInvoiceQuery,
  useSendInvoiceMutation,
  usePrintInvoiceMutation,
  useApplyDiscountMutation,
  useRemoveDiscountMutation,

  useUploadDocumentMutation,
  useGetSaleDocumentsQuery,
  useApproveSaleMutation,
  useRejectSaleMutation,
  useGetSalesAnalyticsQuery,
  useGetSalesDashboardQuery,
  useGetTodaySalesQuery,
  useGetPendingSalesQuery,
  useGetUnpaidSalesQuery,
  useGetOverdueSalesQuery,
  useSearchSalesQuery,
  useLazySearchSalesQuery,
  useGetSalesByDateRangeQuery,
  useGetSalesByAmountRangeQuery,
  useGetCustomerSalesQuery,
  useGetCustomerSalesSummaryQuery,
  useGetSalesPersonSalesQuery,
  useGetSalesPersonPerformanceQuery,

  useBulkDeleteSalesMutation,
  useBulkPrintInvoicesMutation,
  useBulkSendRemindersMutation,
} = salesApi