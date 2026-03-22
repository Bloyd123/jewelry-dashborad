// FILE: src/components/supplier/SupplierDetailsPage/SupplierDetailHeader.tsx

import React from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { DesktopSupplierDetailHeader } from './DesktopSupplierDetailHeader'
import { MobileSupplierDetailHeader } from './MobileSupplierDetailHeader'
import type { Supplier } from '@/types/supplier.types'
import type { ManagementAction } from '@/components/supplier/SupplierManagementModal/SupplierManagementModal.types'

interface SupplierDetailHeaderProps {
  supplier: Supplier
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onEditClick?: () => void
  onRefetch?: () => void
  onManagementAction?: (action: ManagementAction) => void
}

export const SupplierDetailHeader: React.FC<SupplierDetailHeaderProps> = props => {
// AFTER - try karo
const isMobile = useMediaQuery('(max-width: 768px)')

return isMobile ? (
  <MobileSupplierDetailHeader {...props} />
) : (
  <DesktopSupplierDetailHeader {...props} />
)
}

export default SupplierDetailHeader