// FILE: src/store/api/productApi.ts
import { baseApi } from './baseApi'
import { PRODUCT_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams, buildQueryString } from '@/utils/api'
import type {
  Product,
  ProductListResponse,
  ProductFilters,
  ProductFormData,
  StockUpdateData,
  StockUpdateResponse,
  ReservationData,
  ReservationResponse,
  SaleData,
  SaleResponse,
  PriceCalculationData,
  PriceCalculationResponse,
  BulkDeleteData,
  BulkDeleteResponse,
  BulkUpdateStatusData,
  BulkUpdateStatusResponse,
  LowStockResponse,
  ProductHistoryResponse,
  ProductAnalytics,
} from '@/types/product.types'

export const productApi = baseApi.injectEndpoints({
  endpoints: build => ({
    //  GET ALL PRODUCTS (with filters & pagination)

    getProducts: build.query<
      ProductListResponse,
      ProductFilters & { shopId: string }
    >({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.GET_ALL, { shopId }),
        params,
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'ProductList', id: shopId },
        ...(result?.data || []).map(product => ({
          type: 'Product' as const,
          id: product._id,
        })),
      ],
    }),

    //  GET SINGLE PRODUCT BY ID

    getProductById: build.query<Product, { shopId: string; id: string }>({
      query: ({ shopId, id }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.GET_BY_ID, { shopId, id }),
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),

    //  SEARCH PRODUCTS (Quick search for POS)

    searchProducts: build.query<
      Product[],
      {
        shopId: string
        q: string
        limit?: number
      }
    >({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.SEARCH, { shopId }),
        params,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ['ProductSearch'],
    }),

    //  GET LOW STOCK PRODUCTS

    getLowStock: build.query<
      LowStockResponse,
      {
        shopId: string
        threshold?: number
      }
    >({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.LOW_STOCK, { shopId }),
        params,
      }),
      transformResponse: (response: any) => ({
        products: response.data,
        meta: response.meta,
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'ProductList', id: `${shopId}-low-stock` },
      ],
    }),

    //  GET PRODUCT ANALYTICS

    getProductAnalytics: build.query<ProductAnalytics, { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.ANALYTICS, { shopId }),
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, { shopId }) => [
        { type: 'ProductAnalytics', id: shopId },
      ],
    }),

    //  GET PRODUCT HISTORY

    getProductHistory: build.query<
      ProductHistoryResponse,
      {
        shopId: string
        id: string
        limit?: number
      }
    >({
      query: ({ shopId, id, limit }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.HISTORY, { shopId, id }),
        params: { limit },
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, { id }) => [{ type: 'ProductHistory', id }],
    }),

    //  CREATE PRODUCT

    createProduct: build.mutation<
      Product,
      ProductFormData & { shopId: string }
    >({
      query: ({ shopId, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.CREATE, { shopId }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'ProductList', id: shopId },
        { type: 'ProductAnalytics', id: shopId },
      ],
    }),

    // ✏️ UPDATE PRODUCT

    updateProduct: build.mutation<
      Product,
      Partial<ProductFormData> & {
        shopId: string
        id: string
      }
    >({
      query: ({ shopId, id, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.UPDATE, { shopId, id }),
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
        { type: 'ProductAnalytics', id: shopId },
      ],
    }),

    // 🗑 DELETE PRODUCT

    deleteProduct: build.mutation<void, { shopId: string; id: string }>({
      query: ({ shopId, id }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.DELETE, { shopId, id }),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
        { type: 'ProductAnalytics', id: shopId },
      ],
    }),

    // 📦 UPDATE STOCK

    updateStock: build.mutation<
      StockUpdateResponse,
      StockUpdateData & {
        shopId: string
        id: string
      }
    >({
      query: ({ shopId, id, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.UPDATE_STOCK, { shopId, id }),
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
        { type: 'ProductHistory', id },
        { type: 'ProductAnalytics', id: shopId },
      ],
    }),

    // 🔒 RESERVE PRODUCT

    reserveProduct: build.mutation<
      ReservationResponse,
      ReservationData & {
        shopId: string
        id: string
      }
    >({
      query: ({ shopId, id, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.RESERVE, { shopId, id }),
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
        { type: 'ProductHistory', id },
      ],
    }),

    // 🔓 CANCEL RESERVATION

    cancelReservation: build.mutation<
      ReservationResponse,
      {
        shopId: string
        id: string
      }
    >({
      query: ({ shopId, id }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.CANCEL_RESERVATION, {
          shopId,
          id,
        }),
        method: 'PATCH',
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
        { type: 'ProductHistory', id },
      ],
    }),

    //  MARK AS SOLD

    markAsSold: build.mutation<
      SaleResponse,
      SaleData & {
        shopId: string
        id: string
      }
    >({
      query: ({ shopId, id, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.MARK_AS_SOLD, { shopId, id }),
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
        { type: 'ProductHistory', id },
        { type: 'ProductAnalytics', id: shopId },
      ],
    }),

    //  CALCULATE PRICE

    calculatePrice: build.mutation<
      PriceCalculationResponse,
      PriceCalculationData & {
        shopId: string
        id: string
      }
    >({
      query: ({ shopId, id, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.CALCULATE_PRICE, {
          shopId,
          id,
        }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Product', id },
        { type: 'ProductList', id: shopId },
      ],
    }),

    // 🗑️ BULK DELETE

    bulkDeleteProducts: build.mutation<
      BulkDeleteResponse,
      BulkDeleteData & {
        shopId: string
      }
    >({
      query: ({ shopId, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.BULK_DELETE, { shopId }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'ProductList', id: shopId },
        { type: 'ProductAnalytics', id: shopId },
      ],
    }),

    // ✏️ BULK UPDATE STATUS

    bulkUpdateStatus: build.mutation<
      BulkUpdateStatusResponse,
      BulkUpdateStatusData & {
        shopId: string
      }
    >({
      query: ({ shopId, ...data }) => ({
        url: replacePathParams(PRODUCT_ENDPOINTS.BULK_UPDATE_STATUS, {
          shopId,
        }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'ProductList', id: shopId },
        { type: 'ProductAnalytics', id: shopId },
      ],
    }),
  }),
})

//
// 🎣 EXPORT HOOKS
//
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useGetLowStockQuery,
  useGetProductAnalyticsQuery,
  useGetProductHistoryQuery,
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
