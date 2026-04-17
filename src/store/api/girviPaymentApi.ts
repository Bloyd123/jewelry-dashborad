// FILE: src/store/api/girviPaymentApi.ts
import { baseApi }                 from './baseApi'
import { GIRVI_PAYMENT_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams }       from '@/utils/api'
import type {
  GirviPayment,
  GirviPaymentSummary,
  GirviShopPaymentSummary,
  GirviBalanceSnapshot,
  AddGirviPaymentRequest,
  GetGirviPaymentsFilters,
  GetShopGirviPaymentsFilters,
  AddGirviPaymentResponse,
  GirviPaymentsListResponse,
  GirviPaymentResponse,
  GirviShopPaymentsListResponse,
} from '@/types/girvi.types'

const url = (template: string, params: Record<string, string>) =>
  replacePathParams(template, params)

export const girviPaymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    // POST /shops/:shopId/girvi/:girviId/payments
    addGirviPayment: build.mutation<
      { payment: GirviPayment; updatedGirvi: GirviBalanceSnapshot },
      { shopId: string; girviId: string } & AddGirviPaymentRequest
    >({
      query: ({ shopId, girviId, ...body }) => ({
        url:    url(GIRVI_PAYMENT_ENDPOINTS.ADD, { shopId, girviId }),
        method: 'POST',
        body,
      }),
      transformResponse: (res: AddGirviPaymentResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, girviId }) => [
        { type: 'Girvi',         id: girviId  },
        { type: 'GirviPayments', id: girviId  },
        { type: 'GirviPayments', id: shopId   },
        { type: 'GirviStats',    id: shopId   },
        { type: 'GirviList',     id: shopId   },
      ],
    }),

    // GET /shops/:shopId/girvi/:girviId/payments
    getGirviPayments: build.query<
      GirviPaymentsListResponse,
      { shopId: string; girviId: string } & GetGirviPaymentsFilters
    >({
      query: ({ shopId, girviId, ...params }) => ({
        url:    url(GIRVI_PAYMENT_ENDPOINTS.GET_ALL, { shopId, girviId }),
        params,
      }),
      providesTags: (_res, _err, { girviId }) => [
        { type: 'GirviPayments', id: girviId },
      ],
    }),
    // GET /shops/:shopId/girvi/:girviId/payments/:paymentId
    getGirviPaymentById: build.query<
      GirviPayment,
      { shopId: string; girviId: string; paymentId: string }
    >({
      query: ({ shopId, girviId, paymentId }) => ({
        url: url(GIRVI_PAYMENT_ENDPOINTS.GET_BY_ID, { shopId, girviId, paymentId }),
      }),
      transformResponse: (res: GirviPaymentResponse) => res.data.payment,
      providesTags: (_res, _err, { paymentId }) => [
        { type: 'GirviPayment', id: paymentId },
      ],
    }),
    // GET /shops/:shopId/girvi-payments
    getShopGirviPayments: build.query<
      GirviShopPaymentsListResponse,
      { shopId: string } & GetShopGirviPaymentsFilters
    >({
      query: ({ shopId, ...params }) => ({
        url:    url(GIRVI_PAYMENT_ENDPOINTS.SHOP_ALL, { shopId }),
        params,
      }),
      providesTags: (_res, _err, { shopId }) => [
        { type: 'GirviPayments', id: shopId },
      ],
    }),

    // DELETE /shops/:shopId/girvi/:girviId/payments/:paymentId
    deleteGirviPayment: build.mutation<
      GirviPayment,
      { shopId: string; girviId: string; paymentId: string }
    >({
      query: ({ shopId, girviId, paymentId }) => ({
        url:    url(GIRVI_PAYMENT_ENDPOINTS.DELETE, { shopId, girviId, paymentId }),
        method: 'DELETE',
      }),
      transformResponse: (res: GirviPaymentResponse) => res.data.payment,
      invalidatesTags: (_res, _err, { shopId, girviId, paymentId }) => [
        { type: 'GirviPayment',  id: paymentId },
        { type: 'GirviPayments', id: girviId   },
        { type: 'GirviPayments', id: shopId    },
        { type: 'Girvi',         id: girviId   },
        { type: 'GirviList',     id: shopId    },
        { type: 'GirviStats',    id: shopId    },
      ],
    }),
  }),
})

export const {
  useAddGirviPaymentMutation,
  useGetGirviPaymentsQuery,
  useGetGirviPaymentByIdQuery,
  useGetShopGirviPaymentsQuery,
  useDeleteGirviPaymentMutation,
} = girviPaymentApi