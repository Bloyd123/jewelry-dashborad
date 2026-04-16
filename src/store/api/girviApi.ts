// FILE: src/store/api/girviApi.ts
// Girvi Module - RTK Query API Slice (7 Endpoints)

import { baseApi } from './baseApi'
import { GIRVI_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  Girvi,
  GirviStatistics,
  GirviInterestCalculation,
  GirviPayment,
  GirviReleaseSummary,
  GirvisListResponse,
  GirviResponse,
  GirviStatisticsResponse,
  GirviInterestCalculationResponse,
  ReleaseGirviResponse,
  CreateGirviRequest,
  UpdateGirviRequest,
  ReleaseGirviRequest,
  GetGirvisFilters,
  GetInterestCalculationParams,
} from '@/types/girvi.types'

// ─── Helper ────────────────────────────────────────────────────────────────────

const buildUrl = (template: string, params: Record<string, string>) =>
  replacePathParams(template, params)

// ─── RTK Query API Slice ───────────────────────────────────────────────────────

export const girviApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    // ══════════════════════════════════════════
    // 1. GET STATISTICS
    // GET /shops/:shopId/girvi/statistics
    // NOTE: registered first — must be before /:girviId routes
    // ══════════════════════════════════════════
    getGirviStatistics: build.query<GirviStatistics, { shopId: string }>({
      query: ({ shopId }) => ({
        url: buildUrl(GIRVI_ENDPOINTS.STATISTICS, { shopId }),
      }),
      transformResponse: (res: GirviStatisticsResponse) => res.data.stats,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'GirviStats', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // 2. CREATE GIRVI (Jama)
    // POST /shops/:shopId/girvi
    // ══════════════════════════════════════════
    createGirvi: build.mutation<Girvi, { shopId: string } & CreateGirviRequest>({
      query: ({ shopId, ...body }) => ({
        url: buildUrl(GIRVI_ENDPOINTS.CREATE, { shopId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: GirviResponse) => res.data.girvi,
      invalidatesTags: (_res, _err, { shopId }) => [
        { type: 'GirviList',  id: shopId },
        { type: 'GirviStats', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // 3. GET ALL GIRVIS (with filters + pagination)
    // GET /shops/:shopId/girvi
    // ══════════════════════════════════════════
    getAllGirvis: build.query<GirvisListResponse, { shopId: string } & GetGirvisFilters>({
      query: ({ shopId, ...params }) => ({
        url: buildUrl(GIRVI_ENDPOINTS.GET_ALL, { shopId }),
        params,
      }),
      // NOTE: No transformResponse — we need both girvis[] and pagination
      providesTags: (_res, _err, { shopId }) => [
        { type: 'GirviList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // 4. GET GIRVI BY ID
    // GET /shops/:shopId/girvi/:girviId
    // ══════════════════════════════════════════
    getGirviById: build.query<Girvi, { shopId: string; girviId: string }>({
      query: ({ shopId, girviId }) => ({
        url: buildUrl(GIRVI_ENDPOINTS.GET_BY_ID, { shopId, girviId }),
      }),
      transformResponse: (res: GirviResponse) => res.data.girvi,
      providesTags: (_res, _err, { girviId }) => [
        { type: 'Girvi', id: girviId },
      ],
    }),

    // ══════════════════════════════════════════
    // 5. UPDATE GIRVI
    // PUT /shops/:shopId/girvi/:girviId
    // Only allowed fields: interestRate, interestType, dueDate,
    // gracePeriodDays, girviSlipNumber, witnessName, notes, internalNotes
    // ══════════════════════════════════════════
    updateGirvi: build.mutation<
      Girvi,
      { shopId: string; girviId: string } & UpdateGirviRequest
    >({
      query: ({ shopId, girviId, ...body }) => ({
        url: buildUrl(GIRVI_ENDPOINTS.UPDATE, { shopId, girviId }),
        method: 'PUT',
        body,
      }),
      transformResponse: (res: GirviResponse) => res.data.girvi,
      invalidatesTags: (_res, _err, { shopId, girviId }) => [
        { type: 'Girvi',     id: girviId },
        { type: 'GirviList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // 6. DELETE GIRVI (soft delete)
    // DELETE /shops/:shopId/girvi/:girviId
    // Backend only allows delete if status is NOT active/overdue
    // ══════════════════════════════════════════
    deleteGirvi: build.mutation<Girvi, { shopId: string; girviId: string }>({
      query: ({ shopId, girviId }) => ({
        url: buildUrl(GIRVI_ENDPOINTS.DELETE, { shopId, girviId }),
        method: 'DELETE',
      }),
      transformResponse: (res: GirviResponse) => res.data.girvi,
      invalidatesTags: (_res, _err, { shopId, girviId }) => [
        { type: 'Girvi',     id: girviId },
        { type: 'GirviList', id: shopId },
        { type: 'GirviStats', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // 7. CALCULATE INTEREST (query — not mutation)
    // GET /shops/:shopId/girvi/:girviId/interest
    // ══════════════════════════════════════════
    calculateGirviInterest: build.query<
      GirviInterestCalculation,
      { shopId: string; girviId: string } & GetInterestCalculationParams
    >({
      query: ({ shopId, girviId, ...params }) => ({
        url: buildUrl(GIRVI_ENDPOINTS.CALCULATE_INTEREST, { shopId, girviId }),
        params,
      }),
      transformResponse: (res: GirviInterestCalculationResponse) =>
        res.data.calculation,
      // No cache tag — always fresh when user triggers it
    }),

    // ══════════════════════════════════════════
    // 8. RELEASE GIRVI (PATCH — not POST)
    // PATCH /shops/:shopId/girvi/:girviId/release
    // ══════════════════════════════════════════
    releaseGirvi: build.mutation<
      { girvi: Girvi; payment: GirviPayment; releaseSummary: GirviReleaseSummary },
      { shopId: string; girviId: string } & ReleaseGirviRequest
    >({
      query: ({ shopId, girviId, ...body }) => ({
        url: buildUrl(GIRVI_ENDPOINTS.RELEASE, { shopId, girviId }),
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: ReleaseGirviResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, girviId }) => [
        { type: 'Girvi',     id: girviId },
        { type: 'GirviList', id: shopId },
        { type: 'GirviStats', id: shopId },
      ],
    }),
  }),
})

// ─── Export Auto-Generated Hooks ───────────────────────────────────────────────

export const {
  // Queries
  useGetGirviStatisticsQuery,
  useGetAllGirvisQuery,
  useGetGirviByIdQuery,
  useCalculateGirviInterestQuery,
  useLazyCalculateGirviInterestQuery,  // manual trigger in release form

  // Mutations
  useCreateGirviMutation,
  useUpdateGirviMutation,
  useDeleteGirviMutation,
  useReleaseGirviMutation,
} = girviApi