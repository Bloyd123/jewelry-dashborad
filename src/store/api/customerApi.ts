// FILE: src/store/api/customerApi.ts
// Customer RTK Query API Slice

import { baseApi } from './baseApi'
import { CUSTOMER_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  Customer,
  CustomerListResponse,
  CustomerResponse,
  CustomerSearchResponse,
  CustomerAnalyticsResponse,
  CustomerMutationResponse,
  BlacklistResponse,
  LoyaltyPointsResponse,
  GetCustomersInput,
  GetCustomerByIdInput,
  SearchCustomerInput,
  CreateCustomerInput,
  UpdateCustomerInput,
  DeleteCustomerInput,
  BlacklistCustomerInput,
  RemoveBlacklistInput,
  AddLoyaltyPointsInput,
  RedeemLoyaltyPointsInput,
  GetAnalyticsInput,
} from '@/types/customer.types'

/**
 * Customer API Slice
 * Handles all customer-related API calls with caching
 */
export const customerApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // ============================================
    // 📋 GET ALL CUSTOMERS (with filters & pagination)
    // ============================================
    getCustomers: build.query<CustomerListResponse, GetCustomersInput>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.GET_ALL, { shopId }),
        params, // page, limit, search, filters
      }),

      // 🔥 Cache tags for auto-refetch
      providesTags: (result, error, { shopId }) => [
        { type: 'CustomerList', id: shopId },
        ...(result?.data?.customers || []).map(customer => ({
          type: 'Customer' as const,
          id: customer._id,
        })),
      ],
    }),

    // ============================================
    // 👤 GET SINGLE CUSTOMER BY ID
    // ============================================
    getCustomerById: build.query<Customer, GetCustomerByIdInput>({
      query: ({ shopId, customerId }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.GET_BY_ID, {
          shopId,
          customerId,
        }),
      }),

      // 🔥 Transform response (extract data)
      transformResponse: (response: CustomerResponse) => response.data.customer,

      providesTags: (result, error, { customerId }) => [
        { type: 'Customer', id: customerId },
      ],
    }),

    // ============================================
    // 🔍 SEARCH CUSTOMER
    // ============================================
    searchCustomer: build.query<Customer | null, SearchCustomerInput>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.SEARCH, { shopId }),
        params,
      }),

      transformResponse: (response: CustomerSearchResponse) =>
        response.data.exists ? response.data.customer : null,

      providesTags: ['CustomerSearch'],
    }),

    // ============================================
    //  CREATE CUSTOMER
    // ============================================
    createCustomer: build.mutation<Customer, CreateCustomerInput>({
      query: ({ shopId, ...data }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.CREATE, { shopId }),
        method: 'POST',
        body: data,
      }),

      transformResponse: (response: CustomerMutationResponse) =>
        response.data.customer,

      // 🔥 Invalidate cache to auto-refetch lists
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'CustomerList', id: shopId },
      ],
    }),

    // ============================================
    // ✏️ UPDATE CUSTOMER
    // ============================================
    updateCustomer: build.mutation<Customer, UpdateCustomerInput>({
      query: ({ shopId, customerId, ...data }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.UPDATE, {
          shopId,
          customerId,
        }),
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: CustomerMutationResponse) =>
        response.data.customer,

      // 🔥 Invalidate both single item and list
      invalidatesTags: (result, error, { customerId, shopId }) => [
        { type: 'Customer', id: customerId },
        { type: 'CustomerList', id: shopId },
      ],
    }),

    // ============================================
    // 🗑 DELETE CUSTOMER
    // ============================================
    deleteCustomer: build.mutation<void, DeleteCustomerInput>({
      query: ({ shopId, customerId }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.DELETE, {
          shopId,
          customerId,
        }),
        method: 'DELETE',
      }),

      invalidatesTags: (result, error, { customerId, shopId }) => [
        { type: 'Customer', id: customerId },
        { type: 'CustomerList', id: shopId },
      ],
    }),

    // ============================================
    // 🚫 BLACKLIST CUSTOMER
    // ============================================
    blacklistCustomer: build.mutation<Customer, BlacklistCustomerInput>({
      query: ({ shopId, customerId, reason }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.BLACKLIST, {
          shopId,
          customerId,
        }),
        method: 'PATCH',
        body: { reason },
      }),

      transformResponse: (response: BlacklistResponse) =>
        response.data.customer,

      invalidatesTags: (result, error, { customerId, shopId }) => [
        { type: 'Customer', id: customerId },
        { type: 'CustomerList', id: shopId },
      ],
    }),

    // ============================================
    // REMOVE BLACKLIST
    // ============================================
    removeBlacklist: build.mutation<Customer, RemoveBlacklistInput>({
      query: ({ shopId, customerId }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.UNBLACKLIST, {
          shopId,
          customerId,
        }),
        method: 'PATCH',
      }),

      transformResponse: (response: BlacklistResponse) =>
        response.data.customer,

      invalidatesTags: (result, error, { customerId, shopId }) => [
        { type: 'Customer', id: customerId },
        { type: 'CustomerList', id: shopId },
      ],
    }),

    // ============================================
    //  ADD LOYALTY POINTS
    // ============================================
    addLoyaltyPoints: build.mutation<Customer, AddLoyaltyPointsInput>({
      query: ({ shopId, customerId, points, reason }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.ADD_LOYALTY, {
          shopId,
          customerId,
        }),
        method: 'POST',
        body: { points, reason },
      }),

      transformResponse: (response: LoyaltyPointsResponse) =>
        response.data.customer as any,

      invalidatesTags: (result, error, { customerId, shopId }) => [
        { type: 'Customer', id: customerId },
        { type: 'CustomerList', id: shopId },
      ],
    }),

    // ============================================
    // 🎁 REDEEM LOYALTY POINTS
    // ============================================
    redeemLoyaltyPoints: build.mutation<Customer, RedeemLoyaltyPointsInput>({
      query: ({ shopId, customerId, points }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.REDEEM_LOYALTY, {
          shopId,
          customerId,
        }),
        method: 'POST',
        body: { points },
      }),

      transformResponse: (response: LoyaltyPointsResponse) =>
        response.data.customer as any,

      invalidatesTags: (result, error, { customerId, shopId }) => [
        { type: 'Customer', id: customerId },
        { type: 'CustomerList', id: shopId },
      ],
    }),

    // ============================================
    // 📊 GET CUSTOMER ANALYTICS
    // ============================================
    getCustomerAnalytics: build.query<
      CustomerAnalyticsResponse['data']['summary'],
      GetAnalyticsInput
    >({
      query: ({ shopId }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.ANALYTICS, { shopId }),
      }),

      transformResponse: (response: CustomerAnalyticsResponse) =>
        response.data.summary,

      providesTags: (result, error, { shopId }) => [
        { type: 'CustomerAnalytics', id: shopId },
      ],
    }),
  }),
})

// ============================================
// 🎣 EXPORT HOOKS (Auto-generated by RTK Query)
// ============================================
export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useSearchCustomerQuery,
  useLazySearchCustomerQuery, // Manual trigger
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useBlacklistCustomerMutation,
  useRemoveBlacklistMutation,
  useAddLoyaltyPointsMutation,
  useRedeemLoyaltyPointsMutation,
  useGetCustomerAnalyticsQuery,
} = customerApi
