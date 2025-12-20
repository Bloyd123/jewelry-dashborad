// ============================================================================
// FILE: src/pages/shops/ShopsPage.tsx
// Shop List Page - Complete Implementation
// ============================================================================

import * as React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShopFilters, ShopFilterValues } from '@/components/shop/ShopFilters'
import { ShopTable } from '@/components/shop/ShopTable'

export const ShopListPage = () => {
  // State for filters
  const [filters, setFilters] = React.useState<ShopFilterValues>({
    search: '',
  })

  // Handler for filter changes
  const handleFiltersChange = (newFilters: ShopFilterValues) => {
    setFilters(newFilters)
    // TODO: Trigger API call with new filters
    console.log('Filters changed:', newFilters)
  }

  // Handler for clearing all filters
  const handleClearAll = () => {
    setFilters({ search: '' })
    // TODO: Reset API call
    console.log('Filters cleared')
  }

  // Handler for adding new shop
  const handleAddShop = () => {
    // TODO: Navigate to create shop page or open modal
    console.log('Add new shop clicked')
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Shops</h1>
          <p className="mt-1 text-text-secondary">
            Manage your jewelry shops and branches
          </p>
        </div>
        <Button onClick={handleAddShop} className="w-full gap-2 sm:w-auto">
          <Plus className="h-4 w-4" />
          Add New Shop
        </Button>
      </div>

      {/* Filters Section */}
      <ShopFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAll}
      />

      {/* Table Section */}
      <ShopTable />
    </div>
  )
}
