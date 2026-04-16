// FILE: src/pages/girviTransfer/GirviTransferListPage.tsx

import { useState }       from 'react'
import { useNavigate }    from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PlusCircle }     from 'lucide-react'
import { Button }         from '@/components/ui/button'
import { useAuth }        from '@/hooks/auth'
import { GirviTransferTable }   from '@/components/girviTransfer/GirviTransferTable'
import { GirviTransferFilters } from '@/components/girviTransfer/GirviTransferFilters'
import type { GirviTransferFilterValues } from '@/components/girviTransfer/GirviTransferFilters'

export default function GirviTransferListPage() {
  const { t }      = useTranslation()
  const navigate   = useNavigate()
  const { currentShopId } = useAuth()
  const shopId     = currentShopId || ''

  const [filters, setFilters] = useState<GirviTransferFilterValues>({
    search:       '',
    status:       undefined,
    transferType: undefined,
    dateRange:    undefined,
  })

  const handleClearAll = () => setFilters({
    search: '', status: undefined, transferType: undefined, dateRange: undefined,
  })

  if (!shopId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-text-secondary">{t('common.selectShopFirst', 'Please select a shop first')}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {t('girviTransfer.list.title', 'Girvi Transfers')}
          </h1>
          <p className="mt-1 text-text-secondary">
            {t('girviTransfer.list.subtitle', 'Manage all girvi transfers')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <GirviTransferFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearAll={handleClearAll}
      />

      {/* Table */}
      <GirviTransferTable shopId={shopId} />
    </div>
  )
}