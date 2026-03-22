// FILE: src/store/api/supplierApi.ts

import { baseApi } from './baseApi'
import { SUPPLIER_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierFilters,
  SupplierListResponse,
  SingleSupplierResponse,
  SupplierStatsResponse,
  TopSuppliersResponse,
  UpdateRatingDto,
  BlacklistSupplierDto,
  UpdateBalanceDto,
} from '@/types/supplier.types'
export const supplierApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getSuppliers: build.query<SupplierListResponse, SupplierFilters>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.GET_ALL, { shopId }),
        params, 
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'SupplierList', id: shopId },
        ...(result?.data || []).map(supplier => ({
          type: 'Supplier' as const,
          id: supplier._id,
        })),
      ],
    }),

    getSupplierById: build.query<Supplier, { shopId: string; id: string }>({
      query: ({ shopId, id }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.GET_BY_ID, { shopId, id }),
      }),
      transformResponse: (response: SingleSupplierResponse) => response.data,

      providesTags: (result, error, { id }) => [{ type: 'Supplier', id }],
    }),
    searchSuppliers: build.query<
      Supplier[],
      {
        shopId: string
        search: string
        limit?: number
      }
    >({
      query: ({ shopId, search, limit = 10 }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.SEARCH, { shopId }),
        params: { search, limit },
      }),

      transformResponse: (response: SupplierListResponse) => response.data,

      providesTags: ['SupplierSearch'],
    }),
    createSupplier: build.mutation<
      Supplier,
      CreateSupplierDto & { shopId: string }
    >({
      query: ({ shopId, ...data }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.CREATE, { shopId }),
        method: 'POST',
        body: data,
      }),

      transformResponse: (response: SingleSupplierResponse) => response.data,
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'SupplierList', id: shopId },
        'SupplierSearch',
      ],
    }),
    updateSupplier: build.mutation<
      Supplier,
      UpdateSupplierDto & { shopId: string; id: string }
    >({
      query: ({ shopId, id, ...data }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.UPDATE, { shopId, id }),
        method: 'PATCH',
        body: data,
      }),

      transformResponse: (response: SingleSupplierResponse) => response.data,
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Supplier', id },
        { type: 'SupplierList', id: shopId },
        'SupplierSearch',
      ],
    }),
    deleteSupplier: build.mutation<void, { shopId: string; id: string }>({
      query: ({ shopId, id }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.DELETE, { shopId, id }),
        method: 'DELETE',
      }),

      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Supplier', id },
        { type: 'SupplierList', id: shopId },
        'SupplierSearch',
      ],
    }),
    restoreSupplier: build.mutation<Supplier, { shopId: string; id: string }>({
      query: ({ shopId, id }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.RESTORE, { shopId, id }),
        method: 'POST',
          body: { shopId },
      }),

      transformResponse: (response: SingleSupplierResponse) => response.data,
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Supplier', id },
        { type: 'SupplierList', id: shopId },
      ],
    }),
    updateSupplierRating: build.mutation<
      Supplier,
      UpdateRatingDto & { shopId: string; id: string }
    >({
      query: ({ shopId, id, ...ratings }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.UPDATE_RATING, {
          shopId,
          id,
        }),
        method: 'PATCH',
        body: ratings,
      }),

      transformResponse: (response: SingleSupplierResponse) => response.data,
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Supplier', id },
        { type: 'SupplierList', id: shopId },
      ],
    }),
    blacklistSupplier: build.mutation<
      Supplier,
      BlacklistSupplierDto & { shopId: string; id: string }
    >({
      query: ({ shopId, id, reason }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.BLACKLIST, { shopId, id }),
        method: 'POST',
        body: { reason },
      }),

      transformResponse: (response: SingleSupplierResponse) => response.data,
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Supplier', id },
        { type: 'SupplierList', id: shopId },
      ],
    }),
    removeSupplierBlacklist: build.mutation<
      Supplier,
      { shopId: string; id: string }
    >({
      query: ({ shopId, id }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.REMOVE_BLACKLIST, {
          shopId,
          id,
        }),
        method: 'POST',
        body: { shopId },
      }),
      transformResponse: (response: SingleSupplierResponse) => response.data,

      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Supplier', id },
        { type: 'SupplierList', id: shopId },
      ],
    }),
    markSupplierAsPreferred: build.mutation<
      Supplier,
      { shopId: string; id: string }
    >({
      query: ({ shopId, id }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.MARK_PREFERRED, {
          shopId,
          id,
        }),
        method: 'POST',
        body: { shopId },
      }),

      transformResponse: (response: SingleSupplierResponse) => response.data,

      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Supplier', id },
        { type: 'SupplierList', id: shopId },
      ],
    }),
    removeSupplierPreferred: build.mutation<
      Supplier,
      { shopId: string; id: string }
    >({
      query: ({ shopId, id }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.REMOVE_PREFERRED, {
          shopId,
          id,
        }),
        method: 'DELETE',
         body: { shopId },
      }),
      transformResponse: (response: SingleSupplierResponse) => response.data,
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Supplier', id },
        { type: 'SupplierList', id: shopId },
      ],
    }),
    updateSupplierBalance: build.mutation<
      Supplier,
      UpdateBalanceDto & { shopId: string; id: string }
    >({
      query: ({ shopId, id, amount, type, note }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.UPDATE_BALANCE, {
          shopId,
          id,
        }),
        method: 'POST',
        body: { amount, type, note },
      }),
      transformResponse: (response: SingleSupplierResponse) => response.data,
      invalidatesTags: (result, error, { id, shopId }) => [
        { type: 'Supplier', id },
        { type: 'SupplierList', id: shopId },
      ],
    }),
    getSupplierStats: build.query<
      SupplierStatsResponse['data'],
      { shopId: string }
    >({
      query: ({ shopId }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.STATS, { shopId }),
      }),

      transformResponse: (response: SupplierStatsResponse) => response.data,

      providesTags: (result, error, { shopId }) => [
        { type: 'SupplierList', id: `${shopId}-stats` },
      ],
    }),
    getTopSuppliers: build.query<
      Supplier[],
      { shopId: string; limit?: number }
    >({
      query: ({ shopId, limit = 10 }) => ({
        url: replacePathParams(SUPPLIER_ENDPOINTS.TOP, { shopId }),
        params: { limit },
      }),
      transformResponse: (response: TopSuppliersResponse) => response.data,
      providesTags: (result, error, { shopId }) => [
        { type: 'SupplierList', id: `${shopId}-top` },
      ],
    }),
  }),
})
export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useSearchSuppliersQuery,
  useLazySearchSuppliersQuery,
  useGetSupplierStatsQuery,
  useGetTopSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useRestoreSupplierMutation,
  useUpdateSupplierRatingMutation,
  useBlacklistSupplierMutation,
  useRemoveSupplierBlacklistMutation,
  useMarkSupplierAsPreferredMutation,
  useRemoveSupplierPreferredMutation,
  useUpdateSupplierBalanceMutation,
} = supplierApi
