// ============================================================================
// FILE: src/pages/products/ProductDetailsPage.tsx
// Product Details Page Component - Complete with All Tabs
// ============================================================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ProductDetailHeader } from '@/components/products/ProductDetailsPage/ProductDetailHeader'
import {
  OverviewTab,
  PricingTab,
  ImagesTab,
  HistoryTab,
} from '@/components/products/ProductDetailsPage/tabs'
import { dummyProducts } from '../mock.data'
import type { Product } from '@/types/product.types'

// ============================================================================
// PRODUCT DETAILS PAGE COMPONENT
// ============================================================================

export const ProductDetailsPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Get product data - Currently using dummy data
  // TODO: Replace with API call
  // const { productId } = useParams()
  // const { data: product, isLoading } = useGetProductByIdQuery(productId)
  const product: Product = dummyProducts[0]
  const isLoading = false

  // ========================================================================
  // NAVIGATION HANDLERS
  // ========================================================================

  const handleBackClick = () => {
    // TODO: Add navigation logic
    console.log('Navigate back to products list')
    // navigate('/products')
  }

  const handleSettingsClick = () => {
    setIsSettingsOpen(true)
    console.log('Open product settings/edit modal')
    // TODO: Implement product settings/edit modal
  }

  // ========================================================================
  // TAB HANDLERS
  // ========================================================================

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    console.log('Active tab changed to:', tab)
  }

  // ========================================================================
  // PRICING TAB HANDLERS
  // ========================================================================

  const handleRecalculatePrice = async () => {
    console.log('Recalculating price for product:', product._id)

    // TODO: API call to recalculate price
    // try {
    //   const response = await fetch(
    //     `/api/v1/shops/${product.shopId}/products/${product._id}/calculate-price`,
    //     {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ useCurrentRate: true }),
    //     }
    //   )
    //   const data = await response.json()
    //   console.log('Price recalculated:', data)
    //   // Refresh product data
    // } catch (error) {
    //   console.error('Error recalculating price:', error)
    // }
  }

  // ========================================================================
  // IMAGES TAB HANDLERS
  // ========================================================================

  const handleUploadImage = async (files: FileList) => {
    console.log('Uploading images:', files)

    // TODO: API call to upload images
    // const formData = new FormData()
    // Array.from(files).forEach((file) => {
    //   formData.append('images', file)
    // })

    // try {
    //   const response = await fetch(
    //     `/api/v1/shops/${product.shopId}/products/${product._id}/images`,
    //     {
    //       method: 'POST',
    //       body: formData,
    //     }
    //   )
    //   const data = await response.json()
    //   console.log('Images uploaded:', data)
    //   // Refresh product data
    // } catch (error) {
    //   console.error('Error uploading images:', error)
    // }
  }

  const handleDeleteImage = async (imageUrl: string) => {
    console.log('Deleting image:', imageUrl)

    // TODO: API call to delete image
    // try {
    //   const response = await fetch(
    //     `/api/v1/shops/${product.shopId}/products/${product._id}/images`,
    //     {
    //       method: 'DELETE',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ imageUrl }),
    //     }
    //   )
    //   const data = await response.json()
    //   console.log('Image deleted:', data)
    //   // Refresh product data
    // } catch (error) {
    //   console.error('Error deleting image:', error)
    // }
  }

  const handleSetPrimaryImage = async (imageUrl: string) => {
    console.log('Setting primary image:', imageUrl)

    // TODO: API call to set primary image
    // try {
    //   const response = await fetch(
    //     `/api/v1/shops/${product.shopId}/products/${product._id}/images/primary`,
    //     {
    //       method: 'PATCH',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ imageUrl }),
    //     }
    //   )
    //   const data = await response.json()
    //   console.log('Primary image set:', data)
    //   // Refresh product data
    // } catch (error) {
    //   console.error('Error setting primary image:', error)
    // }
  }

  // ========================================================================
  // HISTORY TAB HANDLERS
  // ========================================================================

  const handleLoadMoreHistory = async () => {
    console.log('Loading more history for product:', product._id)

    // TODO: API call to load more history
    // try {
    //   const response = await fetch(
    //     `/api/v1/shops/${product.shopId}/products/${product._id}/history?limit=50&offset=${currentOffset}`,
    //   )
    //   const data = await response.json()
    //   console.log('More history loaded:', data)
    //   // Append to existing history
    // } catch (error) {
    //   console.error('Error loading history:', error)
    // }
  }

  // ========================================================================
  // RENDER TAB CONTENT
  // ========================================================================

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      )
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewTab product={product} loading={isLoading} />

      case 'pricing':
        return (
          <PricingTab
            product={product}
            loading={isLoading}
            onRecalculatePrice={handleRecalculatePrice}
          />
        )

      case 'images':
        return (
          <ImagesTab
            product={product}
            loading={isLoading}
            onUploadImage={handleUploadImage}
            onDeleteImage={handleDeleteImage}
            onSetPrimaryImage={handleSetPrimaryImage}
          />
        )

      case 'history':
        return (
          <HistoryTab
            product={product}
            loading={isLoading}
            onLoadMore={handleLoadMoreHistory}
            hasMore={false}
          />
        )

      default:
        return null
    }
  }

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header with Tabs */}
      <ProductDetailHeader
        productId={product._id}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onBackClick={handleBackClick}
        onSettingsClick={handleSettingsClick}
      />

      {/* Tab Content - Rendered outside header */}
      <div className="p-6">{renderTabContent()}</div>

      {/* TODO: Add Product Settings/Edit Modal */}
      {/* <ProductSettingsModal
        product={product}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveProductSettings}
      /> */}
    </div>
  )
}

export default ProductDetailsPage
