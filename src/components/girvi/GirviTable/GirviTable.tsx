// FILE: src/components/girvi/GirviTable/GirviTable.tsx

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate }    from 'react-router-dom'
import { DataTable }      from '@/components/ui/data-display/DataTable'
import { useAuth }        from '@/hooks/auth'
import { useGirviList }   from '@/hooks/girvi/useGirviList'
import { useGirviActions } from '@/hooks/girvi/useGirviActions'
import { buildRoute } from '@/constants/routePaths'
import { girviTableColumns }                        from './GirviTableColumns'
import { getGirviRowActions, GirviBulkActionsBar }  from './GirviTableActions'
import type { Girvi } from '@/types/girvi.types'

import { Input }          from '@/components/ui/input'
import { Label }          from '@/components/ui/label'
import { Switch }         from '@/components/ui/switch'
import { StatusFilter }   from '@/components/ui/filters/StatusFilter'
import { FilterBar }      from '@/components/ui/filters/FilterBar'
import { FilterChips }    from '@/components/ui/filters/FilterChips'
import type { ActiveFilter } from '@/components/ui/filters/FilterChips'
import type { StatusOption } from '@/components/ui/filters/StatusFilter'


interface GirviFilterState {
  search?: string
  status?: string
  overdueOnly?: boolean
}


const STATUS_OPTIONS: StatusOption[] = [
  { value: 'active',      label: 'Active',      variant: 'active',    showDot: true },
  { value: 'overdue',     label: 'Overdue',     variant: 'inactive',  showDot: true },
  { value: 'released',    label: 'Released',    variant: 'completed', showDot: true },
  { value: 'transferred', label: 'Transferred', variant: 'pending',   showDot: true },
  { value: 'auctioned',   label: 'Auctioned',   variant: 'inactive',  showDot: true },
]


const GirviFilterBar = ({
  filters,
  onChange,
  onClear,
}: {
  filters: GirviFilterState
  onChange: (f: GirviFilterState) => void
  onClear: () => void
}) => {
  const { t } = useTranslation()

  const activeFilters: ActiveFilter[] = useMemo(() => {
    const chips: ActiveFilter[] = []
    if (filters.search)      chips.push({ id: 'search',      label: t('girvi.search'),      value: filters.search })
    if (filters.status)      chips.push({ id: 'status',      label: t('girvi.status'),      value: filters.status })
    if (filters.overdueOnly) chips.push({ id: 'overdueOnly', label: t('girvi.overdueOnly'), value: t('common.yes') })
    return chips
  }, [filters, t])

  const handleRemoveChip = (id: string) => {
    const updated = { ...filters }
    if (id === 'search')      delete updated.search
    if (id === 'status')      delete updated.status
    if (id === 'overdueOnly') delete updated.overdueOnly
    onChange(updated)
  }

  const hasActiveFilters = activeFilters.length > 0

  return (
    <div className="space-y-3">
      <FilterBar
        hasActiveFilters={hasActiveFilters}
        onClearAll={onClear}
        showClearButton={hasActiveFilters}
      >
        <Input
          type="text"
          value={filters.search || ''}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          placeholder={t('girvi.searchPlaceholder')}
          className="h-9 w-56"
        />

        <StatusFilter
          value={filters.status}
          onChange={val => onChange({ ...filters, status: val })}
          options={STATUS_OPTIONS}
          showAllOption
        />

        <div className="flex items-center gap-2">
          <Switch
            id="overdue-switch"
            checked={!!filters.overdueOnly}
            onCheckedChange={checked => onChange({ ...filters, overdueOnly: checked })}
          />
          <Label htmlFor="overdue-switch" className="cursor-pointer text-sm">
            {t('girvi.overdueOnly')}
          </Label>
        </div>
      </FilterBar>

      {hasActiveFilters && (
        <FilterChips
          filters={activeFilters}
          onRemove={handleRemoveChip}
          onClearAll={onClear}
        />
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

  const { girvis, pagination, isLoading, updateFilters, resetFilters, goToPage } = useGirviList(shopId)

  const { deleteGirvi } = useGirviActions(shopId)

  const handleView      = (g: Girvi) => navigate(`/shops/${shopId}/girvi/${g._id}`)
  const handleEdit      = (g: Girvi) => navigate(`/shops/${shopId}/girvi/edit/${g._id}`)
  const handleRelease   = (g: Girvi) => navigate(`/shops/${shopId}/girvi/${g._id}/release`)
  const handleCalculate = (g: Girvi) => navigate(`/shops/${shopId}/girvi/${g._id}?tab=interest`)
  const handleTransfer  = (g: Girvi) => navigate(buildRoute.girviTransfer.addForGirvi(shopId, g._id))
  const handlePayments  = (g: Girvi) => navigate(buildRoute.girvi.payments(shopId, g._id))
  const handleDelete    = async (g: Girvi) => {
    if (window.confirm(t('girvi.deleteConfirm'))) {
      await deleteGirvi(g._id)
    }
  }

  const handleFilterChange = (newFilters: GirviFilterState) => {
    setFilters(newFilters)
    updateFilters({
      search:      newFilters.search      || undefined,
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
      handleView, handleEdit, handleRelease, handleCalculate, handleDelete, handleTransfer, handlePayments,
      userRole ?? 'staff'
    ),
    [userRole]
  )

  return (
    <div className="w-full space-y-4">
      <GirviFilterBar
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
          pageIndex: (pagination?.currentPage ?? 1) - 1,
          totalItems: pagination?.totalDocs,
          totalPages: pagination?.totalPages,
          pageSizeOptions: [10, 20, 50],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
          onPaginationChange: ({ pageIndex }) => goToPage(pageIndex + 1),
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
        getRowId={row => row._id}
        testId="girvi-table"
        ariaLabel={t('girvi.table.ariaLabel')}
      />
    </div>
  )
}

GirviTable.displayName = 'GirviTable'