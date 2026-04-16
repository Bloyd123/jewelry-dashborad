// FILE: src/components/girvi/GirviTable/GirviTable.tsx

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate }    from 'react-router-dom'
import { DataTable }      from '@/components/ui/data-display/DataTable'
import { useAuth }        from '@/hooks/auth'
import { useGirviList }   from '@/hooks/girvi/useGirviList'
import { useGirviActions } from '@/hooks/girvi/useGirviActions'
import { girviTableColumns }                        from './GirviTableColumns'
import { getGirviRowActions, GirviBulkActionsBar }  from './GirviTableActions'
import type { Girvi } from '@/types/girvi.types'

interface GirviFilterState {
  search?: string
  status?: string
  overdueOnly?: boolean
}

const FilterBar = ({
  filters,
  onChange,
  onClear,
}: {
  filters: GirviFilterState
  onChange: (f: GirviFilterState) => void
  onClear: () => void
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border-primary bg-bg-secondary p-3">
      <input
        type="text"
        value={filters.search || ''}
        onChange={e => onChange({ ...filters, search: e.target.value })}
        placeholder={t('girvi.searchPlaceholder')}
        className="h-9 w-56 rounded-lg border border-border-primary bg-bg-primary px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
      />

      <select
        value={filters.status || ''}
        onChange={e => onChange({ ...filters, status: e.target.value || undefined })}
        className="h-9 rounded-lg border border-border-primary bg-bg-primary px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
      >
        <option value="">{t('girvi.allStatuses')}</option>
        <option value="active">Active</option>
        <option value="overdue">Overdue</option>
        <option value="released">Released</option>
        <option value="transferred">Transferred</option>
        <option value="auctioned">Auctioned</option>
      </select>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
        <input
          type="checkbox"
          checked={!!filters.overdueOnly}
          onChange={e => onChange({ ...filters, overdueOnly: e.target.checked })}
          className="rounded"
        />
        {t('girvi.overdueOnly')}
      </label>

      {(filters.search || filters.status || filters.overdueOnly) && (
        <button onClick={onClear} className="text-sm text-text-tertiary hover:text-text-primary">
          {t('common.clearAll')}
        </button>
      )}
    </div>
  )
}


export const GirviTable: React.FC = () => {
  const { t }        = useTranslation()
  const navigate     = useNavigate()
  const { currentShopId, userRole } = useAuth()
  const shopId = currentShopId || ''

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [filters,      setFilters]      = useState<GirviFilterState>({})

  const { girvis, pagination, isLoading, updateFilters, resetFilters } = useGirviList(shopId, {
    search:      filters.search,
    status:      filters.status as any,
    overdueOnly: filters.overdueOnly,
  })

  const { deleteGirvi } = useGirviActions(shopId)

  const handleView      = (g: Girvi) => navigate(`/shops/${shopId}/girvi/${g._id}`)
  const handleEdit      = (g: Girvi) => navigate(`/shops/${shopId}/girvi/edit/${g._id}`)
  const handleRelease   = (g: Girvi) => navigate(`/shops/${shopId}/girvi/${g._id}/release`)
  const handleCalculate = (g: Girvi) => navigate(`/shops/${shopId}/girvi/${g._id}?tab=interest`)
  const handleDelete    = async (g: Girvi) => {
    if (window.confirm(t('girvi.deleteConfirm'))) {
      await deleteGirvi(g._id)
    }
  }

  const handleFilterChange = (newFilters: GirviFilterState) => {
    setFilters(newFilters)
    updateFilters({
      search:      newFilters.search || undefined,
      status:      newFilters.status as any || undefined,
      overdueOnly: newFilters.overdueOnly,
    })
  }

  const selectedGirvis = useMemo(
    () => girvis.filter(g => selectedRows.has(g._id)),
    [selectedRows, girvis]
  )

  const rowActions = useMemo(
    () => getGirviRowActions(
      handleView, handleEdit, handleRelease, handleCalculate, handleDelete,
      userRole ?? 'staff'
    ),
    [userRole]
  )

  return (
    <div className="w-full space-y-4">
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onClear={() => { setFilters({}); resetFilters() }}
      />

      {selectedRows.size > 0 && (
        <GirviBulkActionsBar
          selectedCount={selectedRows.size}
          selectedGirvis={selectedGirvis}
          onViewDetails={() => selectedGirvis.length === 1 && handleView(selectedGirvis[0])}
          onBulkExport={() => { /* TODO: wire bulk export */ }}
          onClearSelection={() => setSelectedRows(new Set())}
          userRole={userRole ?? 'staff'}
        />
      )}

      <DataTable
        data={girvis}
        loading={{ isLoading }}
        columns={girviTableColumns}
        sorting={{ enabled: true }}
        pagination={{
          enabled: true,
          pageSize: 20,
          pageSizeOptions: [10, 20, 50],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
        }}
        selection={{
          enabled: true,
          selectedRows,
          onSelectionChange: setSelectedRows,
          getRowId: row => row._id,
          selectAllEnabled: true,
        }}
        rowActions={{
          enabled: true,
          actions: rowActions,
          position: 'end',
        }}
        emptyState={{ message: t('girvi.table.noGirvis') }}
        style={{
          variant: 'default',
          size: 'md',
          stickyHeader: true,
          hoverEffect: true,
          zebraStripes: false,
          showBorder: true,
          rounded: true,
          shadow: true,
          fullWidth: true,
        }}
        onRowClick={g => handleView(g)}
        getRowId={row => row._id}
        testId="girvi-table"
        ariaLabel={t('girvi.table.ariaLabel')}
      />
    </div>
  )
}

GirviTable.displayName = 'GirviTable'