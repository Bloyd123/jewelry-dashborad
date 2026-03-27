// FILE: src/components/metal-rates/MetalRatesDashboard/RateHistoryTable/RateHistoryTable.tsx
// Rate History Table Component - With Responsive Drawer Filters

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { rateHistoryColumns } from './RateHistoryColumns'
import { useRateHistory } from '@/hooks/metalRates/useMetalRate'
import { RateHistoryFilters } from './RateHistoryFilters'
import type { RateHistoryFilterValues } from './RateHistoryFilters'
import type { SortingState } from '@/components/ui/data-display/DataTable/DataTable.types'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { SearchBar } from '@/components/ui/SearchBar'

// DATE RANGE HELPER

const getDateRange = (dateRange: string) => {
  const today = new Date()
  const from = new Date()
  const days: Record<string, number> = {
    last7days: 7,
    last30days: 30,
    last90days: 90,
    lastYear: 365,
  }
  from.setDate(today.getDate() - (days[dateRange] || 7))
  return {
    startDate: from.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  }
}

// MAIN COMPONENT

export const RateHistoryTable: React.FC<{ shopId: string }> = ({ shopId }) => {
  const { t } = useTranslation()

  // STATE
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<RateHistoryFilterValues>({
    metalType: undefined,
    dateRange: 'last7days',
  })
  const [sortingState, setSortingState] = useState<SortingState[]>([
    { columnId: 'rateDate', direction: 'desc' },
  ])

  // DATE RANGE
  const { startDate, endDate } = getDateRange(filters.dateRange || 'last7days')

  // API CALL
  const { rates, pagination, isLoading } = useRateHistory(shopId, {
    page: currentPage,
    startDate,
    endDate,
  })

  // HANDLERS
  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleFiltersChange = (newFilters: RateHistoryFilterValues) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleClearAll = () => {
    setSearch('')
    setCurrentPage(1)
    setFilters({
      metalType: undefined,
      dateRange: 'last7days',
    })
  }

  const handleExport = () => {
    console.log('Export CSV:', rates)
    // TODO: Generate and download CSV
  }

  // RENDER
  return (
    <div className="w-full space-y-4">
      {/* Header with Title and Actions */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
          {t('rateHistory.title')}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={!rates.length}
        >
          <Download className="mr-2 h-4 w-4" />
          {t('metalRates.common.exportCSV')}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder={t('common.search')}
          className="w-full md:w-96"
        />
      </div>

      {/* Filters */}
      <RateHistoryFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAll}
      />

      {/* Stats Summary */}
      <div className="text-sm text-text-secondary">
        {t('metalRates.common.showing')}{' '}
        {rates.length > 0 ? `1-${Math.min(10, rates.length)}` : '0'}{' '}
        {t('metalRates.common.of')} {pagination?.totalItems ?? rates.length}
      </div>

      {/* DataTable */}
      <DataTable
        data={rates}
        columns={rateHistoryColumns}
       loading={{ isLoading }} 
        sorting={{
          enabled: true,
          sortingState: sortingState,
          onSortingChange: setSortingState,
        }}
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 50],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
        }}
        selection={{
          enabled: false,
        }}
        rowActions={{
          enabled: false,
        }}
        emptyState={{
          message: t('rateHistory.noRates'),
        }}
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
        testId="rate-history-table"
        ariaLabel={t('rateHistory.ariaLabel')}
      />
    </div>
  )
}

RateHistoryTable.displayName = 'RateHistoryTable'