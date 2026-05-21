// FILE: src/components/scheme/SchemeTable/SchemeTable.types.ts

import type { Scheme, SchemeStatus, SchemeType, ApprovalStatus } from '@/types/scheme.types'

export type { Scheme }

export interface SchemeFilterValues {
  search:      string
  status?:     SchemeStatus
  schemeType?: SchemeType
  isActive?:   string
  isFeatured?: string
  startDate?:  string
  endDate?:    string
}