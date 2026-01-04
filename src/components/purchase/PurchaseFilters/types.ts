// FILE: src/components/purchase/PurchaseFilters/types.ts
// Purchase Filter Types

import type { DateRange } from 'react-day-picker'

export interface PurchaseFilterValues {
  search: string
  supplierId?: string | undefined
  status?: string | undefined
  paymentStatus?: string | undefined
  dateRange?: DateRange | undefined
  purchaseType?: string | undefined
  approvalStatus?: string | undefined
  [key: string]: string | DateRange | undefined
}
