import { baseApi } from './baseApi'
import { GIRVI_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  Girvi,
  GirviStatistics,
  GirviInterestCalculation,
  GirviPayment,
  GirviReleaseSummary,
  GirviPartialReleaseRecord,
  GirviRenewalRecord,
  PartialReleaseSummary,
  RenewalSummary,
  GirvisListResponse,
  GirviResponse,
  GirviStatisticsResponse,
  GirviInterestCalculationResponse,
  ReleaseGirviResponse,
  PartialReleaseResponse,
  RenewalResponse,
  CreateGirviRequest,
  UpdateGirviRequest,
  ReleaseGirviRequest,
  PartialReleaseRequest,
  RenewalRequest,
  GetGirvisFilters,
  GetInterestCalculationParams,
} from '@/types/girvi.types'
 
const buildUrl = (template: string, params: Record<string, string>) =>
  replacePathParams(template, params)
 
export const girviApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
 
    // 1. GET STATISTICS
    getGirviStatistics: build.query<GirviStatistics, { shopId: string }>({
      query: ({ shopId }) => ({
        url: buildUrl(GIRVI_ENDPOINTS.STATISTICS, { shopId }),
      }),
      transformResponse: (res: GirviStatisticsResponse) => res.data.stats,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'GirviStats', id: shopId },
      ],
    }),
 
    // 2. CREATE GIRVI
    createGirvi: build.mutation<Girvi, { shopId: string } & CreateGirviRequest>({
      query: ({ shopId, ...body }) => ({
        url:    buildUrl(GIRVI_ENDPOINTS.CREATE, { shopId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: GirviResponse) => res.data.girvi,
      invalidatesTags: (_res, _err, { shopId }) => [
        { type: 'GirviList',  id: shopId },
        { type: 'GirviStats', id: shopId },
      ],
    }),
 
    // 3. GET ALL GIRVIS
    getAllGirvis: build.query<GirvisListResponse, { shopId: string } & GetGirvisFilters>({
      query: ({ shopId, ...params }) => ({
        url:    buildUrl(GIRVI_ENDPOINTS.GET_ALL, { shopId }),
        params,
      }),
      providesTags: (_res, _err, { shopId }) => [
        { type: 'GirviList', id: shopId },
      ],
    }),
 
    // 4. GET GIRVI BY ID
    getGirviById: build.query<Girvi, { shopId: string; girviId: string }>({
      query: ({ shopId, girviId }) => ({
        url: buildUrl(GIRVI_ENDPOINTS.GET_BY_ID, { shopId, girviId }),
      }),
      transformResponse: (res: GirviResponse) => res.data.girvi,
      providesTags: (_res, _err, { girviId }) => [
        { type: 'Girvi', id: girviId },
      ],
    }),
 
    // 5. UPDATE GIRVI
    updateGirvi: build.mutation<
      Girvi,
      { shopId: string; girviId: string } & UpdateGirviRequest
    >({
      query: ({ shopId, girviId, ...body }) => ({
        url:    buildUrl(GIRVI_ENDPOINTS.UPDATE, { shopId, girviId }),
        method: 'PUT',
        body,
      }),
      transformResponse: (res: GirviResponse) => res.data.girvi,
      invalidatesTags: (_res, _err, { shopId, girviId }) => [
        { type: 'Girvi',     id: girviId },
        { type: 'GirviList', id: shopId  },
      ],
    }),
 
    // 6. DELETE GIRVI
    deleteGirvi: build.mutation<Girvi, { shopId: string; girviId: string }>({
      query: ({ shopId, girviId }) => ({
        url:    buildUrl(GIRVI_ENDPOINTS.DELETE, { shopId, girviId }),
        method: 'DELETE',
      }),
      transformResponse: (res: GirviResponse) => res.data.girvi,
      invalidatesTags: (_res, _err, { shopId, girviId }) => [
        { type: 'Girvi',      id: girviId },
        { type: 'GirviList',  id: shopId  },
        { type: 'GirviStats', id: shopId  },
      ],
    }),
 
    // 7. CALCULATE INTEREST (query)
    calculateGirviInterest: build.query<
      GirviInterestCalculation,
      { shopId: string; girviId: string } & GetInterestCalculationParams
    >({
      query: ({ shopId, girviId, ...params }) => ({
        url:    buildUrl(GIRVI_ENDPOINTS.CALCULATE_INTEREST, { shopId, girviId }),
        params,
      }),
      transformResponse: (res: GirviInterestCalculationResponse) => res.data.calculation,
    }),
 
    // 8. FULL RELEASE (PATCH)
    releaseGirvi: build.mutation<
      { girvi: Girvi; payment: GirviPayment; releaseSummary: GirviReleaseSummary },
      { shopId: string; girviId: string } & ReleaseGirviRequest
    >({
      query: ({ shopId, girviId, ...body }) => ({
        url:    buildUrl(GIRVI_ENDPOINTS.RELEASE, { shopId, girviId }),
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: ReleaseGirviResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, girviId }) => [
        { type: 'Girvi',      id: girviId },
        { type: 'GirviList',  id: shopId  },
        { type: 'GirviStats', id: shopId  },
      ],
    }),
 
    // 9. PARTIAL RELEASE (PATCH)
    // PATCH /shops/:shopId/girvi/:girviId/partial-release
    partialReleaseGirvi: build.mutation<
      { girvi: Girvi; payment: GirviPayment; partialReleaseSummary: PartialReleaseSummary },
      { shopId: string; girviId: string } & PartialReleaseRequest
    >({
      query: ({ shopId, girviId, ...body }) => ({
        url:    buildUrl(GIRVI_ENDPOINTS.PARTIAL_RELEASE, { shopId, girviId }),
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: PartialReleaseResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, girviId }) => [
        { type: 'Girvi',      id: girviId },
        { type: 'GirviList',  id: shopId  },
        { type: 'GirviStats', id: shopId  },
      ],
    }),
 
    // 10. RENEWAL (PATCH)
    // PATCH /shops/:shopId/girvi/:girviId/renew
    renewGirvi: build.mutation<
      { girvi: Girvi; payment: GirviPayment; renewalSummary: RenewalSummary },
      { shopId: string; girviId: string } & RenewalRequest
    >({
      query: ({ shopId, girviId, ...body }) => ({
        url:    buildUrl(GIRVI_ENDPOINTS.RENEW, { shopId, girviId }),
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: RenewalResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, girviId }) => [
        { type: 'Girvi',      id: girviId },
        { type: 'GirviList',  id: shopId  },
        { type: 'GirviStats', id: shopId  },
      ],
    }),
  }),
})
 
export const {
  useGetGirviStatisticsQuery,
  useGetAllGirvisQuery,
  useGetGirviByIdQuery,
  useCalculateGirviInterestQuery,
  useLazyCalculateGirviInterestQuery,
 
  useCreateGirviMutation,
  useUpdateGirviMutation,
  useDeleteGirviMutation,
  useReleaseGirviMutation,
  usePartialReleaseGirviMutation,  
  useRenewGirviMutation,           
} = girviApi
 