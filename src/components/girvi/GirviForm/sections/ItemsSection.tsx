// FILE: src/components/girvi/GirviForm/sections/ItemsSection.tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, ChevronDown, ChevronUp, Scale } from 'lucide-react'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { GirviFormSectionProps, GirviItemFormData } from '../GirviForm.types'
import { recalcItem, createBlankItem } from '../GirviForm.utils'

const ITEM_TYPES = [
  { value: 'gold',     label: 'Gold'     },
  { value: 'silver',   label: 'Silver'   },
  { value: 'diamond',  label: 'Diamond'  },
  { value: 'platinum', label: 'Platinum' },
  { value: 'other',    label: 'Other'    },
]

const CONDITIONS = [
  { value: 'good', label: 'Good', color: 'text-status-success' },
  { value: 'fair', label: 'Fair', color: 'text-status-warning' },
  { value: 'poor', label: 'Poor', color: 'text-status-error'   },
]

// ── ItemRow ────────────────────────────────────────────────────────────────────

interface ItemRowProps {
  item: GirviItemFormData
  index: number
  errors: Record<string, string>
  onChange: (index: number, field: keyof GirviItemFormData, value: any) => void
  onRemove: (index: number) => void
  disabled: boolean
  canRemove: boolean
  mode?: 'create' | 'edit' | 'view'
}

const ItemRow = ({ item, index, errors, onChange, onRemove, disabled, canRemove, mode }: ItemRowProps) => {
  const { t }        = useTranslation()
  const [expanded, setExpanded] = useState(index === 0)

  const prefix = `items[${index}]`
  const err    = (field: string) => errors[`${prefix}.${field}`] || errors[`items.${index}.${field}`]

  const handleFieldChange = (field: keyof GirviItemFormData, value: any) => {
    onChange(index, field, value)
  }

  return (
    <div className={`rounded-lg border-2 transition-all ${
      expanded ? 'border-accent/30 bg-accent/5' : 'border-border-primary bg-bg-secondary'
    }`}>

      {/* ── Accordion Header ── */}
      <div
        className="flex cursor-pointer items-center justify-between p-3 sm:p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
            {index + 1}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-text-primary">
              {item.itemName || t('girvi.newItem')}
            </p>
            <p className="truncate text-xs text-text-tertiary">
              {item.itemType && ITEM_TYPES.find(t => t.value === item.itemType)?.label}
              {item.grossWeight ? ` · ${item.grossWeight}g` : ''}
              {item.finalValue  ? ` · ₹${Number(item.finalValue).toLocaleString('en-IN')}` : ''}
            </p>
          </div>
        </div>

        <div className="ml-2 flex flex-shrink-0 items-center gap-1 sm:gap-2">
          {canRemove && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={e => { e.stopPropagation(); onRemove(index) }}
              className="h-8 w-8 text-status-error hover:bg-status-error/10 hover:text-status-error sm:h-10 sm:w-10"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {expanded
            ? <ChevronUp   className="h-5 w-5 text-text-tertiary" />
            : <ChevronDown className="h-5 w-5 text-text-tertiary" />
          }
        </div>
      </div>

      {/* ── Expanded Body ── */}
      {expanded && (
        <div className="space-y-4 border-t border-border-primary px-3 pb-4 pt-4 sm:px-4">

          {/* Item Name + Type
               Mobile  : stacked (1 col)
               sm+     : side by side (2 col)
          */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`itemName-${index}`}>
                {t('girvi.itemName')} <span className="text-status-error">*</span>
              </Label>
              <Input
                id={`itemName-${index}`}
                type="text"
                value={item.itemName}
                onChange={e => handleFieldChange('itemName', e.target.value)}
                disabled={disabled}
                placeholder={t('girvi.itemNamePlaceholder')}
                maxLength={200}
                className={err('itemName') ? 'border-status-error' : ''}
              />
              {err('itemName') && <p className="text-xs text-status-error">{err('itemName')}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`itemType-${index}`}>
                {t('girvi.itemType1')} <span className="text-status-error">*</span>
              </Label>
              <Select
                value={item.itemType}
                onValueChange={val => handleFieldChange('itemType', val)}
                disabled={disabled}
              >
                <SelectTrigger id={`itemType-${index}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quantity + Description
               Mobile  : stacked (1 col)
               sm+     : qty takes 1, description takes 2
          */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor={`quantity-${index}`}>{t('girvi.quantity')}</Label>
<Input
  id={`quantity-${index}`}
  type="number"
  value={item.quantity === 1 ? '' : item.quantity}
  min={1}
  onChange={e => handleFieldChange('quantity', parseInt(e.target.value) || 1)}
  disabled={disabled || mode === 'edit'}
placeholder="Qty"
/>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor={`description-${index}`}>{t('girvi.description')}</Label>
              <Input
                id={`description-${index}`}
                type="text"
                value={item.description || ''}
                onChange={e => handleFieldChange('description', e.target.value)}
                disabled={disabled}
                placeholder={t('girvi.descriptionPlaceholder')}
                maxLength={500}
              />
            </div>
          </div>

          {/* ── Weight Details ──
               Mobile  : 1 col stacked
               sm+     : 3 col
          */}
          <div className="rounded-lg bg-bg-tertiary p-3 sm:p-4">
            <div className="mb-3 flex items-center gap-2">
              <Scale className="h-4 w-4 text-text-secondary" />
              <span className="text-sm font-semibold text-text-primary">{t('girvi.weightDetails')}</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Gross Weight */}
              <div className="space-y-1.5">
                <Label htmlFor={`grossWeight-${index}`} className="text-xs">
                  {t('girvi.grossWeight')} (g) <span className="text-status-error">*</span>
                </Label>
                <Input
                  id={`grossWeight-${index}`}
                  type="number"
                  value={item.grossWeight}
                  min={0}
                  step={0.001}
                  onChange={e => handleFieldChange('grossWeight', e.target.value === '' ? '' : Number(e.target.value))}
                    disabled={disabled || mode === 'edit'}
                  placeholder="0.000"
                  className={err('grossWeight') ? 'border-status-error' : ''}
                />
                {err('grossWeight') && <p className="text-xs text-status-error">{err('grossWeight')}</p>}
              </div>

              {/* Less Weight */}
              <div className="space-y-1.5">
                <Label htmlFor={`lessWeight-${index}`} className="text-xs">{t('girvi.lessWeight')} (g)</Label>
                <Input
                  id={`lessWeight-${index}`}
                  type="number"
                  value={item.lessWeight}
                  min={0}
                  step={0.001}
                  onChange={e => handleFieldChange('lessWeight', e.target.value === '' ? 0 : Number(e.target.value))}
                  disabled={disabled || mode === 'edit'}
                  placeholder="0.000"
                />
              </div>

              {/* Net Weight (read-only) */}
              <div className="space-y-1.5">
                <Label className="text-xs">{t('girvi.netWeight')} (g)</Label>
                <div className="flex h-10 items-center rounded-md border border-border-secondary bg-bg-primary px-3 font-semibold text-accent">
                  {(item.netWeight ?? 0).toFixed(3)}
                </div>
              </div>
            </div>
          </div>

          {/* ── Purity & Value ──
               Mobile  : 2 col
               sm+     : 4 col
          */}
          <div className="rounded-lg bg-bg-tertiary p-3 sm:p-4">
            <p className="mb-3 text-sm font-semibold text-text-primary">{t('girvi.purityValue')}</p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* Tunch */}
              <div className="space-y-1.5">
                <Label htmlFor={`tunch-${index}`} className="text-xs">{t('girvi.tunch')} (%)</Label>
                <Input
                  id={`tunch-${index}`}
                  type="number"
                  value={item.tunch ?? ''}
                  min={0}
                  max={100}
                  step={0.1}
                  onChange={e => handleFieldChange('tunch', e.target.value === '' ? undefined : Number(e.target.value))}
                  disabled={disabled}
                  placeholder="91.6"
                />
              </div>

              {/* Purity */}
              <div className="space-y-1.5">
                <Label htmlFor={`purity-${index}`} className="text-xs">{t('girvi.purity')}</Label>
                <Input
                  id={`purity-${index}`}
                  type="text"
                  value={item.purity || ''}
                  onChange={e => handleFieldChange('purity', e.target.value)}
                  disabled={disabled}
                  placeholder="22K"
                  maxLength={20}
                />
              </div>

              {/* Rate Per Gram */}
              <div className="space-y-1.5">
                <Label htmlFor={`ratePerGram-${index}`} className="text-xs">{t('girvi.ratePerGram')} (₹)</Label>
                <Input
                  id={`ratePerGram-${index}`}
                  type="number"
                  value={item.ratePerGram ?? ''}
                  min={0}
                  step={1}
                  onChange={e => handleFieldChange('ratePerGram', e.target.value === '' ? undefined : Number(e.target.value))}
                  disabled={disabled}
                  placeholder="6500"
                />
              </div>

              {/* Approx Value (read-only) */}
              <div className="space-y-1.5">
                <Label className="text-xs">{t('girvi.approxValue')} (₹)</Label>
                <div className="flex h-10 items-center rounded-md border border-border-secondary bg-bg-primary px-3 text-sm font-semibold text-status-success">
                  {item.approxValue != null
                    ? `₹${item.approxValue.toLocaleString('en-IN')}`
                    : '—'
                  }
                </div>
              </div>
            </div>

            {/* User Given Value — full width */}
            <div className="mt-3 space-y-1.5">
              <Label htmlFor={`userGivenValue-${index}`} className="text-xs">
                {t('girvi.userGivenValue')} (₹){' '}
                <span className="text-text-tertiary">{t('girvi.overrideHint')}</span>
              </Label>
              <Input
                id={`userGivenValue-${index}`}
                type="number"
                value={item.userGivenValue ?? ''}
                min={0}
                step={1}
                onChange={e => handleFieldChange('userGivenValue', e.target.value)}
                disabled={disabled}
                placeholder={t('girvi.overridePlaceholder')}
              />
            </div>

            {/* Final Value badge */}
            {item.finalValue !== undefined && item.finalValue > 0 && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-accent/10 px-3 py-2 sm:px-4">
                <span className="text-sm font-medium text-text-primary">{t('girvi.finalValue')}</span>
                <span className="text-base font-bold text-accent sm:text-lg">
                  ₹{item.finalValue.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* ── Condition ── */}
          <div className="space-y-1.5">
            <Label>{t('girvi.condition')}</Label>
            <div className="flex gap-2 sm:gap-3">
              {CONDITIONS.map(c => (
                <label
                  key={c.value}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 py-2 text-xs font-medium transition-all sm:py-2.5 sm:text-sm ${
                    item.condition === c.value
                      ? `border-accent bg-accent/10 ${c.color}`
                      : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                  } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <input
                    type="radio"
                    name={`condition-${index}`}
                    value={c.value}
                    checked={item.condition === c.value}
                    onChange={() => handleFieldChange('condition', c.value)}
                    disabled={disabled}
                    className="sr-only"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

// ── ItemsSection ───────────────────────────────────────────────────────────────
export const ItemsSection = ({
  data, errors, onChange, onBlur, disabled = false, mode,
}: GirviFormSectionProps) => {
  const { t } = useTranslation()
  const items: GirviItemFormData[] = data.items || []

  const handleItemChange = (index: number, field: keyof GirviItemFormData, value: any) => {
    const updated = [...items]
    updated[index] = recalcItem({ ...updated[index], [field]: value })
    onChange('items', updated)
  }

  const handleAddItem    = () => onChange('items', [...items, createBlankItem()])
  const handleRemoveItem = (index: number) => onChange('items', items.filter((_, i) => i !== index))

  const totalGross = items.reduce((s, i) => s + parseFloat(String(i.grossWeight || 0)), 0)
  const totalNet   = items.reduce((s, i) => s + (i.netWeight  ?? 0), 0)
  const totalValue = items.reduce((s, i) => s + (i.finalValue ?? 0), 0)

  return (
    <div className="space-y-4">

{items.map((item, index) => (
  <ItemRow
    key={index}
    item={item}
    index={index}
    errors={errors}
    onChange={handleItemChange}
    onRemove={handleRemoveItem}
    disabled={disabled}
    canRemove={items.length > 1}
    mode={mode}
  />
))}
      {/* Add Item button */}
      {!disabled && (
        <button
          type="button"
          onClick={handleAddItem}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-accent/40 py-3 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent/5"
        >
          <Plus className="h-4 w-4" />
          {t('girvi.addItem')}
        </button>
      )}

      {errors.items && (
        <p className="text-sm text-status-error">{errors.items}</p>
      )}

      {/* ── Totals Summary ──
           Always 3 col — text shrinks on mobile
      ── */}
      {items.length > 0 && totalGross > 0 && (
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-bg-tertiary p-3 sm:gap-3 sm:p-4">
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girvi.totalGrossWeight')}</p>
            <p className="text-sm font-bold text-text-primary sm:text-base">{totalGross.toFixed(3)}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girvi.totalNetWeight')}</p>
            <p className="text-sm font-bold text-text-primary sm:text-base">{totalNet.toFixed(3)}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girvi.totalApproxValue')}</p>
            <p className="text-sm font-bold text-accent sm:text-base">
              ₹{totalValue.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      )}

    </div>
  )
}