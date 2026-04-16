// FILE: src/store/api/openingBalanceApi.ts

import { baseApi } from './baseApi'
import { OPENING_BALANCE_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  OpeningBalance,
  SetupStatus,
  OpeningBalanceResponse,
  SetupStatusResponse,
  ConfirmOpeningBalanceResponse,
  CreateOrUpdateOpeningBalanceInput,
} from '@/types/openingBalance.types'

export const openingBalanceApi = baseApi.injectEndpoints({
  endpoints: build => ({

    // ── GET SETUP STATUS ────────────────────────────────────────
    getSetupStatus: build.query<SetupStatus, { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(OPENING_BALANCE_ENDPOINTS.GET_STATUS, { shopId }),
      }),
      transformResponse: (response: SetupStatusResponse) => response.data,
      providesTags: (result, error, { shopId }) => [
        { type: 'OpeningBalanceStatus', id: shopId },
      ],
    }),

    // ── GET OPENING BALANCE ─────────────────────────────────────
    getOpeningBalance: build.query<OpeningBalanceResponse['data'], { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(OPENING_BALANCE_ENDPOINTS.GET, { shopId }),
      }),
      transformResponse: (response: OpeningBalanceResponse) => response.data,
      providesTags: (result, error, { shopId }) => [
        { type: 'OpeningBalance', id: shopId },
      ],
    }),

    // ── CREATE OR UPDATE (DRAFT) ────────────────────────────────
    createOrUpdateOpeningBalance: build.mutation<
      OpeningBalance,
      { shopId: string } & CreateOrUpdateOpeningBalanceInput
    >({
      query: ({ shopId, ...data }) => ({
        url: replacePathParams(OPENING_BALANCE_ENDPOINTS.CREATE_UPDATE, { shopId }),
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: OpeningBalanceResponse) => {
        const d = response.data
        if ('data' in d) return d.data as OpeningBalance
        return d as OpeningBalance
      },
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'OpeningBalance', id: shopId },
        { type: 'OpeningBalanceStatus', id: shopId },
      ],
    }),

    // ── CONFIRM ─────────────────────────────────────────────────
    confirmOpeningBalance: build.mutation<OpeningBalance, { shopId: string }>({
      query: ({ shopId }) => ({
        url: replacePathParams(OPENING_BALANCE_ENDPOINTS.CONFIRM, { shopId }),
        method: 'POST',
      }),
      transformResponse: (response: ConfirmOpeningBalanceResponse) => response.data,
      invalidatesTags: (result, error, { shopId }) => [
        { type: 'OpeningBalance', id: shopId },
        { type: 'OpeningBalanceStatus', id: shopId },
      ],
    }),

  }),
})

export const {
  useGetSetupStatusQuery,
  useGetOpeningBalanceQuery,
  useCreateOrUpdateOpeningBalanceMutation,
  useConfirmOpeningBalanceMutation,
} = openingBalanceApi