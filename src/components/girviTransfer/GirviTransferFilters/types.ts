// FILE: src/components/girviTransfer/GirviTransferFilters/types.ts

import type { DateRange } from 'react-day-picker'

export interface GirviTransferFilterValues {
  search:        string
  status?:       string | undefined
  transferType?: string | undefined
  dateRange?:    DateRange | undefined
  [key: string]: string | DateRange | undefined
}