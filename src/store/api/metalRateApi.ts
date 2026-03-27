// FILE: src/store/api/metalRateApi.ts

import { baseApi } from './baseApi'
import { METAL_RATE_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  MetalRate,
  CreateMetalRatePayload,
  SyncToAllShopsPayload,
  RateHistoryParams,
  RateComparisonParams,
  TrendDataParams,
  AverageRateParams,
  ApiResponse,
  RateComparisonResult,
  TrendChartResponse,
  RateForPurityResponse,
  AverageRateResult,
  SyncResult,
  MetalType,
} from '@/types/metalrate.types'

export const metalRateApi = baseApi.injectEndpoints({
  endpoints: build => ({

    // ─── CREATE OR UPDATE TODAY'S RATE ───────────────────────────────────────
    createOrUpdateTodayRate: build.mutation<
      ApiResponse<MetalRate>,
      { shopId: string } & CreateMetalRatePayload
    >({
      query: ({ shopId, ...body }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.CREATE_OR_UPDATE, { shopId }),
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'MetalRate', id: `${shopId}-current` },
        { type: 'MetalRate', id: `${shopId}-history` },
        { type: 'MetalRate', id: `${shopId}-latest` },
        { type: 'MetalRate', id: `${shopId}-trends` },
      ],
    }),

    // ─── GET CURRENT RATE ────────────────────────────────────────────────────
    getCurrentRate: build.query<ApiResponse<MetalRate>, { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.GET_CURRENT, { shopId }),
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'MetalRate', id: `${shopId}-current` },
      ],
    }),

    // ─── GET RATE HISTORY ────────────────────────────────────────────────────
    getRateHistory: build.query<ApiResponse<MetalRate[]>, RateHistoryParams>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.GET_HISTORY, { shopId }),
        params,
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'MetalRate', id: `${shopId}-history` },
      ],
    }),

    // ─── GET LATEST RATES ────────────────────────────────────────────────────
    getLatestRates: build.query<ApiResponse<MetalRate[]>, { shopId: string; limit?: number }>({
      query: ({ shopId, limit = 10 }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.GET_LATEST, { shopId }),
        params: { limit },
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'MetalRate', id: `${shopId}-latest` },
      ],
    }),

    // ─── GET TREND CHART DATA ────────────────────────────────────────────────
    getTrendChartData: build.query<ApiResponse<TrendChartResponse>, TrendDataParams>({
      query: ({ shopId, metalType = 'gold', days = 90 }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.GET_TRENDS, { shopId }),
        params: { metalType, days },
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'MetalRate', id: `${shopId}-trends` },
      ],
    }),

    // ─── COMPARE RATES ───────────────────────────────────────────────────────
    compareRates: build.query<ApiResponse<RateComparisonResult>, RateComparisonParams>({
      query: ({ shopId, fromDate, toDate }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.COMPARE, { shopId }),
        params: { fromDate, toDate },
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'MetalRate', id: `${shopId}-compare` },
      ],
    }),

    // ─── GET RATE BY DATE ────────────────────────────────────────────────────
    getRateByDate: build.query<ApiResponse<MetalRate>, { shopId: string; date: string }>({
      query: ({ shopId, date }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.GET_BY_DATE, { shopId, date }),
      }),
      providesTags: (result, error, { shopId, date }) => [
        { type: 'MetalRate', id: `${shopId}-${date}` },
      ],
    }),

    // ─── GET RATE FOR PURITY ─────────────────────────────────────────────────
    getRateForPurity: build.query<
      ApiResponse<RateForPurityResponse>,
      { shopId: string; metalType: MetalType; purity: string }
    >({
      query: ({ shopId, metalType, purity }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.GET_FOR_PURITY, { shopId, metalType, purity }),
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'MetalRate', id: `${shopId}-current` },
      ],
    }),

    // ─── GET AVERAGE RATE ────────────────────────────────────────────────────
    getAverageRate: build.query<ApiResponse<AverageRateResult>, AverageRateParams>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.GET_AVERAGE, { shopId }),
        params,
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'MetalRate', id: `${shopId}-average` },
      ],
    }),

    // ─── SYNC TO ALL SHOPS ───────────────────────────────────────────────────
    syncToAllShops: build.mutation<
      ApiResponse<SyncResult>,
      { organizationId: string } & SyncToAllShopsPayload
    >({
      query: ({ organizationId, ...body }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.SYNC_TO_ALL_SHOPS, { organizationId }),
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'MetalRate', id: 'LIST' }],
    }),

    // ─── GET ORGANIZATION RATE ───────────────────────────────────────────────
    getOrganizationRate: build.query<ApiResponse<MetalRate>, { organizationId: string }>({
      query: ({ organizationId }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.GET_ORGANIZATION_RATE, { organizationId }),
      }),
      providesTags: (result, error, { organizationId }) => [
        { type: 'MetalRate', id: `${organizationId}-org-current` },
      ],
    }),

    // ─── DEACTIVATE RATE ─────────────────────────────────────────────────────
    deactivateRate: build.mutation<ApiResponse<MetalRate>, { rateId: string; shopId: string }>({
      query: ({ rateId }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.DEACTIVATE, { rateId }),
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'MetalRate', id: `${shopId}-current` },
        { type: 'MetalRate', id: `${shopId}-history` },
      ],
    }),

    // ─── DELETE RATE ─────────────────────────────────────────────────────────
    deleteRate: build.mutation<void, { rateId: string; shopId: string }>({
      query: ({ rateId }) => ({
        url: replacePathParams(METAL_RATE_ENDPOINTS.DELETE, { rateId }),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'MetalRate', id: `${shopId}-history` },
        { type: 'MetalRate', id: `${shopId}-latest` },
      ],
    }),

  }),
})

export const {
  useCreateOrUpdateTodayRateMutation,
  useGetCurrentRateQuery,
  useGetRateHistoryQuery,
  useGetLatestRatesQuery,
  useGetTrendChartDataQuery,
  useCompareRatesQuery,
  useLazyCompareRatesQuery,
  useGetRateByDateQuery,
  useLazyGetRateByDateQuery,
  useGetRateForPurityQuery,
  useGetAverageRateQuery,
  useSyncToAllShopsMutation,
  useGetOrganizationRateQuery,
  useDeactivateRateMutation,
  useDeleteRateMutation,
} = metalRateApi