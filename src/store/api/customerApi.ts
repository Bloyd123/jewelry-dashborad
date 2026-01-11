// FILE: src/store/api/customerApi.ts
// Customer API with RTK Query

import { baseApi } from './baseApi'
import { CUSTOMER_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'

// IMPORT FROM YOUR EXISTING TYPES FILE
import type {
  Customer,
  CustomerListResponse,
  CustomerSearchResponse,
  CustomerAnalyticsResponse,
  CustomerMutationResponse,
  LoyaltyPointsResponse,
  GetCustomersInput,
  GetCustomerByIdInput,
  SearchCustomerInput,
  CreateCustomerInput,
  UpdateCustomerInput,
  DeleteCustomerInput,
  BlacklistCustomerInput,
  GetAnalyticsInput,
} from '@/types/customer.types'

export const customerApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // GET ALL CUSTOMERS
    getCustomers: build.query<CustomerListResponse, GetCustomersInput>({
      query: ({ shopId, ...filters }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.GET_ALL, { shopId }),
        params: filters,
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'CustomerList', id: shopId },
        ...(result?.data?.customers || []).map(({ _id }) => ({
          type: 'Customer' as const,
          id: _id,
        })),
      ],
    }),

    // GET CUSTOMER BY ID
    getCustomerById: build.query<Customer, GetCustomerByIdInput>({
      query: ({ shopId, customerId }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.GET_BY_ID, {
          shopId,
          customerId,
        }),
      }),
      transformResponse: (response: CustomerMutationResponse) =>
        response.data.customer,
      providesTags: (result, error, { customerId }) => [
        { type: 'Customer', id: customerId },
      ],
    }),

    // SEARCH CUSTOMER
    searchCustomer: build.query<Customer | null, SearchCustomerInput>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.SEARCH, { shopId }),
        params,
      }),
      transformResponse: (response: CustomerSearchResponse) =>
        response.data.customer,
      providesTags: ['CustomerSearch'],
    }),

    // CREATE CUSTOMER
    createCustomer: build.mutation<Customer, CreateCustomerInput>({
      query: ({ shopId, ...data }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.CREATE, { shopId }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: CustomerMutationResponse) =>
        response.data.customer,
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'CustomerList', id: shopId },
        'CustomerAnalytics',
      ],
    }),

    // UPDATE CUSTOMER
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
      invalidatesTags: (result, error, { customerId, shopId }) => [
        { type: 'Customer', id: customerId },
        { type: 'CustomerList', id: shopId },
      ],
    }),

    // DELETE CUSTOMER
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
        'CustomerAnalytics',
      ],
    }),

    // BLACKLIST CUSTOMER
    blacklistCustomer: build.mutation<Customer, BlacklistCustomerInput>({
      query: ({ shopId, customerId, reason }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.BLACKLIST, {
          shopId,
          customerId,
        }),
        method: 'PATCH',
        body: { reason },
      }),
      transformResponse: (response: CustomerMutationResponse) =>
        response.data.customer,
      invalidatesTags: (result, error, { customerId }) => [
        { type: 'Customer', id: customerId },
      ],
    }),

    // REMOVE BLACKLIST
    removeBlacklist: build.mutation<Customer, DeleteCustomerInput>({
      query: ({ shopId, customerId }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.REMOVE_BLACKLIST, {
          shopId,
          customerId,
        }),
        method: 'PATCH',
      }),
      transformResponse: (response: CustomerMutationResponse) =>
        response.data.customer,
      invalidatesTags: (result, error, { customerId }) => [
        { type: 'Customer', id: customerId },
      ],
    }),

    // ADD LOYALTY POINTS
    addLoyaltyPoints: build.mutation<
      Customer,
      {
        shopId: string
        customerId: string
        points: number
        reason?: string
      }
    >({
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
      invalidatesTags: (result, error, { customerId }) => [
        { type: 'Customer', id: customerId },
      ],
    }),

    // REDEEM LOYALTY POINTS
    redeemLoyaltyPoints: build.mutation<
      Customer,
      {
        shopId: string
        customerId: string
        points: number
      }
    >({
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
      invalidatesTags: (result, error, { customerId }) => [
        { type: 'Customer', id: customerId },
      ],
    }),

    // GET ANALYTICS
    getCustomerAnalytics: build.query<
      CustomerAnalyticsResponse['data']['summary'],
      GetAnalyticsInput
    >({
      query: ({ shopId }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.ANALYTICS, { shopId }),
      }),
      transformResponse: (response: CustomerAnalyticsResponse) =>
        response.data.summary,
      providesTags: ['CustomerAnalytics'],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useSearchCustomerQuery,
  useLazySearchCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useBlacklistCustomerMutation,
  useRemoveBlacklistMutation,
  useAddLoyaltyPointsMutation,
  useRedeemLoyaltyPointsMutation,
  useGetCustomerAnalyticsQuery,
} = customerApi
