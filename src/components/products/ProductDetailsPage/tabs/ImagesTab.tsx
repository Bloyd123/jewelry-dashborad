
// FILE: src/components/products/ProductDetailsPage/tabs/ImagesTab.tsx
// Product Images Tab - Accordion-based Layout

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Star,
  Grid,
  List,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/layout/Accordion/Accordion'
import type { Product } from '@/types/product.types'

// COMPONENT PROPS

interface ImagesTabProps {
  product: Product
  loading?: boolean
  onUploadImage?: (files: FileList) => void
  onDeleteImage?: (imageUrl: string) => void
  onSetPrimaryImage?: (imageUrl: string) => void
}

// IMAGES TAB COMPONENT

export const ImagesTab: React.FC<ImagesTabProps> = ({
  product,
  loading = false,
  onUploadImage,
  onDeleteImage,
  onSetPrimaryImage,
}) => {
  const { t } = useTranslation()
  const [selectedImage, setSelectedImage] = useState<string | null>(
    product.primaryImage || null
  )
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && onUploadImage) {
      onUploadImage(files)
    }
  }

  const totalImages = product.images?.length || 0
  const hasPrimaryImage = product.images?.some(img => img.isPrimary) || false

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg bg-bg-tertiary"
          />
        ))}
      </div>
    )
  }


  // IMAGE STATISTICS SECTION


  const ImageStatisticsSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Images */}
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <ImageIcon className="h-3 w-3" />
            {t('product.productDetail.images.totalImages')}
          </p>
          <p className="mt-2 text-3xl font-bold text-text-primary">
            {totalImages}
          </p>
        </div>

        {/* Primary Image Status */}
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <Star className="h-3 w-3" />
            {t('product.productDetail.images.primaryImage')}
          </p>
          <div className="mt-2">
            <Badge variant={hasPrimaryImage ? 'success' : 'warning'} size="md">
              {hasPrimaryImage
                ? t('product.common.yes')
                : t('product.common.no')}
            </Badge>
          </div>
        </div>

        {/* Gallery Status */}
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <Grid className="h-3 w-3" />
            {t('product.productDetail.images.gallery')}
          </p>
          <div className="mt-2">
            <Badge variant="info" size="md">
              Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="border-t border-border-secondary pt-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-text-secondary">
            {t('product.productDetail.images.uploadImages')}
          </Label>
          {onUploadImage && (
            <label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button variant="default" size="sm" className="gap-2" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  {t('product.productDetail.images.uploadImages')}
                </span>
              </Button>
            </label>
          )}
        </div>
        <p className="mt-2 text-xs text-text-tertiary">
          {t('product.productDetail.images.uploadInfo')}
        </p>
      </div>
    </div>
  )


  // IMAGE GALLERY SECTION


  const ImageGallerySection = () => {
    if (!product.images || product.images.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <ImageIcon className="mb-4 h-16 w-16 text-text-tertiary" />
          <p className="mb-2 text-lg font-medium text-text-primary">
            {t('product.productDetail.images.noImages')}
          </p>
          <p className="mb-6 text-sm text-text-tertiary">
            {t('product.productDetail.images.uploadImagesPrompt')}
          </p>
          {onUploadImage && (
            <label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button variant="default" className="gap-2" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  {t('product.productDetail.images.uploadFirst')}
                </span>
              </Button>
            </label>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4 p-4">
        {/* View Mode Toggle */}
        <div className="flex items-center justify-between border-b border-border-secondary pb-3">
          <Label className="text-xs text-text-secondary">
            {t('product.productDetail.images.allImages')} (
            {product.images.length})
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="gap-2"
          >
            {viewMode === 'grid' ? (
              <>
                <List className="h-4 w-4" />
                List View
              </>
            ) : (
              <>
                <Grid className="h-4 w-4" />
                Grid View
              </>
            )}
          </Button>
        </div>

        {viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === image.url
                    ? 'border-accent'
                    : 'hover:border-accent/50 border-border-primary'
                }`}
                onClick={() => setSelectedImage(image.url)}
              >
                {/* Image */}
                <img
                  src={image.url}
                  alt={image.caption || `${product.name} - ${index + 1}`}
                  className="h-40 w-full object-cover"
                />

                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute left-2 top-2">
                    <Badge variant="success" size="sm" className="gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Primary
                    </Badge>
                  </div>
                )}

                {/* Action Buttons Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  {!image.isPrimary && onSetPrimaryImage && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={e => {
                        e.stopPropagation()
                        onSetPrimaryImage(image.url)
                      }}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  {onDeleteImage && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={e => {
                        e.stopPropagation()
                        if (
                          confirm(
                            t('product.productDetail.images.confirmDelete')
                          )
                        ) {
                          onDeleteImage(image.url)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Caption */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="truncate text-xs text-white">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                  selectedImage === image.url
                    ? 'bg-accent/10 border-accent'
                    : 'hover:border-accent/50 border-border-primary'
                }`}
                onClick={() => setSelectedImage(image.url)}
              >
                {/* Thumbnail */}
                <img
                  src={image.url}
                  alt={image.caption || `${product.name} - ${index + 1}`}
                  className="h-16 w-16 rounded object-cover"
                />

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {image.isPrimary && (
                      <Badge variant="success" size="sm">
                        <Star className="h-3 w-3" />
                      </Badge>
                    )}
                    <span className="text-sm font-medium text-text-primary">
                      Image {index + 1}
                    </span>
                  </div>
                  {image.caption && (
                    <p className="mt-1 text-xs text-text-secondary">
                      {image.caption}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  {!image.isPrimary && onSetPrimaryImage && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={e => {
                        e.stopPropagation()
                        onSetPrimaryImage(image.url)
                      }}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  {onDeleteImage && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-status-error"
                      onClick={e => {
                        e.stopPropagation()
                        if (
                          confirm(
                            t('product.productDetail.images.confirmDelete')
                          )
                        ) {
                          onDeleteImage(image.url)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }


  // IMAGE PREVIEW SECTION

  const ImagePreviewSection = () => {
    if (!selectedImage) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <ImageIcon className="mb-4 h-16 w-16 text-text-tertiary" />
          <p className="text-sm text-text-secondary">
            {t('product.productDetail.images.selectImage')}
          </p>
        </div>
      )
    }

    const selectedImageData = product.images?.find(
      img => img.url === selectedImage
    )

    return (
      <div className="space-y-4 p-4">
        {/* Preview Header */}
        <div className="flex items-center justify-between border-b border-border-secondary pb-3">
          <Badge variant="accent" size="sm">
            {t('product.productDetail.images.preview')}
          </Badge>
          {selectedImage === product.primaryImage && (
            <Badge
              variant="success"
              size="sm"
              icon={<Star className="h-3 w-3" />}
            >
              {t('product.productDetail.images.primary')}
            </Badge>
          )}
        </div>

        {/* Image Preview */}
        <div className="overflow-hidden rounded-lg border border-border-primary bg-bg-tertiary">
          <img
            src={selectedImage}
            alt={product.name}
            className="h-96 w-full object-contain"
          />
        </div>

        {/* Image Caption */}
        {selectedImageData?.caption && (
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <Label className="text-xs text-text-secondary">
              {t('product.productDetail.images.caption')}
            </Label>
            <p className="mt-1 text-sm text-text-primary">
              {selectedImageData.caption}
            </p>
          </div>
        )}
      </div>
    )
  }


  // RENDER MAIN ACCORDION


  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      <Accordion
        type="multiple"
        defaultValue={['statistics', 'gallery', 'preview']}
        variant="separated"
        size="md"
      >
        {/* Image Statistics */}
        <AccordionItem value="statistics">
          <AccordionTrigger
            icon={<ImageIcon className="h-5 w-5" />}
            badge={
              <Badge variant="info" size="sm">
                {totalImages} {totalImages === 1 ? 'Image' : 'Images'}
              </Badge>
            }
          >
            {t('product.productDetail.images.statistics')}
          </AccordionTrigger>
          <AccordionContent>
            <ImageStatisticsSection />
          </AccordionContent>
        </AccordionItem>

        {/* Image Gallery */}
        <AccordionItem value="gallery">
          <AccordionTrigger icon={<Grid className="h-5 w-5" />}>
            {t('product.productDetail.images.gallery')}
          </AccordionTrigger>
          <AccordionContent>
            <ImageGallerySection />
          </AccordionContent>
        </AccordionItem>

        {/* Image Preview */}
        {selectedImage && (
          <AccordionItem value="preview">
            <AccordionTrigger icon={<Star className="h-5 w-5" />}>
              {t('product.productDetail.images.preview')}
            </AccordionTrigger>
            <AccordionContent>
              <ImagePreviewSection />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}

export default ImagesTab
