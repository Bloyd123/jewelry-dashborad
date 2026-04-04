// FILE: src/store/api/productApi.ts
// ================================================================
// RTK Query API Slice — Product Module
// PDF pattern follow kiya hai exactly
// ================================================================

import { baseApi } from './baseApi'
import { PRODUCT_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  Product,
  ProductListResponse,
  ProductDetailResponse,
  ProductMutationResponse,
  ProductSearchResponse,
  StockUpdateResponse,
  ReserveProductResponse,
  CancelReservationResponse,
  MarkAsSoldResponse,
  CalculatePriceResponse,
  LowStockResponse,
  ProductHistoryResponse,
  ProductAnalyticsResponse,
  BulkDeleteResponse,
  BulkUpdateStatusResponse,
  GetProductsInput,
  SearchProductsInput,
  CreateProductInput,
  UpdateProductInput,
  UpdateStockInput,
  ReserveProductInput,
  MarkAsSoldInput,
  CalculatePriceInput,
  GetLowStockInput,
  GetProductHistoryInput,
  BulkDeleteInput,
  BulkUpdateStatusInput,
} from '@/types/product.types'

// ================================================================
// ENDPOINTS FILE MEIN YEH ADD KARO
// src/api/endpoints.ts
// ================================================================
//
// const BASE_URL = `/api/v1`
//
// export const PRODUCT_ENDPOINTS = {
//   GET_ALL:            `${BASE_URL}/shops/:shopId/products`,
//   GET_BY_ID:          `${BASE_URL}/shops/:shopId/products/:id`,
//   SEARCH:             `${BASE_URL}/shops/:shopId/products/search`,
//   LOW_STOCK:          `${BASE_URL}/shops/:shopId/products/low-stock`,
//   ANALYTICS:          `${BASE_URL}/shops/:shopId/products/analytics`,
//   CREATE:             `${BASE_URL}/shops/:shopId/products`,
//   UPDATE:             `${BASE_URL}/shops/:shopId/products/:id`,
//   DELETE:             `${BASE_URL}/shops/:shopId/products/:id`,
//   UPDATE_STOCK:       `${BASE_URL}/shops/:shopId/products/:id/stock`,
//   HISTORY:            `${BASE_URL}/shops/:shopId/products/:id/history`,
//   RESERVE:            `${BASE_URL}/shops/:shopId/products/:id/reserve`,
//   CANCEL_RESERVATION: `${BASE_URL}/shops/:shopId/products/:id/cancel-reservation`,
//   MARK_AS_SOLD:       `${BASE_URL}/shops/:shopId/products/:id/sold`,
//   CALCULATE_PRICE:    `${BASE_URL}/shops/:shopId/products/:id/calculate-price`,
//   BULK_DELETE:        `${BASE_URL}/shops/:shopId/products/bulk-delete`,
//   BULK_UPDATE_STATUS: `${BASE_URL}/shops/:shopId/products/bulk-update-status`,
// }

// ================================================================
// RTK QUERY API SLICE
// ================================================================

export const productApi = baseApi.injectEndpoints({
  endpoints: build => ({

    // ============================================================
    // GET ALL PRODUCTS (with filters + pagination)
    // ============================================================
    getProducts: build.query<ProductListResponse, GetProductsInput>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.GET_ALL, { shopId }),
        params, // page, limit, sort, category, metalType, status, etc.
      }),
      providesTags: (result, _error, { shopId }) => [
        { type: 'ProductList', id: shopId },
        ...(result?.data || []).map(product => ({
          type: 'Product' as const,
          id: product._id,
        })),
      ],
    }),

    // ============================================================
    // GET SINGLE PRODUCT BY ID
    // ============================================================
    getProductById: build.query<Product, { shopId: string; id: string }>({
      query: ({ shopId, id }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.GET_BY_ID, { shopId, id }),
      }),
      transformResponse: (response: ProductDetailResponse) => response.data,
      providesTags: (_result, _error, { id }) => [{ type: 'Product', id }],
    }),

    // ============================================================
    // SEARCH PRODUCTS
    // ============================================================
    searchProducts: build.query<ProductSearchResponse['data'], SearchProductsInput>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.SEARCH, { shopId }),
        params, // q, limit
      }),
      transformResponse: (response: ProductSearchResponse) => response.data,
      providesTags: ['ProductSearch'],
    }),

    // Manual trigger version (for search-as-you-type)
    lazySearchProducts: build.query<ProductSearchResponse['data'], SearchProductsInput>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.SEARCH, { shopId }),
        params,
      }),
      transformResponse: (response: ProductSearchResponse) => response.data,
    }),

    // ============================================================
    // GET LOW STOCK PRODUCTS
    // ============================================================
    getLowStockProducts: build.query<LowStockResponse, GetLowStockInput>({
      query: ({ shopId, threshold }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.LOW_STOCK, { shopId }),
        params: threshold !== undefined ? { threshold } : {},
      }),
      providesTags: (_result, _error, { shopId }) => [
        { type: 'ProductList', id: `lowstock-${shopId}` },
      ],
    }),

    // ============================================================
    // GET ANALYTICS
    // ============================================================
    getProductAnalytics: build.query<ProductAnalyticsResponse['data'], { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.ANALYTICS, { shopId }),
      }),
      transformResponse: (response: ProductAnalyticsResponse) => response.data,
      providesTags: (_result, _error, { shopId }) => [
        { type: 'ProductList', id: `analytics-${shopId}` },
      ],
    }),

    // ============================================================
    // GET PRODUCT HISTORY
    // ============================================================
    getProductHistory: build.query<ProductHistoryResponse['data'], GetProductHistoryInput>({
      query: ({ shopId, id, limit }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.HISTORY, { shopId, id }),
        params: limit !== undefined ? { limit } : {},
      }),
      transformResponse: (response: ProductHistoryResponse) => response.data,
      providesTags: (_result, _error, { id }) => [{ type: 'ProductHistory', id }],
    }),

    // ============================================================
    // CREATE PRODUCT
    // ============================================================
    createProduct: build.mutation<Product, { shopId: string } & CreateProductInput>({
      query: ({ shopId, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.CREATE, { shopId }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ProductMutationResponse) => response.data,
      invalidatesTags: (_result, _error, { shopId }) => [
        { type: 'ProductList', id: shopId },
        { type: 'ProductList', id: `analytics-${shopId}` },
        { type: 'ProductList', id: `lowstock-${shopId}` },
      ],
    }),

    // ============================================================
    // UPDATE PRODUCT
    // ============================================================
    updateProduct: build.mutation<Product, { shopId: string } & UpdateProductInput>({
      query: ({ shopId, id, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.UPDATE, { shopId, id }),
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ProductMutationResponse) => response.data,
      invalidatesTags: (_result, _error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
        { type: 'ProductList', id: `analytics-${shopId}` },
      ],
    }),

    // ============================================================
    // DELETE PRODUCT (Soft Delete)
    // ============================================================
    deleteProduct: build.mutation<void, { shopId: string; id: string }>({
      query: ({ shopId, id }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.DELETE, { shopId, id }),
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
        { type: 'ProductList', id: `analytics-${shopId}` },
        { type: 'ProductList', id: `lowstock-${shopId}` },
      ],
    }),

    // ============================================================
    // UPDATE STOCK
    // ============================================================
    updateStock: build.mutation<StockUpdateResponse['data'], { shopId: string } & UpdateStockInput>({
      query: ({ shopId, id, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.UPDATE_STOCK, { shopId, id }),
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: StockUpdateResponse) => response.data,
      invalidatesTags: (_result, _error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
        { type: 'ProductList', id: `lowstock-${shopId}` },
        { type: 'ProductHistory', id },
      ],
    }),

    // ============================================================
    // RESERVE PRODUCT
    // ============================================================
    reserveProduct: build.mutation<ReserveProductResponse['data'], { shopId: string } & ReserveProductInput>({
      query: ({ shopId, id, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.RESERVE, { shopId, id }),
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: ReserveProductResponse) => response.data,
      invalidatesTags: (_result, _error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
        { type: 'ProductHistory', id },
      ],
    }),

    // ============================================================
    // CANCEL RESERVATION
    // ============================================================
    cancelReservation: build.mutation<CancelReservationResponse['data'], { shopId: string; id: string }>({
      query: ({ shopId, id }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.CANCEL_RESERVATION, { shopId, id }),
        method: 'PATCH',
      }),
      transformResponse: (response: CancelReservationResponse) => response.data,
      invalidatesTags: (_result, _error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
      ],
    }),

    // ============================================================
    // MARK AS SOLD
    // ============================================================
    markAsSold: build.mutation<MarkAsSoldResponse['data'], { shopId: string } & MarkAsSoldInput>({
      query: ({ shopId, id, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.MARK_AS_SOLD, { shopId, id }),
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: MarkAsSoldResponse) => response.data,
      invalidatesTags: (_result, _error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
        { type: 'ProductList', id: `analytics-${shopId}` },
        { type: 'ProductHistory', id },
      ],
    }),

    // ============================================================
    // CALCULATE / RECALCULATE PRICE
    // ============================================================
    calculatePrice: build.mutation<CalculatePriceResponse['data'], { shopId: string } & CalculatePriceInput>({
      query: ({ shopId, id, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.CALCULATE_PRICE, { shopId, id }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: CalculatePriceResponse) => response.data,
      invalidatesTags: (_result, _error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
      ],
    }),

    // ============================================================
    // BULK DELETE
    // ============================================================
    bulkDeleteProducts: build.mutation<BulkDeleteResponse['data'], { shopId: string } & BulkDeleteInput>({
      query: ({ shopId, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.BULK_DELETE, { shopId }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: BulkDeleteResponse) => response.data,
      invalidatesTags: (_result, _error, { shopId }) => [
        { type: 'ProductList', id: shopId },
        { type: 'ProductList', id: `analytics-${shopId}` },
        { type: 'ProductList', id: `lowstock-${shopId}` },
      ],
    }),

    // ============================================================
    // BULK UPDATE STATUS
    // ============================================================
    bulkUpdateStatus: build.mutation<BulkUpdateStatusResponse['data'], { shopId: string } & BulkUpdateStatusInput>({
      query: ({ shopId, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.BULK_UPDATE_STATUS, { shopId }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: BulkUpdateStatusResponse) => response.data,
      invalidatesTags: (_result, _error, { shopId }) => [
        { type: 'ProductList', id: shopId },
        { type: 'ProductList', id: `analytics-${shopId}` },
        { type: 'ProductList', id: `lowstock-${shopId}` },
      ],
    }),

  }),
})

// ================================================================
// EXPORT HOOKS (Auto-generated by RTK Query)
// ================================================================

export const {
  // Queries
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useGetLowStockProductsQuery,
  useGetProductAnalyticsQuery,
  useGetProductHistoryQuery,

  // Lazy queries (manual trigger)
  useLazyGetProductsQuery,
  useLazyGetProductByIdQuery,
  useLazyGetLowStockProductsQuery,

  // Mutations
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStockMutation,
  useReserveProductMutation,
  useCancelReservationMutation,
  useMarkAsSoldMutation,
  useCalculatePriceMutation,
  useBulkDeleteProductsMutation,
  useBulkUpdateStatusMutation,
} = productApi