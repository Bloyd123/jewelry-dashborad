// FILE: src/components/girviTransfer/GirviTransferTable/GirviTransferTable.types.ts

import type { IGirviTransfer } from '@/types/girviTransfer.types'

export type { IGirviTransfer as GirviTransfer }

export interface GirviTransferTableProps {
  shopId:   string
  girviId?: string   // agar specific girvi ke transfers chahiye
}