// FILE: src/store/api/customerApi.ts
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

export const customerApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getCustomers: build.query<CustomerListResponse, GetCustomersInput>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.GET_ALL, { shopId }),
        params, 
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'CustomerList', id: shopId },
        ...(result?.data?.customers || []).map(customer => ({
          type: 'Customer' as const,
          id: customer._id,
        })),
      ],
    }),

    getCustomerById: build.query<Customer, GetCustomerByIdInput>({
      query: ({ shopId, customerId }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.GET_BY_ID, {
          shopId,
          customerId,
        }),
      }),

      transformResponse: (response: CustomerResponse) => response.data.customer,

      providesTags: (result, error, { customerId }) => [
        { type: 'Customer', id: customerId },
      ],
    }),

    searchCustomer: build.query<Customer | null, SearchCustomerInput>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(CUSTOMER_ENDPOINTS.SEARCH, { shopId }),
        params,
      }),

      transformResponse: (response: CustomerSearchResponse) =>
        response.data.exists ? response.data.customer : null,

      providesTags: ['CustomerSearch'],
    }),

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
      ],
    }),

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
    // Advanced Analytics
getAdvancedAnalytics: build.query<any, { shopId: string }>({
  query: ({ shopId }) => ({
    url: replacePathParams(CUSTOMER_ENDPOINTS.ADVANCED_ANALYTICS, { shopId }),
  }),
  transformResponse: (res: any) => res.data,
  providesTags: (result, error, { shopId }) => [
    { type: 'CustomerAnalytics', id: `advanced_${shopId}` },
  ],
}),

// Customer Activity
getCustomerActivity: build.query<
  any[],
  { shopId: string; customerId: string; module?: string; action?: string; limit?: number }
>({
  query: ({ shopId, customerId, ...params }) => ({
    url: replacePathParams(CUSTOMER_ENDPOINTS.ACTIVITY, { shopId, customerId }),
    params,
  }),
  transformResponse: (res: any) => res.data,
  providesTags: (result, error, { customerId }) => [
    { type: 'CustomerActivity', id: customerId },
  ],
}),

// Customer Documents
getCustomerDocuments: build.query<
  any[],
  { shopId: string; customerId: string }
>({
  query: ({ shopId, customerId }) => ({
    url: replacePathParams(CUSTOMER_ENDPOINTS.DOCUMENTS, { shopId, customerId }),
  }),
  transformResponse: (res: any) => res.data,
  providesTags: (result, error, { customerId }) => [
    { type: 'CustomerDocuments', id: customerId },
  ],
}),

// Loyalty Summary
getCustomerLoyaltySummary: build.query<
  { totalEarned: number; totalRedeemed: number; recentActivity: any[] },
  { shopId: string; customerId: string }
>({
  query: ({ shopId, customerId }) => ({
    url: replacePathParams(CUSTOMER_ENDPOINTS.LOYALTY_SUMMARY, { shopId, customerId }),
  }),
  transformResponse: (res: any) => res.data,
  providesTags: (result, error, { customerId }) => [
    { type: 'CustomerLoyalty', id: customerId },
  ],
}),

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
    useGetAdvancedAnalyticsQuery,       // NEW
  useGetCustomerActivityQuery,        // NEW
  useGetCustomerDocumentsQuery,       // NEW
  useGetCustomerLoyaltySummaryQuery,  // NEW
} = customerApi
