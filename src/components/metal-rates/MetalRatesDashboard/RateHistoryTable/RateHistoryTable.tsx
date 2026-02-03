// FILE: src/components/metal-rates/MetalRatesDashboard/RateHistoryTable/RateHistoryTable.tsx
// Rate History Table Component - With Responsive Drawer Filters

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { rateHistoryColumns } from './RateHistoryColumns'
import { mockRateHistory } from '@/pages/metal-rates/metal-rate.mock'
import { RateHistoryFilters } from './RateHistoryFilters'
import type { RateHistoryFilterValues } from './RateHistoryFilters'
import type { SortingState } from '@/components/ui/data-display/DataTable/DataTable.types'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { SearchBar } from '@/components/ui/SearchBar'

// MAIN COMPONENT

export const RateHistoryTable: React.FC = () => {
  const { t } = useTranslation()

  // STATE

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<RateHistoryFilterValues>({
    metalType: undefined,
    dateRange: 'last7days',
  })

  // Initial sorting state
  const [sortingState, setSortingState] = useState<SortingState[]>([
    { columnId: 'rateDate', direction: 'desc' },
  ])

  // FILTERED DATA

  const filteredData = useMemo(() => {
    let data = [...mockRateHistory]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      data = data.filter(
        rate =>
          rate.rateDate.toLowerCase().includes(searchLower) ||
          rate.notes?.toLowerCase().includes(searchLower)
      )
    }

    // Metal type filter
    if (filters.metalType && filters.metalType !== 'all') {
      data = data.filter(rate =>
        rate.metalTypes.includes(filters.metalType as any)
      )
    }

    // Date range filter
    if (filters.dateRange) {
      const today = new Date()
      let daysToSubtract = 7

      switch (filters.dateRange) {
        case 'last7days':
          daysToSubtract = 7
          break
        case 'last30days':
          daysToSubtract = 30
          break
        case 'last90days':
          daysToSubtract = 90
          break
        case 'lastYear':
          daysToSubtract = 365
          break
      }

      const fromDate = new Date()
      fromDate.setDate(today.getDate() - daysToSubtract)

      data = data.filter(rate => new Date(rate.rateDate) >= fromDate)
    }

    return data
  }, [search, filters])

  // HANDLERS

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const handleFiltersChange = (newFilters: RateHistoryFilterValues) => {
    setFilters(newFilters)
  }

  const handleClearAll = () => {
    setSearch('')
    setFilters({
      metalType: undefined,
      dateRange: 'last7days',
    })
  }

  const handleExport = () => {
    console.log('Export CSV:', filteredData)
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
          disabled={filteredData.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          {t('metalRates.common.exportCSV')}
        </Button>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="w-full">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder={t('common.search')}
          className="w-full md:w-96"
        />
      </div>

      {/* Filters - Responsive (Desktop inline, Mobile drawer) */}
      <RateHistoryFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAll}
      />

      {/* Stats Summary */}
      <div className="text-sm text-text-secondary">
        {t('metalRates.common.showing')}{' '}
        {filteredData.length > 0
          ? '1-' + Math.min(10, filteredData.length)
          : '0'}{' '}
        {t('metalRates.common.of')} {filteredData.length}
      </div>

      {/* DataTable */}
      <DataTable
        data={filteredData}
        columns={rateHistoryColumns}
        // Sorting Configuration
        sorting={{
          enabled: true,
          sortingState: sortingState,
          onSortingChange: setSortingState,
        }}
        // Pagination Configuration
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 50],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
        }}
        // NO Selection
        selection={{
          enabled: false,
        }}
        // NO Row Actions
        rowActions={{
          enabled: false,
        }}
        // Empty State Configuration
        emptyState={{
          message: t('rateHistory.noRates'),
        }}
        // Style Configuration
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
        // Get Row ID
        getRowId={row => row._id}
        // Test ID
        testId="rate-history-table"
        ariaLabel={t('rateHistory.ariaLabel')}
      />
    </div>
  )
}

RateHistoryTable.displayName = 'RateHistoryTable'
