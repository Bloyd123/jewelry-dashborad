// FILE:     src/components/products/ProductTable/ProductTable.tsx
// Main Product Table Component

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { productTableColumns } from './ProductTableColumns'
import { getProductRowActions, BulkActionsBar } from './ProductTableActions'
import { ProductFilters } from '@/components/products/ProductFilters'
import type { ProductFilterValues } from '@/components/products/ProductFilters'
import { dummyProducts } from '@/pages/product/mock.data'
import { type Product } from '@/types/product.types'

// MAIN COMPONENT

export const ProductTable: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // STATE

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  )

  const [filters, setFilters] = useState<ProductFilterValues>({
    search: '',
    category: undefined,
    subCategory: undefined,
    metalType: undefined,
    purity: undefined,
    status: undefined,
    saleStatus: undefined,
    gender: undefined,
    productType: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  })

  // FILTERED DATA

  const filteredProducts = useMemo(() => {
    let result = [...dummyProducts]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.productCode.toLowerCase().includes(searchLower) ||
          p.barcode?.toLowerCase().includes(searchLower) ||
          p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(p => {
        const categoryId =
          typeof p.categoryId === 'string' ? p.categoryId : p.categoryId?._id
        return categoryId === filters.category
      })
    }

    // Apply metal type filter
    if (filters.metalType) {
      result = result.filter(p => p.metal.type === filters.metalType)
    }

    // Apply purity filter
    if (filters.purity) {
      result = result.filter(p => p.metal.purity === filters.purity)
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(p => p.status === filters.status)
    }

    // Apply sale status filter
    if (filters.saleStatus) {
      result = result.filter(p => p.saleStatus === filters.saleStatus)
    }

    // Apply gender filter
    if (filters.gender) {
      result = result.filter(p => p.gender === filters.gender)
    }

    // Apply product type filter
    if (filters.productType) {
      result = result.filter(p => p.productType === filters.productType)
    }

    // Apply price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      result = result.filter(p => {
        const price = p.pricing.sellingPrice
        if (filters.minPrice && price < filters.minPrice) return false
        if (filters.maxPrice && price > filters.maxPrice) return false
        return true
      })
    }

    return result
  }, [dummyProducts, filters])

  // HANDLERS

  const handleViewDetails = (product: Product) => {
    console.log('View Details:', product)
    navigate(`/products/${product._id}`)
  }

  const handleEdit = (product: Product) => {
    console.log('Edit Product:', product)
    navigate(`/products/edit/${product._id}`)
  }

  const handleDuplicate = (product: Product) => {
    console.log('Duplicate Product:', product)
    // TODO: Implement duplicate logic
  }

  const handleUpdateStock = (product: Product) => {
    console.log('Update Stock:', product)
    // TODO: Open stock update modal
  }

  const handleCalculatePrice = (product: Product) => {
    console.log('Calculate Price:', product)
    // TODO: Open price calculation modal
  }

  const handlePrintLabel = (product: Product) => {
    console.log('Print Label:', product)
    // TODO: Open print label dialog
  }

  const handleDelete = (product: Product) => {
    console.log('Delete Product:', product)
    // TODO: Show confirmation and delete
  }

  // Bulk Actions Handlers
  const handleBulkViewDetails = () => {
    const selected = filteredProducts.filter(p => selectedRows.has(p._id))
    if (selected.length === 1) {
      handleViewDetails(selected[0])
    }
  }

  const handleBulkEdit = () => {
    const selected = filteredProducts.filter(p => selectedRows.has(p._id))
    if (selected.length === 1) {
      handleEdit(selected[0])
    }
  }

  const handleBulkUpdateStatus = () => {
    const selected = filteredProducts.filter(p => selectedRows.has(p._id))
    console.log('Bulk Update Status:', selected)
    // TODO: Open bulk status update modal
  }

  const handleBulkPrint = () => {
    const selected = filteredProducts.filter(p => selectedRows.has(p._id))
    console.log('Bulk Print Labels:', selected)
    // TODO: Print labels for selected products
  }

  const handleBulkExport = () => {
    const selected = filteredProducts.filter(p => selectedRows.has(p._id))
    console.log('Bulk Export:', selected)
    // TODO: Export selected products
  }

  const handleBulkDelete = () => {
    const selected = filteredProducts.filter(p => selectedRows.has(p._id))
    console.log('Bulk Delete:', selected)
    // TODO: Show confirmation and bulk delete
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  const handleFiltersChange = (newFilters: ProductFilterValues) => {
    setFilters(newFilters)
  }

  const handleClearAllFilters = () => {
    setFilters({
      search: '',
      category: undefined,
      subCategory: undefined,
      metalType: undefined,
      purity: undefined,
      status: undefined,
      saleStatus: undefined,
      gender: undefined,
      productType: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    })
  }

  // ========================================================================
  // ROW ACTIONS
  // ========================================================================

  const rowActions = useMemo(
    () =>
      getProductRowActions(
        handleViewDetails,
        handleEdit,
        handleDuplicate,
        handleUpdateStock,
        handleCalculatePrice,
        handlePrintLabel,
        handleDelete
      ),
    []
  )

  // SELECTED PRODUCTS

  const selectedProducts = useMemo(() => {
    return filteredProducts.filter(product => selectedRows.has(product._id))
  }, [filteredProducts, selectedRows])

  // RENDER

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <ProductFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAllFilters}
      />

      {/* Bulk Actions Bar - Shows when rows are selected */}
      {selectedRows.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedProducts={selectedProducts}
          onViewDetails={handleBulkViewDetails}
          onEdit={handleBulkEdit}
          onBulkUpdateStatus={handleBulkUpdateStatus}
          onBulkPrint={handleBulkPrint}
          onBulkExport={handleBulkExport}
          onBulkDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* DataTable */}
      <DataTable
        data={filteredProducts}
        columns={productTableColumns}
        // Sorting Configuration
        sorting={{
          enabled: true,
        }}
        // Pagination Configuration
        pagination={{
          enabled: true,
          pageSize: 20,
          pageSizeOptions: [10, 20, 50, 100],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
        }}
        // Selection Configuration
        selection={{
          enabled: true,
          selectedRows,
          onSelectionChange: setSelectedRows,
          getRowId: row => row._id,
          selectAllEnabled: true,
        }}
        // Row Actions Configuration
        rowActions={{
          enabled: true,
          actions: rowActions,
          position: 'end',
        }}
        // Empty State Configuration
        emptyState={{
          message: t('product.table.noProducts'),
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
        // Row Click Handler
        onRowClick={product => {
          console.log('Row clicked:', product)
          // Optional: Open details on row click
          // handleViewDetails(product)
        }}
        // Get Row ID
        getRowId={row => row._id}
        // Test ID
        testId="product-table"
        ariaLabel={t('product.table.ariaLabel')}
      />
    </div>
  )
}

ProductTable.displayName = 'ProductTable'
