// FILE: src/store/api/girviCashbookApi.ts

import { baseApi }  from './baseApi'
import { GIRVI_CASHBOOK_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams }        from '@/utils/api'
import type {
  IGirviCashbookEntry,
  IGirviCashbookListResponse,
  IGirviCashbookEntryResponse,
  IGirviCashbookFilters,
  ICreateManualEntryForm,
  IDailySummary,
  IMonthlySummary,
  IYearlySummary,
  ICurrentBalance,
  IGirviCashbookData,
} from '@/types/girviCashbook.types'

// ─── Input Types ──────────────────────────────────────────────────────────────

interface ShopInput {
  shopId: string
}

interface EntryInput extends ShopInput {
  entryId: string
}

interface GirviInput extends ShopInput {
  girviId: string
}

interface GetAllInput extends ShopInput, IGirviCashbookFilters {}

interface DailySummaryInput extends ShopInput {
  date?: string
}

interface MonthlySummaryInput extends ShopInput {
  year?:  number
  month?: number
}

interface YearlySummaryInput extends ShopInput {
  year?: number
}

interface CreateEntryInput extends ShopInput, ICreateManualEntryForm {}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const girviCashbookApi = baseApi.injectEndpoints({
  endpoints: build => ({

    // ── Get All Entries ───────────────────────────────────────────────────────
    getCashbookEntries: build.query<IGirviCashbookListResponse, GetAllInput>({
      query: ({ shopId, ...params }) => ({
        url:    replacePathParams(GIRVI_CASHBOOK_ENDPOINTS.GET_ALL, { shopId }),
        params,
      }),
      providesTags: (_result, _error, { shopId }) => [
        { type: 'GirviCashbookList', id: shopId },
      ],
    }),

    // ── Get Entry By ID ───────────────────────────────────────────────────────
    getCashbookEntryById: build.query<IGirviCashbookEntry, EntryInput>({
      query: ({ shopId, entryId }) => ({
        url: replacePathParams(GIRVI_CASHBOOK_ENDPOINTS.GET_BY_ID, {
          shopId,
          entryId,
        }),
      }),
      transformResponse: (res: IGirviCashbookEntryResponse) => res.data.entry,
      providesTags: (_result, _error, { entryId }) => [
        { type: 'GirviCashbookEntry', id: entryId },
      ],
    }),

    // ── Create Manual Entry ───────────────────────────────────────────────────
    createManualEntry: build.mutation<IGirviCashbookEntry, CreateEntryInput>({
      query: ({ shopId, ...data }) => ({
        url:    replacePathParams(GIRVI_CASHBOOK_ENDPOINTS.CREATE, { shopId }),
        method: 'POST',
        body:   data,
      }),
      transformResponse: (res: IGirviCashbookEntryResponse) => res.data.entry,
      invalidatesTags: (_result, _error, { shopId }) => [
        { type: 'GirviCashbookList',    id: shopId },
        { type: 'GirviCashbookBalance', id: shopId },
        { type: 'GirviCashbookSummary', id: shopId },
      ],
    }),

    // ── Delete Entry ──────────────────────────────────────────────────────────
    deleteCashbookEntry: build.mutation<void, EntryInput>({
      query: ({ shopId, entryId }) => ({
        url:    replacePathParams(GIRVI_CASHBOOK_ENDPOINTS.DELETE, { shopId, entryId }),
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { shopId, entryId }) => [
        { type: 'GirviCashbookEntry',   id: entryId },
        { type: 'GirviCashbookList',    id: shopId },
        { type: 'GirviCashbookBalance', id: shopId },
        { type: 'GirviCashbookSummary', id: shopId },
      ],
    }),

    // ── Get Balance ───────────────────────────────────────────────────────────
    getCashbookBalance: build.query<ICurrentBalance, ShopInput>({
      query: ({ shopId }) => ({
        url: replacePathParams(GIRVI_CASHBOOK_ENDPOINTS.GET_BALANCE, { shopId }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { shopId }) => [
        { type: 'GirviCashbookBalance', id: shopId },
      ],
    }),

    // ── Daily Summary ─────────────────────────────────────────────────────────
    getDailySummary: build.query<IDailySummary, DailySummaryInput>({
      query: ({ shopId, date }) => ({
        url:    replacePathParams(GIRVI_CASHBOOK_ENDPOINTS.DAILY_SUMMARY, { shopId }),
        params: date ? { date } : {},
      }),
      transformResponse: (res: any) => res.data.summary,
      providesTags: (_result, _error, { shopId }) => [
        { type: 'GirviCashbookSummary', id: `${shopId}-daily` },
      ],
    }),

    // ── Monthly Summary ───────────────────────────────────────────────────────
    getMonthlySummary: build.query<IMonthlySummary, MonthlySummaryInput>({
      query: ({ shopId, year, month }) => ({
        url:    replacePathParams(GIRVI_CASHBOOK_ENDPOINTS.MONTHLY_SUMMARY, { shopId }),
        params: { year, month },
      }),
      transformResponse: (res: any) => res.data.summary,
      providesTags: (_result, _error, { shopId }) => [
        { type: 'GirviCashbookSummary', id: `${shopId}-monthly` },
      ],
    }),

    // ── Yearly Summary ────────────────────────────────────────────────────────
    getYearlySummary: build.query<IYearlySummary, YearlySummaryInput>({
      query: ({ shopId, year }) => ({
        url:    replacePathParams(GIRVI_CASHBOOK_ENDPOINTS.YEARLY_SUMMARY, { shopId }),
        params: { year },
      }),
      transformResponse: (res: any) => res.data.summary,
      providesTags: (_result, _error, { shopId }) => [
        { type: 'GirviCashbookSummary', id: `${shopId}-yearly` },
      ],
    }),

    // ── Girvi-wise Cashbook ───────────────────────────────────────────────────
    getGirviCashbook: build.query<IGirviCashbookData, GirviInput>({
      query: ({ shopId, girviId }) => ({
        url: replacePathParams(GIRVI_CASHBOOK_ENDPOINTS.GIRVI_CASHBOOK, {
          shopId,
          girviId,
        }),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, { girviId }) => [
        { type: 'GirviCashbookList', id: `girvi-${girviId}` },
      ],
    }),
  }),
})

// ─── Export Hooks ─────────────────────────────────────────────────────────────
export const {
  useGetCashbookEntriesQuery,
  useGetCashbookEntryByIdQuery,
  useCreateManualEntryMutation,
  useDeleteCashbookEntryMutation,
  useGetCashbookBalanceQuery,
  useGetDailySummaryQuery,
  useGetMonthlySummaryQuery,
  useGetYearlySummaryQuery,
  useGetGirviCashbookQuery,
} = girviCashbookApi