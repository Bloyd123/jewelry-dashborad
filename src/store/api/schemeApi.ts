// FILE: src/store/api/schemeApi.ts

import { baseApi } from './baseApi'
import type {
  // Scheme
  Scheme,
  SchemeListResponse,
  SchemeResponse,
  CreateSchemeInput,
  UpdateSchemeInput,
  GetSchemesInput,
  // Enrollment
  SchemeEnrollment,
  EnrollmentListResponse,
  EnrollmentResponse,
  EnrollCustomerInput,
  RecordPaymentInput,
  CancelEnrollmentInput,
  RedeemEnrollmentInput,
  // Analytics & Dashboard
  SchemeDashboard,
  SchemeAnalyticsData,
  SchemeSpecificAnalytics,
  MaturityValueResponse,
  CustomerSchemeSummary,
  // Bulk
  BulkReminderInput,
  BulkExportInput,
  // Due
  DueEnrollment,
} from '@/types/scheme.types'

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
const schemeUrl = (shopId: string, path = '') =>
  `/api/v1/shops/${shopId}/schemes${path}`

const enrollmentUrl = (shopId: string, enrollmentId: string, path = '') =>
  `/api/v1/shops/${shopId}/schemes/enrollments/${enrollmentId}${path}`

// ─────────────────────────────────────────────
// CACHE TAG TYPES
// ─────────────────────────────────────────────
// These must be registered in your baseApi tagTypes array:
// 'SchemeList' | 'Scheme' | 'EnrollmentList' | 'Enrollment'
// 'SchemeDashboard' | 'SchemeAnalytics' | 'DuesList'

export const schemeApi = baseApi.injectEndpoints({
  endpoints: build => ({

    // ══════════════════════════════════════════
    // SECTION 1 — SCHEME CRUD
    // ══════════════════════════════════════════

    // GET ALL SCHEMES
  getSchemes: build.query<SchemeListResponse, GetSchemesInput>({
  query: ({ shopId, ...params }) => ({
    url: schemeUrl(shopId),
    params,
  }),
  providesTags: (result, _err, { shopId }) => [
    { type: 'SchemeList', id: shopId },
    ...(result?.data || []).map(s => ({            // ✅ fix
      type: 'Scheme' as const,
      id: s._id,
    })),
  ],
}),

    // GET SCHEME BY ID
    getSchemeById: build.query<Scheme, { shopId: string; schemeId: string }>({
      query: ({ shopId, schemeId }) => ({
        url: schemeUrl(shopId, `/${schemeId}`),
      }),
      transformResponse: (res: SchemeResponse) => res.data,
      providesTags: (_res, _err, { schemeId }) => [
        { type: 'Scheme', id: schemeId },
      ],
    }),

    // CREATE SCHEME
    createScheme: build.mutation<Scheme, CreateSchemeInput>({
      query: ({ shopId, ...body }) => ({
        url: schemeUrl(shopId),
        method: 'POST',
        body,
      }),
      transformResponse: (res: SchemeResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId }) => [
        { type: 'SchemeList', id: shopId },
        { type: 'SchemeDashboard', id: shopId },
      ],
    }),

    // UPDATE SCHEME
    updateScheme: build.mutation<Scheme, UpdateSchemeInput>({
      query: ({ shopId, schemeId, ...body }) => ({
        url: schemeUrl(shopId, `/${schemeId}`),
        method: 'PUT',
        body,
      }),
      transformResponse: (res: SchemeResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, schemeId }) => [
        { type: 'Scheme', id: schemeId },
        { type: 'SchemeList', id: shopId },
      ],
    }),

    // DELETE SCHEME
    deleteScheme: build.mutation<void, { shopId: string; schemeId: string }>({
      query: ({ shopId, schemeId }) => ({
        url: schemeUrl(shopId, `/${schemeId}`),
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { shopId, schemeId }) => [
        { type: 'Scheme', id: schemeId },
        { type: 'SchemeList', id: shopId },
        { type: 'SchemeDashboard', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // SECTION 2 — SCHEME STATUS
    // ══════════════════════════════════════════

    // UPDATE STATUS
    updateSchemeStatus: build.mutation<
      Scheme,
      { shopId: string; schemeId: string; status: string }
    >({
      query: ({ shopId, schemeId, status }) => ({
        url: schemeUrl(shopId, `/${schemeId}/status`),
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (res: SchemeResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, schemeId }) => [
        { type: 'Scheme', id: schemeId },
        { type: 'SchemeList', id: shopId },
      ],
    }),

    // ACTIVATE
    activateScheme: build.mutation<Scheme, { shopId: string; schemeId: string }>({
      query: ({ shopId, schemeId }) => ({
        url: schemeUrl(shopId, `/${schemeId}/activate`),
        method: 'PATCH',
      }),
      transformResponse: (res: SchemeResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, schemeId }) => [
        { type: 'Scheme', id: schemeId },
        { type: 'SchemeList', id: shopId },
      ],
    }),

    // PAUSE
    pauseScheme: build.mutation<
      Scheme,
      { shopId: string; schemeId: string; reason?: string }
    >({
      query: ({ shopId, schemeId, reason }) => ({
        url: schemeUrl(shopId, `/${schemeId}/pause`),
        method: 'PATCH',
        body: { reason },
      }),
      transformResponse: (res: SchemeResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, schemeId }) => [
        { type: 'Scheme', id: schemeId },
        { type: 'SchemeList', id: shopId },
      ],
    }),

    // ARCHIVE
    archiveScheme: build.mutation<Scheme, { shopId: string; schemeId: string }>({
      query: ({ shopId, schemeId }) => ({
        url: schemeUrl(shopId, `/${schemeId}/archive`),
        method: 'PATCH',
      }),
      transformResponse: (res: SchemeResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, schemeId }) => [
        { type: 'Scheme', id: schemeId },
        { type: 'SchemeList', id: shopId },
        { type: 'SchemeDashboard', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // SECTION 3 — APPROVAL
    // ══════════════════════════════════════════

    // APPROVE
    approveScheme: build.mutation<
      Scheme,
      { shopId: string; schemeId: string; notes?: string }
    >({
      query: ({ shopId, schemeId, notes }) => ({
        url: schemeUrl(shopId, `/${schemeId}/approve`),
        method: 'POST',
        body: { notes },
      }),
      transformResponse: (res: SchemeResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, schemeId }) => [
        { type: 'Scheme', id: schemeId },
        { type: 'SchemeList', id: shopId },
      ],
    }),

    // REJECT
    rejectScheme: build.mutation<
      Scheme,
      { shopId: string; schemeId: string; reason: string }
    >({
      query: ({ shopId, schemeId, reason }) => ({
        url: schemeUrl(shopId, `/${schemeId}/reject`),
        method: 'POST',
        body: { reason },
      }),
      transformResponse: (res: SchemeResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, schemeId }) => [
        { type: 'Scheme', id: schemeId },
        { type: 'SchemeList', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // SECTION 4 — FILTERS & SEARCH
    // ══════════════════════════════════════════

    // ACTIVE SCHEMES
    getActiveSchemes: build.query<Scheme[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: schemeUrl(shopId, '/active'),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'SchemeList', id: `${shopId}-active` },
      ],
    }),

    // FEATURED SCHEMES
    getFeaturedSchemes: build.query<Scheme[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: schemeUrl(shopId, '/featured'),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'SchemeList', id: `${shopId}-featured` },
      ],
    }),

    // EXPIRING SOON
    getExpiringSoon: build.query<Scheme[], { shopId: string; days?: number }>({
      query: ({ shopId, days }) => ({
        url: schemeUrl(shopId, '/expiring-soon'),
        params: { days },
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'SchemeList', id: `${shopId}-expiring` },
      ],
    }),

    // SEARCH SCHEMES
    searchSchemes: build.query<Scheme[], { shopId: string; q: string; limit?: number }>({
      query: ({ shopId, q, limit }) => ({
        url: schemeUrl(shopId, '/search'),
        params: { q, limit },
      }),
      transformResponse: (res: any) => res.data,
    }),

    // LAZY SEARCH
    lazySearchSchemes: build.query<Scheme[], { shopId: string; q: string }>({
      query: ({ shopId, q }) => ({
        url: schemeUrl(shopId, '/search'),
        params: { q },
      }),
      transformResponse: (res: any) => res.data,
    }),

    // SCHEMES BY TYPE
    getSchemesByType: build.query<
      Scheme[],
      { shopId: string; schemeType: string }
    >({
      query: ({ shopId, schemeType }) => ({
        url: schemeUrl(shopId, `/by-type/${schemeType}`),
      }),
      transformResponse: (res: any) => res.data,
    }),

    // ══════════════════════════════════════════
    // SECTION 5 — ENROLLMENTS
    // ══════════════════════════════════════════

    // ENROLL CUSTOMER
    enrollCustomer: build.mutation<SchemeEnrollment, EnrollCustomerInput>({
      query: ({ shopId, schemeId, ...body }) => ({
        url: schemeUrl(shopId, `/${schemeId}/enroll`),
        method: 'POST',
        body,
      }),
      transformResponse: (res: EnrollmentResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, schemeId }) => [
        { type: 'EnrollmentList', id: schemeId },
        { type: 'Scheme', id: schemeId },
        { type: 'SchemeDashboard', id: shopId },
      ],
    }),

    // GET SCHEME ENROLLMENTS
    getSchemeEnrollments: build.query<
      EnrollmentListResponse,
      { shopId: string; schemeId: string; page?: number; limit?: number; status?: string }
    >({
      query: ({ shopId, schemeId, ...params }) => ({
        url: schemeUrl(shopId, `/${schemeId}/enrollments`),
        params,
      }),
      providesTags: (_res, _err, { schemeId }) => [
        { type: 'EnrollmentList', id: schemeId },
      ],
    }),

    // GET ENROLLMENT BY ID
    getEnrollmentById: build.query<
      SchemeEnrollment,
      { shopId: string; enrollmentId: string }
    >({
      query: ({ shopId, enrollmentId }) => ({
        url: enrollmentUrl(shopId, enrollmentId),
      }),
      transformResponse: (res: EnrollmentResponse) => res.data,
      providesTags: (_res, _err, { enrollmentId }) => [
        { type: 'Enrollment', id: enrollmentId },
      ],
    }),

    // UPDATE ENROLLMENT
    updateEnrollment: build.mutation<
      SchemeEnrollment,
      { shopId: string; enrollmentId: string; [key: string]: any }
    >({
      query: ({ shopId, enrollmentId, ...body }) => ({
        url: enrollmentUrl(shopId, enrollmentId),
        method: 'PUT',
        body,
      }),
      transformResponse: (res: EnrollmentResponse) => res.data,
      invalidatesTags: (_res, _err, { enrollmentId }) => [
        { type: 'Enrollment', id: enrollmentId },
      ],
    }),

    // CANCEL ENROLLMENT
    cancelEnrollment: build.mutation<SchemeEnrollment, CancelEnrollmentInput>({
      query: ({ shopId, enrollmentId, ...body }) => ({
        url: enrollmentUrl(shopId, enrollmentId),
        method: 'DELETE',
        body,
      }),
      transformResponse: (res: EnrollmentResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, enrollmentId }) => [
        { type: 'Enrollment', id: enrollmentId },
        { type: 'EnrollmentList', id: shopId },
        { type: 'SchemeDashboard', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // SECTION 6 — PAYMENTS
    // ══════════════════════════════════════════

    // RECORD PAYMENT
    recordPayment: build.mutation<any, RecordPaymentInput>({
      query: ({ shopId, enrollmentId, ...body }) => ({
        url: enrollmentUrl(shopId, enrollmentId, '/pay'),
        method: 'POST',
        body,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_res, _err, { shopId, enrollmentId }) => [
        { type: 'Enrollment', id: enrollmentId },
        { type: 'EnrollmentList', id: shopId },
        { type: 'DuesList', id: shopId },
        { type: 'SchemeDashboard', id: shopId },
      ],
    }),

    // GET ENROLLMENT PAYMENTS
    getEnrollmentPayments: build.query<
      any[],
      { shopId: string; enrollmentId: string }
    >({
      query: ({ shopId, enrollmentId }) => ({
        url: enrollmentUrl(shopId, enrollmentId, '/payments'),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_res, _err, { enrollmentId }) => [
        { type: 'Enrollment', id: `${enrollmentId}-payments` },
      ],
    }),

    // ══════════════════════════════════════════
    // SECTION 7 — SCHEDULE & MATURITY
    // ══════════════════════════════════════════

    // GET INSTALLMENT SCHEDULE
    getInstallmentSchedule: build.query<
      any,
      { shopId: string; enrollmentId: string }
    >({
      query: ({ shopId, enrollmentId }) => ({
        url: enrollmentUrl(shopId, enrollmentId, '/schedule'),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_res, _err, { enrollmentId }) => [
        { type: 'Enrollment', id: `${enrollmentId}-schedule` },
      ],
    }),

    // CALCULATE MATURITY
    calculateMaturity: build.query<
      MaturityValueResponse['data'],
      { shopId: string; enrollmentId: string }
    >({
      query: ({ shopId, enrollmentId }) => ({
        url: enrollmentUrl(shopId, enrollmentId, '/maturity'),
      }),
      transformResponse: (res: MaturityValueResponse) => res.data,
    }),

    // MATURE ENROLLMENT
    matureEnrollment: build.mutation<
      SchemeEnrollment,
      { shopId: string; enrollmentId: string }
    >({
      query: ({ shopId, enrollmentId }) => ({
        url: enrollmentUrl(shopId, enrollmentId, '/mature'),
        method: 'POST',
      }),
      transformResponse: (res: EnrollmentResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, enrollmentId }) => [
        { type: 'Enrollment', id: enrollmentId },
        { type: 'EnrollmentList', id: shopId },
        { type: 'SchemeDashboard', id: shopId },
      ],
    }),

    // REDEEM ENROLLMENT
    redeemEnrollment: build.mutation<SchemeEnrollment, RedeemEnrollmentInput>({
      query: ({ shopId, enrollmentId, ...body }) => ({
        url: enrollmentUrl(shopId, enrollmentId, '/redeem'),
        method: 'POST',
        body,
      }),
      transformResponse: (res: EnrollmentResponse) => res.data,
      invalidatesTags: (_res, _err, { shopId, enrollmentId }) => [
        { type: 'Enrollment', id: enrollmentId },
        { type: 'EnrollmentList', id: shopId },
        { type: 'SchemeDashboard', id: shopId },
      ],
    }),

    // ══════════════════════════════════════════
    // SECTION 8 — CUSTOMER SCOPED
    // ══════════════════════════════════════════

    // GET CUSTOMER ENROLLMENTS
    getCustomerEnrollments: build.query<
      EnrollmentListResponse,
      { shopId: string; customerId: string; page?: number; limit?: number; status?: string }
    >({
      query: ({ shopId, customerId, ...params }) => ({
        url: schemeUrl(shopId, `/customer/${customerId}/enrollments`),
        params,
      }),
      providesTags: (_res, _err, { customerId }) => [
        { type: 'EnrollmentList', id: customerId },
      ],
    }),

    // GET CUSTOMER SCHEME SUMMARY
    getCustomerSchemeSummary: build.query<
      CustomerSchemeSummary,
      { shopId: string; customerId: string }
    >({
      query: ({ shopId, customerId }) => ({
        url: schemeUrl(shopId, `/customer/${customerId}/summary`),
      }),
      transformResponse: (res: any) => res.data,
    }),

    // ══════════════════════════════════════════
    // SECTION 9 — DUE COLLECTIONS
    // ══════════════════════════════════════════

    // DUES TODAY
    getDuesToday: build.query<DueEnrollment[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: schemeUrl(shopId, '/dues/today'),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'DuesList', id: `${shopId}-today` },
      ],
    }),

    // OVERDUE
    getOverdueDues: build.query<DueEnrollment[], { shopId: string }>({
      query: ({ shopId }) => ({
        url: schemeUrl(shopId, '/dues/overdue'),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'DuesList', id: `${shopId}-overdue` },
      ],
    }),

    // UPCOMING DUES
    getUpcomingDues: build.query<DueEnrollment[], { shopId: string; days?: number }>({
      query: ({ shopId, days }) => ({
        url: schemeUrl(shopId, '/dues/upcoming'),
        params: { days },
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'DuesList', id: `${shopId}-upcoming` },
      ],
    }),

    // SEND REMINDERS
    sendPaymentReminders: build.mutation<any, BulkReminderInput>({
      query: ({ shopId, ...body }) => ({
        url: schemeUrl(shopId, '/dues/send-reminders'),
        method: 'POST',
        body,
      }),
      transformResponse: (res: any) => res.data,
    }),

    // ══════════════════════════════════════════
    // SECTION 10 — ANALYTICS & DASHBOARD
    // ══════════════════════════════════════════

    // SCHEME ANALYTICS
    getSchemeAnalytics: build.query<
      SchemeAnalyticsData,
      { shopId: string; startDate?: string; endDate?: string }
    >({
      query: ({ shopId, ...params }) => ({
        url: schemeUrl(shopId, '/analytics'),
        params,
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'SchemeAnalytics', id: shopId },
      ],
    }),

    // SCHEME DASHBOARD
    getSchemeDashboard: build.query<SchemeDashboard, { shopId: string }>({
      query: ({ shopId }) => ({
        url: schemeUrl(shopId, '/dashboard'),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'SchemeDashboard', id: shopId },
      ],
    }),

    // SCHEME SPECIFIC ANALYTICS
    getSchemeSpecificAnalytics: build.query<
      SchemeSpecificAnalytics,
      { shopId: string; schemeId: string }
    >({
      query: ({ shopId, schemeId }) => ({
        url: schemeUrl(shopId, `/${schemeId}/analytics`),
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_res, _err, { schemeId }) => [
        { type: 'SchemeAnalytics', id: schemeId },
      ],
    }),

    // ══════════════════════════════════════════
    // SECTION 11 — MATURITY TRACKING
    // ══════════════════════════════════════════

    // MATURING SOON
    getMaturingSoon: build.query<
      SchemeEnrollment[],
      { shopId: string; days?: number }
    >({
      query: ({ shopId, days }) => ({
        url: schemeUrl(shopId, '/maturing-soon'),
        params: { days },
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (_res, _err, { shopId }) => [
        { type: 'EnrollmentList', id: `${shopId}-maturing` },
      ],
    }),

    // MATURED ENROLLMENTS
    getMaturedEnrollments: build.query<
      EnrollmentListResponse,
      { shopId: string; page?: number; limit?: number; startDate?: string; endDate?: string }
    >({
      query: ({ shopId, ...params }) => ({
        url: schemeUrl(shopId, '/matured'),
        params,
      }),
      providesTags: (_res, _err, { shopId }) => [
        { type: 'EnrollmentList', id: `${shopId}-matured` },
      ],
    }),

    // ══════════════════════════════════════════
    // SECTION 12 — BULK OPERATIONS
    // ══════════════════════════════════════════

    // BULK SEND REMINDERS
    bulkSendReminders: build.mutation<any, BulkReminderInput>({
      query: ({ shopId, ...body }) => ({
        url: schemeUrl(shopId, '/bulk-send-reminders'),
        method: 'POST',
        body,
      }),
      transformResponse: (res: any) => res.data,
    }),

    // BULK EXPORT
    bulkExportSchemes: build.mutation<any, BulkExportInput>({
      query: ({ shopId, ...body }) => ({
        url: schemeUrl(shopId, '/bulk-export'),
        method: 'POST',
        body,
      }),
      transformResponse: (res: any) => res.data,
    }),
  }),
})

// ─────────────────────────────────────────────
// EXPORT HOOKS
// ─────────────────────────────────────────────
export const {
  // Scheme CRUD
  useGetSchemesQuery,
  useGetSchemeByIdQuery,
  useCreateSchemeMutation,
  useUpdateSchemeMutation,
  useDeleteSchemeMutation,

  // Status
  useUpdateSchemeStatusMutation,
  useActivateSchemeMutation,
  usePauseSchemeMutation,
  useArchiveSchemeMutation,

  // Approval
  useApproveSchemeMutation,
  useRejectSchemeMutation,

  // Filters & Search
  useGetActiveSchemesQuery,
  useGetFeaturedSchemesQuery,
  useGetExpiringSoonQuery,
  useSearchSchemesQuery,
  useLazyLazySearchSchemesQuery,
  useGetSchemesByTypeQuery,

  // Enrollments
  useEnrollCustomerMutation,
  useGetSchemeEnrollmentsQuery,
  useGetEnrollmentByIdQuery,
  useUpdateEnrollmentMutation,
  useCancelEnrollmentMutation,

  // Payments
  useRecordPaymentMutation,
  useGetEnrollmentPaymentsQuery,

  // Schedule & Maturity
  useGetInstallmentScheduleQuery,
  useCalculateMaturityQuery,
  useMatureEnrollmentMutation,
  useRedeemEnrollmentMutation,

  // Customer Scoped
  useGetCustomerEnrollmentsQuery,
  useGetCustomerSchemeSummaryQuery,

  // Dues
  useGetDuesTodayQuery,
  useGetOverdueDuesQuery,
  useGetUpcomingDuesQuery,
  useSendPaymentRemindersMutation,

  // Analytics & Dashboard
  useGetSchemeAnalyticsQuery,
  useGetSchemeDashboardQuery,
  useGetSchemeSpecificAnalyticsQuery,

  // Maturity Tracking
  useGetMaturingSoonQuery,
  useGetMaturedEnrollmentsQuery,

  // Bulk
  useBulkSendRemindersMutation,
  useBulkExportSchemesMutation,
} = schemeApi