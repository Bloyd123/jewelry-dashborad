// FILE: src/components/metal-rates/UpdateRatesModal/UpdateRatesModal.tsx
// Complete Update Metal Rates Modal with Sheet

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshCw, X, Save, Eye } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/overlay/Sheet/Sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import { GoldRatesForm } from './GoldRatesForm'
import { SilverRatesForm } from './SilverRatesForm'
import { PlatinumRatesForm } from './PlatinumRatesForm'
import { AdditionalDetailsForm } from './AdditionalDetailsForm'
import { MarketReferenceForm } from './MarketReferenceForm'
import { PreviewChanges } from './PreviewChanges'

// TYPES

interface UpdateRatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shopName?: string
  currentDate?: string
  onSave?: (data: any) => void
}

// COMPONENT

export const UpdateRatesModal: React.FC<UpdateRatesModalProps> = ({
  open,
  onOpenChange,
  shopName = 'Raj Jewellers',
  currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }),
  onSave,
}) => {
  const { t } = useTranslation()
  const [showPreview, setShowPreview] = useState(false)

  // Form states
  const [goldRates, setGoldRates] = useState<any>(null)
  const [silverRates, setSilverRates] = useState<any>(null)
  const [platinumRates, setPlatinumRates] = useState<any>(null)
  const [additionalDetails, setAdditionalDetails] = useState<any>(null)
  const [marketReference, setMarketReference] = useState<any>(null)

  // Preview changes data (dummy)
  const previewChanges = [
    { metal: 'Gold 24K', oldRate: 6450, newRate: 6470 },
    { metal: 'Gold 22K', oldRate: 5910, newRate: 5928 },
    { metal: 'Silver 999', oldRate: 82.5, newRate: 83.0 },
    { metal: 'Platinum', oldRate: 3250, newRate: 3275 },
  ]

  // Handle save
  const handleSave = () => {
    const allData = {
      gold: goldRates,
      silver: silverRates,
      platinum: platinumRates,
      additionalDetails,
      marketReference,
    }

    console.log('Saving rates:', allData)
    onSave?.(allData)
    onOpenChange(false)
  }

  // Handle preview toggle
  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        size="full"
        showHandle={true}
        showClose={true}
        preventOutsideClick={false}
      >
        {/* Header */}
        <SheetHeader>
          <div className="flex items-start gap-3">
            <div className="bg-accent/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <RefreshCw className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl">
                {t('metalRates.updateTodayRates')} - {shopName}
              </SheetTitle>
              <SheetDescription>
                {t('metalRates.date')}: {currentDate}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Body - Scrollable Forms */}
        <SheetBody>
          <div className="space-y-6 pb-6">
            {/* Section 1: Gold Rates */}
            <GoldRatesForm onChange={setGoldRates} />

            <Separator />

            {/* Section 2: Silver Rates */}
            <SilverRatesForm onChange={setSilverRates} />

            <Separator />

            {/* Section 3: Platinum Rates */}
            <PlatinumRatesForm onChange={setPlatinumRates} />

            <Separator />

            {/* Section 4: Additional Details */}
            <AdditionalDetailsForm onChange={setAdditionalDetails} />

            <Separator />

            {/* Section 5: Market Reference (Optional) */}
            <MarketReferenceForm onChange={setMarketReference} />

            <Separator />

            {/* Preview Changes */}
            {showPreview && (
              <>
                <PreviewChanges changes={previewChanges} />
                <Separator />
              </>
            )}
          </div>
        </SheetBody>

        {/* Footer - Action Buttons */}
        <SheetFooter>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            {/* Cancel Button */}
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 gap-2 sm:flex-none"
            >
              <X className="h-4 w-4" />
              {t('common.cancel')}
            </Button>

            {/* Preview Button */}
            <Button
              variant="secondary"
              onClick={togglePreview}
              className="flex-1 gap-2 sm:flex-none"
            >
              <Eye className="h-4 w-4" />
              {showPreview
                ? t('common.hidePreview')
                : t('metalRates.common.preview')}
            </Button>

            {/* Save Button */}
            <Button
              variant="default"
              onClick={handleSave}
              className="flex-1 gap-2"
            >
              <Save className="h-4 w-4" />
              {t('metalRates.saveAndUpdate')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

UpdateRatesModal.displayName = 'UpdateRatesModal'
