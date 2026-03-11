//
// FILE: src/store/api/shopApi.ts
// RTK Query API Slice - Shop Module
//

import { baseApi } from './baseApi'
import { SHOP_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  Shop,
  ShopListResponse,
  ShopDetailResponse,
  ShopCreateResponse,
  ShopUpdateResponse,
  ShopDeleteResponse,
  ShopStatisticsResponse,
  ShopFormData,
  ShopQueryParams,
  MetalRatesUpdatePayload,
  ShopSettingsUpdatePayload,
} from '@/types/shop.types'

// ============================================================
// TAG TYPES
// ============================================================

// Register these in your baseApi tagTypes array:
// tagTypes: ['ShopList', 'Shop', 'ShopStatistics', 'ShopMetalRates']

// ============================================================
// SHOP API SLICE
// ============================================================

export const shopApi = baseApi.injectEndpoints({
  endpoints: build => ({


    // GET ALL SHOPS (with filters & pagination)
    // GET /api/v1/shops

    getShops: build.query<ShopListResponse, ShopQueryParams>({
      query: ({ ...params }) => ({
        url: SHOP_ENDPOINTS.GET_ALL,
        params, // page, limit, search, isActive, shopType, city, etc.
      }),
      providesTags: result => [
        { type: 'ShopList', id: 'LIST' },
        ...(result?.data ?? []).map(shop => ({
          type: 'Shop' as const,
          id: shop._id,
        })),
      ],
    }),


    // GET SHOP BY ID
    // GET /api/v1/shops/:shopId

    getShopById: build.query<Shop, string>({
      query: shopId => ({
        url: replacePathParams(SHOP_ENDPOINTS.GET_BY_ID, { shopId }),
      }),
      transformResponse: (response: ShopDetailResponse) => response.data,
      providesTags: (result, error, shopId) => [
        { type: 'Shop', id: shopId },
      ],
    }),


    // CREATE SHOP
    // POST /api/v1/shops

    createShop: build.mutation<Shop, ShopFormData>({
      query: data => ({
        url: SHOP_ENDPOINTS.CREATE,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ShopCreateResponse) => response.data,
      invalidatesTags: [{ type: 'ShopList', id: 'LIST' }],
    }),


    // UPDATE SHOP
    // PUT /api/v1/shops/:shopId

    updateShop: build.mutation<Shop, { shopId: string; data: Partial<ShopFormData> }>({
      query: ({ shopId, data }) => ({
        url: replacePathParams(SHOP_ENDPOINTS.UPDATE, { shopId }),
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ShopUpdateResponse) => response.data,
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'Shop', id: shopId },
        { type: 'ShopList', id: 'LIST' },
      ],
    }),


    // DELETE SHOP (soft delete)
    // DELETE /api/v1/shops/:shopId

    deleteShop: build.mutation<void, string>({
      query: shopId => ({
        url: replacePathParams(SHOP_ENDPOINTS.DELETE, { shopId }),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, shopId) => [
        { type: 'Shop', id: shopId },
        { type: 'ShopList', id: 'LIST' },
      ],
    }),


    // TOGGLE SHOP STATUS (activate / deactivate)
    // PATCH /api/v1/shops/:shopId/status

    toggleShopStatus: build.mutation<Shop, { shopId: string; isActive: boolean }>({
      query: ({ shopId, isActive }) => ({
        url: replacePathParams(SHOP_ENDPOINTS.TOGGLE_STATUS, { shopId }),
        method: 'PATCH',
        body: { isActive },
      }),
      transformResponse: (response: ShopUpdateResponse) => response.data,
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'Shop', id: shopId },
        { type: 'ShopList', id: 'LIST' },
      ],
    }),


    // UPDATE SHOP SETTINGS
    // PUT /api/v1/shops/:shopId/settings

    updateShopSettings: build.mutation<Shop, { shopId: string } & ShopSettingsUpdatePayload>({
      query: ({ shopId, settings }) => ({
        url: replacePathParams(SHOP_ENDPOINTS.UPDATE_SETTINGS, { shopId }),
        method: 'PUT',
        body: { settings },
      }),
      transformResponse: (response: ShopUpdateResponse) => response.data,
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'Shop', id: shopId },
      ],
    }),


    // UPDATE METAL RATES
    // PUT /api/v1/shops/:shopId/metal-rates

    updateMetalRates: build.mutation<Shop, { shopId: string } & MetalRatesUpdatePayload>({
      query: ({ shopId, ...rates }) => ({
        url: replacePathParams(SHOP_ENDPOINTS.UPDATE_METAL_RATES, { shopId }),
        method: 'PUT',
        body: rates,
      }),
      transformResponse: (response: ShopUpdateResponse) => response.data,
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'Shop', id: shopId },
        { type: 'ShopMetalRates', id: shopId },
      ],
    }),


    // GET SHOP STATISTICS
    // GET /api/v1/shops/:shopId/statistics

    getShopStatistics: build.query<ShopStatisticsResponse['data'], string>({
      query: shopId => ({
        url: replacePathParams(SHOP_ENDPOINTS.GET_STATISTICS, { shopId }),
      }),
      transformResponse: (response: ShopStatisticsResponse) => response.data,
      providesTags: (result, error, shopId) => [
        { type: 'ShopStatistics', id: shopId },
      ],
    }),


    // BULK ACTIVATE SHOPS
    // PATCH /api/v1/shops/bulk/activate

    bulkActivateShops: build.mutation<void, string[]>({
      query: shopIds => ({
        url: SHOP_ENDPOINTS.BULK_ACTIVATE,
        method: 'PATCH',
        body: { shopIds },
      }),
      invalidatesTags: (result, error, shopIds) => [
        { type: 'ShopList', id: 'LIST' },
        ...shopIds.map(id => ({ type: 'Shop' as const, id })),
      ],
    }),


    // BULK DEACTIVATE SHOPS
    // PATCH /api/v1/shops/bulk/deactivate

    bulkDeactivateShops: build.mutation<void, string[]>({
      query: shopIds => ({
        url: SHOP_ENDPOINTS.BULK_DEACTIVATE,
        method: 'PATCH',
        body: { shopIds },
      }),
      invalidatesTags: (result, error, shopIds) => [
        { type: 'ShopList', id: 'LIST' },
        ...shopIds.map(id => ({ type: 'Shop' as const, id })),
      ],
    }),


    // BULK DELETE SHOPS
    // DELETE /api/v1/shops/bulk

    bulkDeleteShops: build.mutation<void, string[]>({
      query: shopIds => ({
        url: SHOP_ENDPOINTS.BULK_DELETE,
        method: 'DELETE',
        body: { shopIds },
      }),
      invalidatesTags: (result, error, shopIds) => [
        { type: 'ShopList', id: 'LIST' },
        ...shopIds.map(id => ({ type: 'Shop' as const, id })),
      ],
    }),

  }),
})

// ============================================================
// EXPORT HOOKS (Auto-generated by RTK Query)
// ============================================================

export const {
  // Queries
  useGetShopsQuery,
  useGetShopByIdQuery,
  useLazyGetShopsQuery,
  useLazyGetShopByIdQuery,
  useGetShopStatisticsQuery,

  // Mutations
  useCreateShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
  useToggleShopStatusMutation,
  useUpdateShopSettingsMutation,
  useUpdateMetalRatesMutation,
  useBulkActivateShopsMutation,
  useBulkDeactivateShopsMutation,
  useBulkDeleteShopsMutation,
} = shopApi