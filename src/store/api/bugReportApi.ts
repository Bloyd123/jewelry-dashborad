// FILE: src/store/api/bugReportApi.ts

import { baseApi } from './baseApi'
import { BUG_REPORT_ENDPOINTS } from '@/api/endpoints'
import type {
  CreateBugReportInput,
  CreateBugReportResponse,
  BugReport,
} from '@/types/bugReport.types'

export const bugReportApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // ── CREATE BUG REPORT ──────────────────────────────────
    createBugReport: build.mutation<BugReport, CreateBugReportInput>({
      query: data => ({
        url: BUG_REPORT_ENDPOINTS.CREATE,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: CreateBugReportResponse) =>
        response.data.bug,
    }),
  }),
})

export const { useCreateBugReportMutation } = bugReportApi