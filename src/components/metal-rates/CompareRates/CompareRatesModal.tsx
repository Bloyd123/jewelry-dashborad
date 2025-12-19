// ============================================================================
// FILE: src/components/metalRates/CompareRatesModal/CompareRatesModal.tsx
// Compare Rates Between Dates Modal
// ============================================================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/overlay/Modal'
import { Button } from '@/components/ui/button'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import { Spinner } from '@/components/ui/loader/Spinner'
import type { RateComparisonResult, RateChangeDetail } from '@/types/metalrate.types'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface CompareRatesModalProps {
  isOpen: boolean
  onClose: () => void
  shopId: string
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString('en', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// ============================================================================
// MOCK API FUNCTION (Replace with real API later)
// ============================================================================

const getMockComparisonData = (fromDate: string, toDate: string): RateComparisonResult => {
  const daysDiff = Math.floor(
    (new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  return {
    fromDate,
    toDate,
    daysDifference: daysDiff,
    gold24K: {
      startRate: 7150.0,
      endRate: 7350.0,
      change: 200.0,
      changePercentage: 2.8,
      trend: 'up',
    },
    gold22K: {
      startRate: 6549.4,
      endRate: 6736.67,
      change: 187.27,
      changePercentage: 2.86,
      trend: 'up',
    },
    gold18K: {
      startRate: 5362.5,
      endRate: 5512.5,
      change: 150.0,
      changePercentage: 2.8,
      trend: 'up',
    },
    silver999: {
      startRate: 82.0,
      endRate: 85.0,
      change: 3.0,
      changePercentage: 3.66,
      trend: 'up',
    },
    platinum: {
      startRate: 3250.0,
      endRate: 3350.0,
      change: 100.0,
      changePercentage: 3.08,
      trend: 'up',
    },
    trendComparison: {
      gold: {
        ma7Change: 25.5,
        ma30Change: 100.2,
        ma90Change: 180.8,
      },
      silver: {
        ma7Change: 1.2,
        ma30Change: 2.5,
        ma90Change: 3.8,
      },
    },
  }
}

// TODO: Replace above function with this when integrating real API
/*
const compareRates = async (shopId: string, fromDate: string, toDate: string) => {
  const response = await fetch(
    `/api/v1/shops/${shopId}/metal-rates/compare?fromDate=${fromDate}&toDate=${toDate}`
  )
  const data = await response.json()
  return data.data
}
*/

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CompareRatesModal: React.FC<CompareRatesModalProps> = ({
  isOpen,
  onClose,
  shopId,
}) => {
  const { t } = useTranslation()
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [comparisonData, setComparisonData] = useState<RateComparisonResult | null>(null)

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleDateChange = (name: string, value: string) => {
    if (name === 'fromDate') {
      setFromDate(value)
      setErrors((prev) => ({ ...prev, fromDate: '' }))
    } else {
      setToDate(value)
      setErrors((prev) => ({ ...prev, toDate: '' }))
    }
  }

  const validateDates = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!fromDate) {
      newErrors.fromDate = t('metalRates.compare.errors.fromDateRequired') || 'From date is required'
    }
    if (!toDate) {
      newErrors.toDate = t('metalRates.compare.errors.toDateRequired') || 'To date is required'
    }
    if (fromDate && toDate && new Date(fromDate) >= new Date(toDate)) {
      newErrors.toDate = t('metalRates.compare.errors.toDateAfterFrom') || 'To date must be after from date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCompare = async () => {
    if (!validateDates()) return

    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Using mock data (replace with real API call when ready)
      const data = getMockComparisonData(fromDate, toDate)
      
      // TODO: Uncomment when integrating real API
      // const data = await compareRates(shopId, fromDate, toDate)
      
      setComparisonData(data)
    } catch (error) {
      console.error('Error comparing rates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFromDate('')
    setToDate('')
    setErrors({})
    setComparisonData(null)
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-status-success" />
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-status-error" />
    return <Minus className="h-4 w-4 text-text-tertiary" />
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return 'text-status-success'
    if (trend === 'down') return 'text-status-error'
    return 'text-text-tertiary'
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      size="xl"
      testId="compare-rates-modal"
    >
      {/* Header */}
      <ModalHeader
        title={t('metalRates.compare.title') || 'Compare Rates Between Dates'}
        description={t('metalRates.compare.description') || 'Compare metal rates between two dates to analyze price trends'}
      />

      {/* Body */}
      <ModalBody className="space-y-6 max-h-[60vh] overflow-y-auto">
        {/* Date Selection Card */}
        <div className="bg-bg-tertiary rounded-lg p-4 border border-border-primary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Date */}
            <FormDatePicker
              name="fromDate"
              label={t('metalRates.compare.fromDate') || 'From Date'}
              value={fromDate}
              onChange={handleDateChange}
              error={errors.fromDate}
              placeholder={t('metalRates.compare.selectFromDate') || 'Select from date'}
              required
              maxDate={toDate ? new Date(toDate) : new Date()}
            />

            {/* To Date */}
            <FormDatePicker
              name="toDate"
              label={t('metalRates.compare.toDate') || 'To Date'}
              value={toDate}
              onChange={handleDateChange}
              error={errors.toDate}
              placeholder={t('metalRates.compare.selectToDate') || 'Select to date'}
              required
              minDate={fromDate ? new Date(fromDate) : undefined}
              maxDate={new Date()}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={handleCompare}
              disabled={isLoading || !fromDate || !toDate}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  {t('metalRates.compare.comparing') || 'Comparing...'}
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  {t('metalRates.compare.compareButton') || 'Compare Rates'}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              {t('common.reset') || 'Reset'}
            </Button>
          </div>
        </div>

        {/* Comparison Results */}
        {comparisonData && (
          <div className="space-y-4">
            {/* Summary Card */}
            <div className="bg-bg-tertiary rounded-lg p-4 border border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                {t('metalRates.compare.summary') || 'Comparison Summary'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-text-tertiary">{t('metalRates.compare.fromDate') || 'From Date'}</p>
                  <p className="text-text-primary font-medium">
                    {formatDate(comparisonData.fromDate)}
                  </p>
                </div>
                <div>
                  <p className="text-text-tertiary">{t('metalRates.compare.toDate') || 'To Date'}</p>
                  <p className="text-text-primary font-medium">
                    {formatDate(comparisonData.toDate)}
                  </p>
                </div>
                <div>
                  <p className="text-text-tertiary">{t('metalRates.compare.daysDifference') || 'Days'}</p>
                  <p className="text-text-primary font-medium">
                    {comparisonData.daysDifference} {t('common.days') || 'days'}
                  </p>
                </div>
              </div>
            </div>

            {/* Gold Rates Comparison */}
            <div className="bg-bg-tertiary rounded-lg p-4 border border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                <span className="text-yellow-500">●</span>
                {t('metalRates.metals.gold') || 'Gold'}
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'gold24K', label: '24K' },
                  { key: 'gold22K', label: '22K' },
                  { key: 'gold18K', label: '18K' },
                ].map(({ key, label }) => {
                  const data = comparisonData[key as keyof RateComparisonResult] as RateChangeDetail
                  return (
                    <div key={key} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-bg-secondary rounded-lg">
                      <div>
                        <p className="text-xs text-text-tertiary">{t('metalRates.puritytext') || 'Purity'}</p>
                        <p className="text-text-primary font-medium">{label}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary">{t('metalRates.compare.startRate') || 'Start Rate'}</p>
                        <p className="text-text-primary">{formatCurrency(data.startRate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary">{t('metalRates.compare.endRate') || 'End Rate'}</p>
                        <p className="text-text-primary">{formatCurrency(data.endRate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary">{t('metalRates.compare.change') || 'Change'}</p>
                        <div className={`flex items-center gap-2 font-semibold ${getTrendColor(data.trend)}`}>
                          {getTrendIcon(data.trend)}
                          <span>
                            {formatCurrency(Math.abs(data.change))} ({Math.abs(data.changePercentage).toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Silver Rates Comparison */}
            <div className="bg-bg-tertiary rounded-lg p-4 border border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                <span className="text-gray-400">●</span>
                {t('metalRates.metals.silver') || 'Silver'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-bg-secondary rounded-lg">
                <div>
                  <p className="text-xs text-text-tertiary">{t('metalRates.puritytext') || 'Purity'}</p>
                  <p className="text-text-primary font-medium">999 (Pure)</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">{t('metalRates.compare.startRate') || 'Start Rate'}</p>
                  <p className="text-text-primary">{formatCurrency(comparisonData.silver999.startRate)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">{t('metalRates.compare.endRate') || 'End Rate'}</p>
                  <p className="text-text-primary">{formatCurrency(comparisonData.silver999.endRate)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">{t('metalRates.compare.change') || 'Change'}</p>
                  <div className={`flex items-center gap-2 font-semibold ${getTrendColor(comparisonData.silver999.trend)}`}>
                    {getTrendIcon(comparisonData.silver999.trend)}
                    <span>
                      {formatCurrency(Math.abs(comparisonData.silver999.change))} (
                      {Math.abs(comparisonData.silver999.changePercentage).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platinum Rates Comparison */}
            <div className="bg-bg-tertiary rounded-lg p-4 border border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                <span className="text-slate-300">●</span>
                {t('metalRates.metals.platinum') || 'Platinum'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-bg-secondary rounded-lg">
                <div>
                  <p className="text-xs text-text-tertiary">{t('metalRates.puritytext') || 'Purity'}</p>
                  <p className="text-text-primary font-medium">950</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">{t('metalRates.compare.startRate') || 'Start Rate'}</p>
                  <p className="text-text-primary">{formatCurrency(comparisonData.platinum.startRate)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">{t('metalRates.compare.endRate') || 'End Rate'}</p>
                  <p className="text-text-primary">{formatCurrency(comparisonData.platinum.endRate)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">{t('metalRates.compare.change') || 'Change'}</p>
                  <div className={`flex items-center gap-2 font-semibold ${getTrendColor(comparisonData.platinum.trend)}`}>
                    {getTrendIcon(comparisonData.platinum.trend)}
                    <span>
                      {formatCurrency(Math.abs(comparisonData.platinum.change))} (
                      {Math.abs(comparisonData.platinum.changePercentage).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalBody>

      {/* Footer */}
      <ModalFooter align="right">
        <Button variant="outline" onClick={onClose}>
          {t('common.close') || 'Close'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}