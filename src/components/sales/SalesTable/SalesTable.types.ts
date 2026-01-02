// 
// FILE: src/components/sales/SalesTable/SalesTable.types.ts
// Sales Table TypeScript Types
// 

import type { Sale } from '@/types/sale.types'

// Re-export Sale type for convenience
export type { Sale }

// 
// TABLE-SPECIFIC TYPES
// 

// export interface SalesTableFilters {
//   search: string
//   customerId?: string
//   salesPerson?: string
//   status?: string
//   paymentStatus?: string
//   saleType?: string
//   paymentMode?:string
//   dateRange?:string
//   amountRange?:number
// }

export interface SalesTableSort {
  field: string
  direction: 'asc' | 'desc'
}

export interface SalesTableProps {
  onSaleSelect?: (sale: Sale) => void
  onSaleEdit?: (sale: Sale) => void
  hideActions?: boolean
  compactView?: boolean
}
