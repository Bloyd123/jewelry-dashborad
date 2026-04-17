// FILE: src/components/girviCashbook/GirviCashbookTable/GirviCashbookTable.types.ts

import type { IGirviCashbookEntry } from '@/types/girviCashbook.types'

export type { IGirviCashbookEntry as GirviCashbookEntry }

export interface GirviCashbookTableProps {
  shopId:   string
  girviId?: string  
}