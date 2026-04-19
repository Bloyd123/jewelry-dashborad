// FILE: src/components/girvi/GirviForm/sections/ItemsSection.tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, ChevronDown, ChevronUp, Scale } from 'lucide-react'
import type { GirviFormSectionProps, GirviItemFormData } from '../GirviForm.types'
import { recalcItem, createBlankItem } from '../GirviForm.utils'

const ITEM_TYPES = [
  { value: 'gold',     label: 'Gold',     color: 'text-amber-600' },
  { value: 'silver',   label: 'Silver',   color: 'text-gray-500'  },
  { value: 'diamond',  label: 'Diamond',  color: 'text-blue-500'  },
  { value: 'platinum', label: 'Platinum', color: 'text-gray-400'  },
  { value: 'other',    label: 'Other',    color: 'text-text-secondary' },
]

const CONDITIONS = [
  { value: 'good', label: 'Good',  color: 'text-status-success' },
  { value: 'fair', label: 'Fair',  color: 'text-status-warning' },
  { value: 'poor', label: 'Poor',  color: 'text-status-error'   },
]


interface ItemRowProps {
  item: GirviItemFormData
  index: number
  errors: Record<string, string>
  onChange: (index: number, field: keyof GirviItemFormData, value: any) => void
  onRemove: (index: number) => void
  disabled: boolean
  canRemove: boolean
}

const ItemRow = ({ item, index, errors, onChange, onRemove, disabled, canRemove }: ItemRowProps) => {
  const { t } = useTranslation()
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
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
            {index + 1}
          </div>
          <div>
            <p className="font-semibold text-text-primary">
              {item.itemName || t('girvi.newItem')}
            </p>
            <p className="text-xs text-text-tertiary">
              {item.itemType && ITEM_TYPES.find(t => t.value === item.itemType)?.label}
              {item.grossWeight ? ` · ${item.grossWeight}g gross` : ''}
              {item.finalValue  ? ` · ₹${Number(item.finalValue).toLocaleString('en-IN')}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canRemove && !disabled && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onRemove(index) }}
              className="rounded-lg p-1.5 text-status-error hover:bg-status-error/10"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          {expanded
            ? <ChevronUp className="h-5 w-5 text-text-tertiary" />
            : <ChevronDown className="h-5 w-5 text-text-tertiary" />
          }
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-border-primary px-4 pb-4 pt-4">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">
                {t('girvi.itemName')} <span className="text-status-error">*</span>
              </label>
              <input
                type="text"
                value={item.itemName}
                onChange={e => handleFieldChange('itemName', e.target.value)}
                disabled={disabled}
                placeholder={t('girvi.itemNamePlaceholder')}
                maxLength={200}
                className={`h-10 w-full rounded-lg border bg-bg-secondary px-4 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary ${
                  err('itemName') ? 'border-status-error' : 'border-border-primary'
                }`}
              />
              {err('itemName') && <p className="text-xs text-status-error">{err('itemName')}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">
                {t('girvi.itemType1')} <span className="text-status-error">*</span>
              </label>
              <select
                value={item.itemType}
                onChange={e => handleFieldChange('itemType', e.target.value)}
                disabled={disabled}
                className="h-10 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
              >
                {ITEM_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">{t('girvi.quantity')}</label>
              <input
                type="number"
                value={item.quantity}
                min={1}
                onChange={e => handleFieldChange('quantity', parseInt(e.target.value) || 1)}
                disabled={disabled}
                className="h-10 w-full rounded-lg border border-border-primary bg-bg-secondary px-4 text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium text-text-primary">{t('girvi.description')}</label>
              <input
                type="text"
                value={item.description || ''}
                onChange={e => handleFieldChange('description', e.target.value)}
                disabled={disabled}
                placeholder={t('girvi.descriptionPlaceholder')}
                maxLength={500}
                className="h-10 w-full rounded-lg border border-border-primary bg-bg-secondary px-4 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
              />
            </div>
          </div>

          <div className="rounded-lg bg-bg-tertiary p-4">
            <div className="mb-3 flex items-center gap-2">
              <Scale className="h-4 w-4 text-text-secondary" />
              <span className="text-sm font-semibold text-text-primary">{t('girvi.weightDetails')}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">
                  {t('girvi.grossWeight')} (g) <span className="text-status-error">*</span>
                </label>
                <input
                  type="number"
                  value={item.grossWeight}
                  min={0}
                  step={0.001}
                  onChange={e =>
  handleFieldChange(
    'grossWeight',
    e.target.value === '' ? '' : Number(e.target.value)
  )
}
                  disabled={disabled}
                  placeholder="0.000"
                  className={`h-10 w-full rounded-lg border bg-bg-secondary px-3 text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary ${
                    err('grossWeight') ? 'border-status-error' : 'border-border-primary'
                  }`}
                />
                {err('grossWeight') && <p className="text-xs text-status-error">{err('grossWeight')}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">{t('girvi.lessWeight')} (g)</label>
                <input
                  type="number"
                  value={item.lessWeight}
                  min={0}
                  step={0.001}
                  onChange={e =>
  handleFieldChange(
    'lessWeight',
    e.target.value === '' ? 0 : Number(e.target.value)
  )
}
                  disabled={disabled}
                  placeholder="0.000"
                  className="h-10 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">{t('girvi.netWeight')} (g)</label>
                <div className="flex h-10 items-center rounded-lg border border-border-secondary bg-bg-primary px-3 font-semibold text-accent">
                  {(item.netWeight ?? 0).toFixed(3)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-bg-tertiary p-4">
            <p className="mb-3 text-sm font-semibold text-text-primary">{t('girvi.purityValue')}</p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">{t('girvi.tunch')} (%)</label>
                <input
                  type="number"
                  value={item.tunch ?? ''}
                  min={0}
                  max={100}
                  step={0.1}
                 onChange={e =>
  handleFieldChange(
    'tunch',
    e.target.value === '' ? undefined : Number(e.target.value)
  )
}
                  disabled={disabled}
                  placeholder="91.6"
                  className="h-10 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">{t('girvi.purity')}</label>
                <input
                  type="text"
                  value={item.purity || ''}
                  onChange={e => handleFieldChange('purity', e.target.value)}
                  disabled={disabled}
                  placeholder="22K"
                  maxLength={20}
                  className="h-10 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">{t('girvi.ratePerGram')} (₹)</label>
                <input
                  type="number"
                  value={item.ratePerGram ?? ''}
                  min={0}
                  step={1}
                  onChange={e =>
  handleFieldChange(
    'ratePerGram',
    e.target.value === '' ? undefined : Number(e.target.value)
  )
}
                  disabled={disabled}
                  placeholder="6500"
                  className="h-10 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">{t('girvi.approxValue')} (₹)</label>
                <div className="flex h-10 items-center rounded-lg border border-border-secondary bg-bg-primary px-3 text-sm font-semibold text-status-success">
                  {item.approxValue != null
                    ? `₹${item.approxValue.toLocaleString('en-IN')}`
                    : '—'
                  }
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <label className="text-xs font-medium text-text-secondary">
                {t('girvi.userGivenValue')} (₹){' '}
                <span className="text-text-tertiary">{t('girvi.overrideHint')}</span>
              </label>
              <input
                type="number"
                value={item.userGivenValue ?? ''}
                min={0}
                step={1}
                onChange={e => handleFieldChange('userGivenValue', e.target.value)}
                disabled={disabled}
                placeholder={t('girvi.overridePlaceholder')}
                className="h-10 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
              />
            </div>

            {(item.finalValue !== undefined && item.finalValue > 0) && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-accent/10 px-4 py-2">
                <span className="text-sm font-medium text-text-primary">{t('girvi.finalValue')}</span>
                <span className="text-lg font-bold text-accent">
                  ₹{item.finalValue.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">{t('girvi.condition')}</label>
            <div className="flex gap-3">
              {CONDITIONS.map(c => (
                <label
                  key={c.value}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 py-2 text-sm font-medium transition-all ${
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

export const ItemsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: GirviFormSectionProps) => {
  const { t } = useTranslation()
  const items: GirviItemFormData[] = data.items || []

  const handleItemChange = (
    index: number,
    field: keyof GirviItemFormData,
    value: any
  ) => {
    const updated = [...items]
    updated[index] = recalcItem({ ...updated[index], [field]: value })
    onChange('items', updated)
  }

  const handleAddItem = () => {
    onChange('items', [...items, createBlankItem()])
  }

  const handleRemoveItem = (index: number) => {
    onChange('items', items.filter((_, i) => i !== index))
  }

  // Totals
  const totalGross = items.reduce((s, i) => s + parseFloat(String(i.grossWeight || 0)), 0)
  const totalNet   = items.reduce((s, i) => s + (i.netWeight ?? 0), 0)
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
        />
      ))}

      {!disabled && (
        <button
          type="button"
          onClick={handleAddItem}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-accent/40 py-3 text-sm font-medium text-accent hover:border-accent hover:bg-accent/5 transition-all"
        >
          <Plus className="h-4 w-4" />
          {t('girvi.addItem')}
        </button>
      )}

      {errors.items && (
        <p className="text-sm text-status-error">{errors.items}</p>
      )}
      {items.length > 0 && totalGross > 0 && (
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-bg-tertiary p-4">
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girvi.totalGrossWeight')}</p>
            <p className="font-bold text-text-primary">{totalGross.toFixed(3)}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girvi.totalNetWeight')}</p>
            <p className="font-bold text-text-primary">{totalNet.toFixed(3)}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girvi.totalApproxValue')}</p>
            <p className="font-bold text-accent">₹{totalValue.toLocaleString('en-IN')}</p>
          </div>
        </div>
      )}
    </div>
  )
}