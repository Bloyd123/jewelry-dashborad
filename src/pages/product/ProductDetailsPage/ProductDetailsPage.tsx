// FILE: src/pages/products/ProductDetailsPage.tsx
// Product Details Page Component - Complete with All Tabs

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ProductDetailHeader } from '@/components/products/ProductDetailsPage/ProductDetailHeader'
import {
  OverviewTab,
  PricingTab,
  ImagesTab,
  HistoryTab,
} from '@/components/products/ProductDetailsPage/tabs'
import { selectCurrentShopId } from '@/store/slices/authSlice'
import { useProductById } from '@/hooks/product'
import { useProductActions } from '@/hooks/product'

// PRODUCT DETAILS PAGE COMPONENT

export const ProductDetailsPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { productId } = useParams<{ productId: string }>()

  const shopId = useSelector(selectCurrentShopId)!
  const { product, isLoading } = useProductById(shopId, productId!)
  const { calculatePrice } = useProductActions(shopId)

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // NAVIGATION HANDLERS

  const handleBackClick = () => {
    navigate('/products')
  }

  const handleSettingsClick = () => {
    setIsSettingsOpen(true)
    // TODO: Implement product settings/edit modal
  }

  // TAB HANDLERS

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // PRICING TAB HANDLERS

  const handleRecalculatePrice = async () => {
    if (!product) return
    await calculatePrice(product._id, { useCurrentRate: true })
  }

  // IMAGES TAB HANDLERS

  const handleUploadImage = async (files: FileList) => {
    // TODO: image upload endpoint not in productApi yet
    console.log('TODO: image upload endpoint not in productApi yet', files)
  }

  const handleDeleteImage = async (imageUrl: string) => {
    // TODO: image delete endpoint not in productApi yet
    console.log('TODO: image delete endpoint not in productApi yet', imageUrl)
  }

  const handleSetPrimaryImage = async (imageUrl: string) => {
    // TODO: set primary image endpoint not in productApi yet
    console.log(
      'TODO: set primary image endpoint not in productApi yet',
      imageUrl
    )
  }

  // HISTORY TAB HANDLERS

  const handleLoadMoreHistory = async () => {
    // Handled inside HistoryTab via useGetProductHistoryQuery directly
  }

  // GUARD - product not found

  if (!isLoading && !product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-secondary">{t('product.notFound')}</p>
      </div>
    )
  }

  // RENDER TAB CONTENT

  const renderTabContent = () => {
    if (isLoading || !product) {
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

  // RENDER

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header with Tabs */}
      <ProductDetailHeader
        productId={productId}
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
