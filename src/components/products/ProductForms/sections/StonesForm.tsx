// FILE: src/components/products/ProductForm/sections/StonesSection.tsx
// Step 3: Stones & Diamonds Management

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { FormSectionProps, StoneFormData } from '../ProductForm.types'

export const StonesSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const [expandedStones, setExpandedStones] = useState<Set<number>>(
    new Set([0])
  )

  const stones = (data.stones || []) as StoneFormData[]

  const stoneTypes = [
    { value: 'diamond', label: t('product.stoneTypes.diamond') },
    { value: 'ruby', label: t('product.stoneTypes.ruby') },
    { value: 'emerald', label: t('product.stoneTypes.emerald') },
    { value: 'sapphire', label: t('product.stoneTypes.sapphire') },
    { value: 'pearl', label: t('product.stoneTypes.pearl') },
    { value: 'topaz', label: t('product.stoneTypes.topaz') },
    { value: 'amethyst', label: t('product.stoneTypes.amethyst') },
    { value: 'garnet', label: t('product.stoneTypes.garnet') },
    { value: 'other', label: t('product.stoneTypes.other') },
  ]

  const stoneQualities = [
    { value: 'VS', label: 'VS' },
    { value: 'VVS', label: 'VVS' },
    { value: 'SI', label: 'SI' },
    { value: 'IF', label: 'IF' },
    { value: 'FL', label: 'FL' },
    { value: 'A', label: 'A' },
    { value: 'AA', label: 'AA' },
    { value: 'AAA', label: 'AAA' },
  ]

  const stoneShapes = [
    { value: 'round', label: t('product.stoneShapes.round') },
    { value: 'oval', label: t('product.stoneShapes.oval') },
    { value: 'square', label: t('product.stoneShapes.square') },
    { value: 'pear', label: t('product.stoneShapes.pear') },
    { value: 'heart', label: t('product.stoneShapes.heart') },
  ]

  const stoneCuts = [
    { value: 'excellent', label: t('product.stoneCuts.excellent') },
    { value: 'very_good', label: t('product.stoneCuts.veryGood') },
    { value: 'good', label: t('product.stoneCuts.good') },
    { value: 'fair', label: t('product.stoneCuts.fair') },
  ]

  const handleAddStone = () => {
    const newStones = [
      ...stones,
      {
        stoneType: 'diamond',
        pieceCount: 1,
        stonePrice: 0,
        totalStonePrice: 0,
      } as StoneFormData,
    ]
    onChange('stones', newStones)
    setExpandedStones(new Set([...expandedStones, stones.length]))
  }

  const handleRemoveStone = (index: number) => {
    const newStones = stones.filter((_, i) => i !== index)
    onChange('stones', newStones)

    const newExpanded = new Set(expandedStones)
    newExpanded.delete(index)
    setExpandedStones(newExpanded)
  }

  const handleStoneChange = (index: number, field: string, value: any) => {
    const newStones = [...stones]
    newStones[index] = {
      ...newStones[index],
      [field]: value,
    }

    // Auto-calculate total price
    const pieceCount = parseFloat(newStones[index].pieceCount as any) || 0
    const stonePrice = parseFloat(newStones[index].stonePrice as any) || 0
    newStones[index].totalStonePrice = pieceCount * stonePrice

    onChange('stones', newStones)
  }

  const toggleStone = (index: number) => {
    const newExpanded = new Set(expandedStones)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedStones(newExpanded)
  }

  // Calculate totals
  const totalStones = stones.length
  const totalPieces = stones.reduce((sum, s) => sum + (s.pieceCount || 0), 0)
  const totalValue = stones.reduce(
    (sum, s) => sum + (s.totalStonePrice || 0),
    0
  )

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between rounded-md border border-border-primary bg-bg-tertiary p-4">
        <div className="space-y-1">
          <p className="text-sm text-text-secondary">
            {t('product.totalStones')}
          </p>
          <p className="text-2xl font-bold text-text-primary">{totalStones}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-text-secondary">
            {t('product.totalPieces')}
          </p>
          <p className="text-2xl font-bold text-text-primary">{totalPieces}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-text-secondary">
            {t('product.totalValue')}
          </p>
          <p className="text-2xl font-bold text-accent">
            ₹{totalValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Add Stone Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddStone}
        disabled={disabled}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        {t('product.addStone')}
      </Button>

      {/* Stones List */}
      <div className="space-y-4">
        {stones.map((stone, index) => (
          <Card key={index} className="border-border-primary bg-bg-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base text-text-primary">
                {t('product.stoneNumber', { number: index + 1 })}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleStone(index)}
                  className="h-8 w-8"
                >
                  {expandedStones.has(index) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveStone(index)}
                  disabled={disabled}
                  className="hover:bg-status-error/10 h-8 w-8 text-status-error"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {expandedStones.has(index) && (
              <CardContent className="space-y-4 pt-4">
                {/* Stone Type & Name */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormSelect
                    name={`stones.${index}.stoneType`}
                    label={t('product.stoneType')}
                    value={stone.stoneType}
                    onChange={(_, value) =>
                      handleStoneChange(index, 'stoneType', value)
                    }
                    required={true}
                    disabled={disabled}
                    options={stoneTypes}
                  />

                  <FormInput
                    name={`stones.${index}.stoneName`}
                    label={t('product.stoneName')}
                    value={stone.stoneName || ''}
                    onChange={(_, value) =>
                      handleStoneChange(index, 'stoneName', value)
                    }
                    placeholder={t('product.stoneNamePlaceholder')}
                    disabled={disabled}
                  />
                </div>

                {/* Quality & Shape */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormSelect
                    name={`stones.${index}.stoneQuality`}
                    label={t('product.quality')}
                    value={stone.stoneQuality || ''}
                    onChange={(_, value) =>
                      handleStoneChange(index, 'stoneQuality', value)
                    }
                    disabled={disabled}
                    options={stoneQualities}
                  />

                  <FormSelect
                    name={`stones.${index}.stoneShape`}
                    label={t('product.shape')}
                    value={stone.stoneShape || ''}
                    onChange={(_, value) =>
                      handleStoneChange(index, 'stoneShape', value)
                    }
                    disabled={disabled}
                    options={stoneShapes}
                  />
                </div>

                {/* Color & Cut */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    name={`stones.${index}.stoneColor`}
                    label={t('product.color')}
                    value={stone.stoneColor || ''}
                    onChange={(_, value) =>
                      handleStoneChange(index, 'stoneColor', value)
                    }
                    placeholder="D, E, F..."
                    disabled={disabled}
                  />

                  <FormSelect
                    name={`stones.${index}.stoneCut`}
                    label={t('product.cut')}
                    value={stone.stoneCut || ''}
                    onChange={(_, value) =>
                      handleStoneChange(index, 'stoneCut', value)
                    }
                    disabled={disabled}
                    options={stoneCuts}
                  />
                </div>

                {/* Carat & Stone Weight */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    name={`stones.${index}.caratWeight`}
                    label={t('product.caratWeight')}
                    type="number"
                    value={stone.caratWeight || ''}
                    onChange={(_, value) =>
                      handleStoneChange(index, 'caratWeight', value)
                    }
                    placeholder="0.50"
                    disabled={disabled}
                  />

                  <FormInput
                    name={`stones.${index}.stoneWeight`}
                    label={t('product.stoneWeight')}
                    type="number"
                    value={stone.stoneWeight || ''}
                    onChange={(_, value) =>
                      handleStoneChange(index, 'stoneWeight', value)
                    }
                    placeholder="0.10"
                    disabled={disabled}
                  />
                </div>

                {/* Piece Count & Price */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    name={`stones.${index}.pieceCount`}
                    label={t('product.pieceCount')}
                    type="number"
                    value={stone.pieceCount}
                    onChange={(_, value) =>
                      handleStoneChange(index, 'pieceCount', value)
                    }
                    required={true}
                    disabled={disabled}
                  />

                  <FormInput
                    name={`stones.${index}.stonePrice`}
                    label={t('product.pricePerPiece')}
                    type="number"
                    value={stone.stonePrice}
                    onChange={(_, value) =>
                      handleStoneChange(index, 'stonePrice', value)
                    }
                    required={true}
                    disabled={disabled}
                  />
                </div>

                {/* Total Price (Read-only) */}
                <FormInput
                  name={`stones.${index}.totalStonePrice`}
                  label={t('product.totalStonePrice')}
                  type="number"
                  value={stone.totalStonePrice}
                  onChange={() => {}}
                  disabled={true}
                  className="bg-bg-tertiary"
                />
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {stones.length === 0 && (
        <div className="rounded-md border border-dashed border-border-primary p-8 text-center">
          <p className="text-text-secondary">{t('product.noStonesAdded')}</p>
        </div>
      )}
    </div>
  )
}
