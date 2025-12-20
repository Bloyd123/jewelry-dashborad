// ============================================================================
// FILE: src/api/services/customerService.ts
// Customer API Service with RTK Query
// ============================================================================

import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/api/baseQuery'
import { API_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api/replacePathParams'
import { buildQueryString } from '@/utils/api/buildQueryString'
import type {
  ApiResponse,
  PaginatedResponse,
  Customer,
  CustomerListItem,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerQueryParams,
  CustomerStatistics,
  BlacklistCustomerRequest,
  LoyaltyPointsRequest,
  CustomerSearchResult,
  ID,
} from '@/types'

// ============================================================================
// CUSTOMER API
// ============================================================================

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Customer', 'Customers', 'CustomerStatistics'],

  endpoints: builder => ({
    // ========================================================================
    // CREATE CUSTOMER
    // ========================================================================
    createCustomer: builder.mutation<
      ApiResponse<{ customer: Customer }>,
      { shopId: ID; data: CreateCustomerRequest }
    >({
      query: ({ shopId, data }) => {
        const url = replacePathParams(API_ENDPOINTS.CUSTOMERS.BASE, { shopId })
        return {
          url,
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: ['Customers', 'CustomerStatistics'],
    }),

    // ========================================================================
    // GET ALL CUSTOMERS (with pagination & filters)
    // ========================================================================
    getCustomers: builder.query<
      ApiResponse<PaginatedResponse<CustomerListItem>>,
      CustomerQueryParams
    >({
      query: params => {
        const { shopId, ...queryParams } = params
        const baseUrl = replacePathParams(API_ENDPOINTS.CUSTOMERS.BASE, {
          shopId,
        })
        const queryString = buildQueryString(queryParams)
        return `${baseUrl}${queryString}`
      },
      providesTags: result =>
        result?.data.data
          ? [
              ...result.data.data.map(({ _id }) => ({
                type: 'Customer' as const,
                id: _id,
              })),
              { type: 'Customers' as const, id: 'LIST' },
            ]
          : [{ type: 'Customers' as const, id: 'LIST' }],
    }),

    // ========================================================================
    // GET SINGLE CUSTOMER BY ID
    // ========================================================================
    getCustomer: builder.query<
      ApiResponse<{ customer: Customer }>,
      { shopId: ID; customerId: ID }
    >({
      query: ({ shopId, customerId }) => {
        const url = replacePathParams(API_ENDPOINTS.CUSTOMERS.BY_ID, {
          shopId,
          id: customerId,
        })
        return url
      },
      providesTags: (_result, _error, { customerId }) => [
        { type: 'Customer', id: customerId },
      ],
    }),

    // ========================================================================
    // SEARCH CUSTOMER (by phone/email/code)
    // ========================================================================
    searchCustomer: builder.query<
      ApiResponse<{ exists: boolean; customer: CustomerSearchResult | null }>,
      {
        shopId: ID
        phone?: string
        email?: string
        customerCode?: string
        search?: string
      }
    >({
      query: ({ shopId, ...searchParams }) => {
        const baseUrl = replacePathParams(
          `${API_ENDPOINTS.CUSTOMERS.BASE}/search`,
          {
            shopId,
          }
        )
        const queryString = buildQueryString(searchParams)
        return `${baseUrl}${queryString}`
      },
    }),

    // ========================================================================
    // UPDATE CUSTOMER
    // ========================================================================
    updateCustomer: builder.mutation<
      ApiResponse<{ customer: Customer }>,
      { shopId: ID; customerId: ID; data: UpdateCustomerRequest }
    >({
      query: ({ shopId, customerId, data }) => {
        const url = replacePathParams(API_ENDPOINTS.CUSTOMERS.BY_ID, {
          shopId,
          id: customerId,
        })
        return {
          url,
          method: 'PUT',
          body: data,
        }
      },
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: 'Customer', id: customerId },
        { type: 'Customers', id: 'LIST' },
      ],
    }),

    // ========================================================================
    // DELETE CUSTOMER (soft delete)
    // ========================================================================
    deleteCustomer: builder.mutation<
      ApiResponse<{ customer: Customer }>,
      { shopId: ID; customerId: ID }
    >({
      query: ({ shopId, customerId }) => {
        const url = replacePathParams(API_ENDPOINTS.CUSTOMERS.BY_ID, {
          shopId,
          id: customerId,
        })
        return {
          url,
          method: 'DELETE',
        }
      },
      invalidatesTags: ['Customers', 'CustomerStatistics'],
    }),

    // ========================================================================
    // BLACKLIST CUSTOMER
    // ========================================================================
    blacklistCustomer: builder.mutation<
      ApiResponse<{ customer: Customer }>,
      { shopId: ID; customerId: ID; data: BlacklistCustomerRequest }
    >({
      query: ({ shopId, customerId, data }) => {
        const url = replacePathParams(
          `${API_ENDPOINTS.CUSTOMERS.BY_ID}/blacklist`,
          {
            shopId,
            id: customerId,
          }
        )
        return {
          url,
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: 'Customer', id: customerId },
        { type: 'Customers', id: 'LIST' },
      ],
    }),

    // ========================================================================
    // REMOVE BLACKLIST
    // ========================================================================
    removeBlacklist: builder.mutation<
      ApiResponse<{ customer: Customer }>,
      { shopId: ID; customerId: ID }
    >({
      query: ({ shopId, customerId }) => {
        const url = replacePathParams(
          `${API_ENDPOINTS.CUSTOMERS.BY_ID}/unblacklist`,
          {
            shopId,
            id: customerId,
          }
        )
        return {
          url,
          method: 'PATCH',
        }
      },
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: 'Customer', id: customerId },
        { type: 'Customers', id: 'LIST' },
      ],
    }),

    // ========================================================================
    // ADD LOYALTY POINTS
    // ========================================================================
    addLoyaltyPoints: builder.mutation<
      ApiResponse<{ customer: Customer }>,
      { shopId: ID; customerId: ID; data: LoyaltyPointsRequest }
    >({
      query: ({ shopId, customerId, data }) => {
        const url = replacePathParams(
          `${API_ENDPOINTS.CUSTOMERS.BY_ID}/loyalty/add`,
          {
            shopId,
            id: customerId,
          }
        )
        return {
          url,
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: 'Customer', id: customerId },
      ],
    }),

    // ========================================================================
    // REDEEM LOYALTY POINTS
    // ========================================================================
    redeemLoyaltyPoints: builder.mutation<
      ApiResponse<{ customer: Customer }>,
      { shopId: ID; customerId: ID; data: LoyaltyPointsRequest }
    >({
      query: ({ shopId, customerId, data }) => {
        const url = replacePathParams(
          `${API_ENDPOINTS.CUSTOMERS.BY_ID}/loyalty/redeem`,
          {
            shopId,
            id: customerId,
          }
        )
        return {
          url,
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: 'Customer', id: customerId },
      ],
    }),

    // ========================================================================
    // GET CUSTOMER STATISTICS
    // ========================================================================
    getCustomerStatistics: builder.query<
      ApiResponse<{ summary: CustomerStatistics }>,
      { shopId: ID }
    >({
      query: ({ shopId }) => {
        const url = replacePathParams(
          `${API_ENDPOINTS.CUSTOMERS.BASE}/analytics`,
          {
            shopId,
          }
        )
        return url
      },
      providesTags: ['CustomerStatistics'],
    }),

    // ========================================================================
    // GET CUSTOMER ORDERS
    // ========================================================================
    getCustomerOrders: builder.query<
      ApiResponse<PaginatedResponse<any>>,
      { shopId: ID; customerId: ID; page?: number; limit?: number }
    >({
      query: ({ shopId, customerId, page = 1, limit = 20 }) => {
        const url = replacePathParams(API_ENDPOINTS.CUSTOMERS.ORDERS, {
          shopId,
          id: customerId,
        })
        const queryString = buildQueryString({ page, limit })
        return `${url}${queryString}`
      },
    }),

    // ========================================================================
    // GET CUSTOMER TRANSACTIONS
    // ========================================================================
    getCustomerTransactions: builder.query<
      ApiResponse<PaginatedResponse<any>>,
      { shopId: ID; customerId: ID; page?: number; limit?: number }
    >({
      query: ({ shopId, customerId, page = 1, limit = 20 }) => {
        const url = replacePathParams(API_ENDPOINTS.CUSTOMERS.TRANSACTIONS, {
          shopId,
          id: customerId,
        })
        const queryString = buildQueryString({ page, limit })
        return `${url}${queryString}`
      },
    }),

    // ========================================================================
    // GET CUSTOMER LOYALTY HISTORY
    // ========================================================================
    getCustomerLoyalty: builder.query<
      ApiResponse<any>,
      { shopId: ID; customerId: ID }
    >({
      query: ({ shopId, customerId }) => {
        const url = replacePathParams(API_ENDPOINTS.CUSTOMERS.LOYALTY, {
          shopId,
          id: customerId,
        })
        return url
      },
    }),
  }),
})

// ============================================================================
// EXPORT HOOKS
// ============================================================================

export const {
  // Mutations
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useBlacklistCustomerMutation,
  useRemoveBlacklistMutation,
  useAddLoyaltyPointsMutation,
  useRedeemLoyaltyPointsMutation,

  // Queries
  useGetCustomersQuery,
  useGetCustomerQuery,
  useSearchCustomerQuery,
  useGetCustomerStatisticsQuery,
  useGetCustomerOrdersQuery,
  useGetCustomerTransactionsQuery,
  useGetCustomerLoyaltyQuery,

  // Lazy Queries
  useLazyGetCustomersQuery,
  useLazyGetCustomerQuery,
  useLazySearchCustomerQuery,
} = customerApi

// ============================================================================
// EXPORT API
// ============================================================================

export default customerApi
