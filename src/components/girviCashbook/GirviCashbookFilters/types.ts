// FILE: src/components/girviCashbook/GirviCashbookFilters/types.ts

import type { DateRange } from 'react-day-picker'
import type {
  CashbookEntryType,
  FlowType,
  PaymentMode,
} from '@/types/girviCashbook.types'

export interface GirviCashbookFilterValues {
  search:       string
  entryType?:   CashbookEntryType | undefined
  flowType?:    FlowType          | undefined
  paymentMode?: PaymentMode       | undefined
  dateRange?:   DateRange         | undefined
  [key: string]: string | DateRange | undefined
}