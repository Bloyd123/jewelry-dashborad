// FILE: src/store/api/girviTransferApi.ts

import { baseApi } from './baseApi'
import { GIRVI_TRANSFER_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  IGirviTransfer,
  IGirviTransferListResponse,
  IGirviTransferResponse,
  IGirviTransferFilters,
  ITransferOutForm,
  ITransferReturnForm,
  IPartyInterestCalculation,
  ITransferSummary,
} from '@/types/girviTransfer.types'

// ─── Input Types ──────────────────────────────────────────────────────────────

interface ShopGirviInput {
  shopId:  string
  girviId: string
}

interface TransferInput extends ShopGirviInput {
  transferId: string
}

interface GetByGirviInput extends ShopGirviInput, IGirviTransferFilters {}

interface GetShopTransfersInput extends IGirviTransferFilters {
  shopId: string
}

interface TransferOutInput extends ShopGirviInput, ITransferOutForm {}

interface TransferReturnInput extends TransferInput, ITransferReturnForm {}

interface PartyInterestInput extends TransferInput {
  toDate?: string
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const girviTransferApi = baseApi.injectEndpoints({
  endpoints: build => ({

    // ── Transfer Out ──────────────────────────────────────────────────────────
    transferOut: build.mutation<IGirviTransferResponse, TransferOutInput>({
      query: ({ shopId, girviId, ...data }) => ({
        url: replacePathParams(GIRVI_TRANSFER_ENDPOINTS.TRANSFER_OUT, {
          shopId,
          girviId,
        }),
        method: 'POST',
        body:   data,
      }),
      invalidatesTags: (_result, _error, { shopId, girviId }) => [
        { type: 'GirviTransferList', id: girviId },
        { type: 'GirviTransferList', id: shopId },
        { type: 'Girvi',             id: girviId },
      ],
    }),

    // ── Get Transfers by Girvi ────────────────────────────────────────────────
    getTransfersByGirvi: build.query<IGirviTransferListResponse, GetByGirviInput>({
      query: ({ shopId, girviId, ...params }) => ({
        url: replacePathParams(GIRVI_TRANSFER_ENDPOINTS.GET_BY_GIRVI, {
          shopId,
          girviId,
        }),
        params,
      }),
      providesTags: (_result, _error, { girviId }) => [
        { type: 'GirviTransferList', id: girviId },
      ],
    }),

    // ── Get Transfer by ID ────────────────────────────────────────────────────
    getTransferById: build.query<IGirviTransfer, TransferInput>({
      query: ({ shopId, girviId, transferId }) => ({
        url: replacePathParams(GIRVI_TRANSFER_ENDPOINTS.GET_BY_ID, {
          shopId,
          girviId,
          transferId,
        }),
      }),
      transformResponse: (res: IGirviTransferResponse) => res.data.transfer,
      providesTags: (_result, _error, { transferId }) => [
        { type: 'GirviTransfer', id: transferId },
      ],
    }),

    // ── Get Shop Transfers ────────────────────────────────────────────────────
    getShopTransfers: build.query<IGirviTransferListResponse, GetShopTransfersInput>({
      query: ({ shopId, ...params }) => ({
        url: replacePathParams(GIRVI_TRANSFER_ENDPOINTS.GET_SHOP_TRANSFERS, {
          shopId,
        }),
        params,
      }),
      providesTags: (_result, _error, { shopId }) => [
        { type: 'GirviTransferList', id: shopId },
      ],
    }),

    // ── Transfer Return ───────────────────────────────────────────────────────
    transferReturn: build.mutation<IGirviTransferResponse, TransferReturnInput>({
      query: ({ shopId, girviId, transferId, ...data }) => ({
        url: replacePathParams(GIRVI_TRANSFER_ENDPOINTS.TRANSFER_RETURN, {
          shopId,
          girviId,
          transferId,
        }),
        method: 'PATCH',
        body:   data,
      }),
      invalidatesTags: (_result, _error, { shopId, girviId, transferId }) => [
        { type: 'GirviTransfer',     id: transferId },
        { type: 'GirviTransferList', id: girviId },
        { type: 'GirviTransferList', id: shopId },
        { type: 'Girvi',             id: girviId },
      ],
    }),

    // ── Cancel Transfer ───────────────────────────────────────────────────────
    cancelTransfer: build.mutation<IGirviTransferResponse, TransferInput>({
      query: ({ shopId, girviId, transferId }) => ({
        url: replacePathParams(GIRVI_TRANSFER_ENDPOINTS.CANCEL_TRANSFER, {
          shopId,
          girviId,
          transferId,
        }),
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { shopId, girviId, transferId }) => [
        { type: 'GirviTransfer',     id: transferId },
        { type: 'GirviTransferList', id: girviId },
        { type: 'GirviTransferList', id: shopId },
        { type: 'Girvi',             id: girviId },
      ],
    }),

    // ── Calculate Party Interest ──────────────────────────────────────────────
    calculatePartyInterest: build.query<IPartyInterestCalculation, PartyInterestInput>({
      query: ({ shopId, girviId, transferId, toDate }) => ({
        url: replacePathParams(GIRVI_TRANSFER_ENDPOINTS.PARTY_INTEREST, {
          shopId,
          girviId,
          transferId,
        }),
        params: toDate ? { toDate } : {},
      }),
      transformResponse: (res: any) => res.data.calculation,
      providesTags: (_result, _error, { transferId }) => [
        { type: 'GirviPartyInterest', id: transferId },
      ],
    }),

    // ── Lazy Calculate Party Interest (manual trigger) ────────────────────────
    // lazyCalculatePartyInterest: build.query<IPartyInterestCalculation, PartyInterestInput>({
    //   query: ({ shopId, girviId, transferId, toDate }) => ({
    //     url: replacePathParams(GIRVI_TRANSFER_ENDPOINTS.PARTY_INTEREST, {
    //       shopId,
    //       girviId,
    //       transferId,
    //     }),
    //     params: toDate ? { toDate } : {},
    //   }),
    //   transformResponse: (res: any) => res.data.calculation,
    // }),
  }),
})

// ─── Export Hooks ─────────────────────────────────────────────────────────────
export const {
  useTransferOutMutation,
  useGetTransfersByGirviQuery,
  useGetTransferByIdQuery,
  useGetShopTransfersQuery,
  useTransferReturnMutation,
  useCancelTransferMutation,
  useCalculatePartyInterestQuery,
  useLazyCalculatePartyInterestQuery,
} = girviTransferApi