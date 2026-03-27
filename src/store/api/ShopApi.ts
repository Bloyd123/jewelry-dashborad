// FILE: src/store/api/shopApi.ts

import { baseApi } from './baseApi'
import { SHOP_ENDPOINTS } from '@/api/endpoints'
import type {
  ShopListResponse,
  ShopDetailResponse,
  ShopCreateResponse,
  ShopUpdateResponse,
  ShopDeleteResponse,
  ShopStatisticsResponse,
  ShopFormData,
  ShopQueryParams,
  ShopSettingsUpdatePayload,
  Shop,
  ShopStatistics,
  ActivityLogListResponse, ActivityLogQueryParams,
} from '@/types/shop.types'

export const shopApi = baseApi.injectEndpoints({
  endpoints: build => ({

    getShops: build.query<ShopListResponse, ShopQueryParams>({
      query: (params) => ({
        url: SHOP_ENDPOINTS.GET_ALL,
        params,
      }),
      providesTags: (result) => [
        { type: 'ShopList', id: 'LIST' },
        ...(result?.data || []).map(shop => ({
          type: 'Shop' as const,
          id: shop._id,
        })),
      ],
    }),

    // ============================================
    // GET SINGLE SHOP BY ID
    // ============================================
    getShopById: build.query<ShopDetailResponse, { id: string; includeSettings?: boolean }>({
      query: ({ id, includeSettings }) => ({
        url: SHOP_ENDPOINTS.GET_BY_ID.replace(':id', id),
        params: includeSettings ? { includeSettings: true } : undefined,
      }),
      providesTags: (result, error, { id }) => [{ type: 'Shop', id }],
    }),
    createShop: build.mutation<ShopCreateResponse, ShopFormData>({
      query: (data) => ({
        url: SHOP_ENDPOINTS.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'ShopList', id: 'LIST' }],
    }),
    updateShop: build.mutation<ShopUpdateResponse, { id: string; data: Partial<ShopFormData> }>({
      query: ({ id, data }) => ({
        url: SHOP_ENDPOINTS.UPDATE.replace(':id', id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Shop', id },
        { type: 'ShopList', id: 'LIST' },
      ],
    }),

    deleteShop: build.mutation<ShopDeleteResponse, string>({
      query: (id) => ({
        url: SHOP_ENDPOINTS.DELETE.replace(':id', id),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Shop', id },
        { type: 'ShopList', id: 'LIST' },
      ],
    }),
    updateShopSettings: build.mutation<
      { success: boolean; message: string; data: Shop },
      { id: string } & ShopSettingsUpdatePayload
    >({
      query: ({ id, settings }) => ({
        url: SHOP_ENDPOINTS.UPDATE_SETTINGS.replace(':id', id),
        method: 'PATCH',
        body: { settings },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Shop', id }],
    }),
getShopActivityLogs: build.query<ActivityLogListResponse, ActivityLogQueryParams>({
  query: ({ id, ...params }) => ({
    url: SHOP_ENDPOINTS.ACTIVITY_LOGS.replace(':id', id),
    params,
  }),
  providesTags: (result, error, { id }) => [{ type: 'ShopActivityLogs', id }],
}),

    getShopStatistics: build.query<ShopStatisticsResponse, string>({
      query: (id) => ({
        url: SHOP_ENDPOINTS.STATISTICS.replace(':id', id),
      }),
      providesTags: (result, error, id) => [{ type: 'ShopStatistics', id }],
    }),
  }),
})

export const {
  useGetShopsQuery,
  useGetShopByIdQuery,
  useCreateShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
  useUpdateShopSettingsMutation,
  useGetShopStatisticsQuery,
  useLazyGetShopsQuery,
  useLazyGetShopByIdQuery,
  useLazyGetShopStatisticsQuery,
    useGetShopActivityLogsQuery,
} = shopApi