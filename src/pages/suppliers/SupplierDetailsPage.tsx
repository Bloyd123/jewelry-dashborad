// FILE: src/pages/suppliers/SupplierDetailPage.tsx

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/auth'
import { useSupplierById } from '@/hooks/supplier'
import { SupplierDetailHeader } from '@/components/supplier/SupplierDetailsPage'
import SupplierOverviewTab from '@/components/supplier/SupplierDetailsPage/tabs/OverviewTab'
import SupplierFinancialTab from '@/components/supplier/SupplierDetailsPage/tabs/FinancialTab'
import SupplierDocumentsTab from '@/components/supplier/SupplierDetailsPage/tabs/DocumentsTab'
import { SupplierManagementModal } from '@/components/supplier/SupplierManagementModal'
import SupplierActivityTab from '@/components/supplier/SupplierDetailsPage/tabs/ActivityLogTab'

import type { ManagementAction } from '@/components/supplier/SupplierManagementModal/SupplierManagementModal.types'
import { Loader } from '@/components/ui/loader'
export default function SupplierDetailPage() {
  const { supplierId } = useParams<{ supplierId: string }>()
  const navigate = useNavigate()
  const { currentShopId } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false)
  const [managementAction, setManagementAction] = useState<ManagementAction | null>(null)

  const { supplier, isLoading, error, refetch } = useSupplierById(
    currentShopId!,
    supplierId!
  )

  if (!currentShopId) {
    return <div className="p-6 text-status-error">No shop selected</div>
  }

if (isLoading || !supplier) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <Loader size="lg" variant="spinner" text="Loading supplier..." />
    </div>
  )
}

  if (error) {
    return <div className="p-6 text-status-error">Failed to load supplier</div>
  }

  const handleManagementSuccess = async () => {
    await refetch()
    setIsManagementModalOpen(false)
    setManagementAction(null)
  }

  const handleManagementAction = (action: ManagementAction) => {
    setManagementAction(action)
    setIsManagementModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <SupplierDetailHeader
        supplier={supplier}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBackClick={() => navigate('/suppliers')}
        onEditClick={() => navigate(`/suppliers/edit/${supplierId}`)}
        onRefetch={refetch}
        onManagementAction={handleManagementAction}
      />

      <div className="p-6">
        {activeTab === 'overview' && (
          <SupplierOverviewTab supplier={supplier} />
        )}
        {activeTab === 'financial' && (
          <SupplierFinancialTab supplier={supplier} />
        )}
        {activeTab === 'documents' && (
          <SupplierDocumentsTab supplier={supplier} onRefetch={refetch} />
        )}
        {activeTab === 'activity' && (<SupplierActivityTab supplier={supplier} />    )}
      </div>

      <SupplierManagementModal
        open={isManagementModalOpen}
        onOpenChange={setIsManagementModalOpen}
        supplier={supplier}
        action={managementAction}
        onSuccess={handleManagementSuccess}
      />
    </div>
  )
}