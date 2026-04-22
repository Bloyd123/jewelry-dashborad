// FILE: src/components/girviTransfer/GirviTransferForm/sections/GirviSection.tsx

import { useState, useEffect } from 'react'
import { useTranslation }      from 'react-i18next'
import { Search, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { Badge }  from '@/components/ui/data-display/Badge/Badge'
import { useAuth }      from '@/hooks/auth/'
import { useGirviList } from '@/hooks/girvi/useGirviList'
import { useGirviById } from '@/hooks/girvi/useGirviById'
import type { FormSectionProps } from '../GirviTransferForm.types'

// ── Status badge variant map ───────────────────────────────────────────────────
const STATUS_VARIANT: Record<string, string> = {
  active:           'success',
  overdue:          'warning',
  transferred:      'info',
  released:         'default',
  partial_released: 'info',
  auctioned:        'error',
}

// ── Props ──────────────────────────────────────────────────────────────────────
interface GirviSectionProps extends FormSectionProps {
  /** If girviId already known from URL, pass it to pre-select */
  initialGirviId?: string
  /** Called when a transferrable girvi is selected, so parent can pre-fill */
  onGirviSelected?: (girviInfo: {
    girviId:             string
    girviNumber:         string
    principalAmount:     number
    outstandingPrincipal: number
    interestRate:        number
    interestType:        string
    customerName:        string
    customerPhone:       string
  }) => void
}

// ── Component ──────────────────────────────────────────────────────────────────
export const GirviSection = ({
  data,
  errors,
  onChange,
  disabled,
  initialGirviId,
  onGirviSelected,
}: GirviSectionProps) => {
  const { t }           = useTranslation()
  const { currentShopId } = useAuth()
  const shopId          = currentShopId || ''

  const [searchQuery,     setSearchQuery]     = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedGirviId, setSelectedGirviId] = useState<string>(initialGirviId || '')

  // ── Fetch list for search suggestions ─────────────────────────────────────
  const { girvis, isLoading: listLoading } = useGirviList(shopId, {
    search: searchQuery,
    limit:  15,
    status: undefined, // show all statuses so user sees why some can't transfer
  })

  // ── Fetch full girvi when one is selected ──────────────────────────────────
  const { girvi, isLoading: detailLoading } = useGirviById(shopId, selectedGirviId)

  // ── When URL provides initialGirviId, auto-load & pre-fill ────────────────
  useEffect(() => {
    if (initialGirviId && initialGirviId !== selectedGirviId) {
      setSelectedGirviId(initialGirviId)
    }
  }, [initialGirviId])

  // ── When girvi detail loads, notify parent & set search label ─────────────
  useEffect(() => {
    if (!girvi) return

    setSearchQuery(girvi.girviNumber)

    const customer     = typeof girvi.customerId === 'object' ? girvi.customerId as any : null
    const customerName = customer
      ? `${customer.firstName} ${customer.lastName || ''}`.trim()
      : ''

    onGirviSelected?.({
      girviId:              girvi._id,
      girviNumber:          girvi.girviNumber,
      principalAmount:      girvi.principalAmount,
      outstandingPrincipal: girvi.outstandingPrincipal,
      interestRate:         girvi.interestRate,
      interestType:         girvi.interestType,
      customerName,
      customerPhone: customer?.phone || '',
    })

    // Sync girviId into form data so parent can use it
    onChange('girviId', girvi._id)
  }, [girvi?._id])

  // ── Select from dropdown ───────────────────────────────────────────────────
  const handleSelect = (g: any) => {
    setSelectedGirviId(g._id)
    setSearchQuery(g.girviNumber)
    setShowSuggestions(false)
  }

  // ── Clear ──────────────────────────────────────────────────────────────────
  const handleClear = () => {
    setSelectedGirviId('')
    setSearchQuery('')
    onChange('girviId', '')
    onGirviSelected?.({
      girviId: '', girviNumber: '', principalAmount: 0,
      outstandingPrincipal: 0, interestRate: 0, interestType: 'simple',
      customerName: '', customerPhone: '',
    })
  }

  // ── Can this girvi be transferred? ─────────────────────────────────────────
  const canTransfer = (status: string, isTransferred: boolean) =>
    (status === 'active' || status === 'overdue') && !isTransferred

  // ── Render ─────────────────────────────────────────────────────────────────
  const customer = girvi && typeof girvi.customerId === 'object'
    ? (girvi.customerId as any)
    : null

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          {t('girviTransfer.girvi.title', 'Select Girvi to Transfer')}
        </h3>

        {/* ── Search Box ──────────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <Label className="text-xs">
            {t('girviTransfer.girvi.searchLabel', 'Girvi Number / Customer Name')}
            <span className="ml-1 text-status-error">*</span>
          </Label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {detailLoading
                ? <Loader2 className="h-4 w-4 animate-spin text-text-tertiary" />
                : <Search className="h-4 w-4 text-text-tertiary" />
              }
            </div>

            <Input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setShowSuggestions(e.target.value.length >= 1)
                if (selectedGirviId) handleClear()
              }}
              onFocus={() => { if (searchQuery.length >= 1) setShowSuggestions(true) }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              disabled={disabled}
              placeholder={t('girviTransfer.girvi.searchPlaceholder', 'Search by GRV number or customer name...')}
              className={`h-10 pl-10 pr-10 ${errors.girviId ? 'border-status-error' : ''}`}
            />

            {selectedGirviId && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* ── Suggestions Dropdown ──────────────────────────────────── */}
            {showSuggestions && searchQuery.length >= 1 && (
              <div className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border-primary bg-bg-secondary shadow-lg">
                {listLoading ? (
                  <div className="flex items-center justify-center gap-2 p-3 text-sm text-text-secondary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('common.searching', 'Searching')}...
                  </div>
                ) : girvis.length === 0 ? (
                  <div className="p-3 text-center text-sm text-text-secondary">
                    {t('girviTransfer.girvi.noResults', 'No girvis found')}
                  </div>
                ) : (
                  girvis.map((g: any) => {
                    const cust        = typeof g.customerId === 'object' ? g.customerId as any : null
                    const custName    = cust ? `${cust.firstName} ${cust.lastName || ''}`.trim() : ''
                    const transferable = canTransfer(g.status, g.isTransferred)

                    return (
                      <button
                        key={g._id}
                        type="button"
                        onMouseDown={() => transferable && handleSelect(g)}
                        disabled={!transferable}
                        className={`w-full border-b border-border-secondary p-3 text-left last:border-0 transition-colors
                          ${transferable
                            ? 'hover:bg-bg-tertiary cursor-pointer'
                            : 'cursor-not-allowed opacity-50'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-text-primary">
                                {g.girviNumber}
                              </p>
                              <Badge
                                variant={STATUS_VARIANT[g.status] as any ?? 'default'}
                                size="sm"
                              >
                                {g.status.toUpperCase()}
                              </Badge>
                              {g.isTransferred && (
                                <Badge variant="warning" size="sm">TRANSFERRED</Badge>
                              )}
                            </div>
                            {custName && (
                              <p className="text-sm text-text-secondary">{custName}</p>
                            )}
                            {cust?.phone && (
                              <p className="text-xs text-text-tertiary">📱 {cust.phone}</p>
                            )}
                            {!transferable && (
                              <p className="mt-0.5 text-xs text-status-error">
                                {g.isTransferred
                                  ? t('girviTransfer.girvi.alreadyTransferred', 'Already transferred')
                                  : t('girviTransfer.girvi.cannotTransfer', `Cannot transfer (${g.status})`)
                                }
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="text-sm font-semibold text-text-primary">
                              ₹{Number(g.outstandingPrincipal || g.principalAmount || 0).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-text-tertiary">
                              {g.interestRate}% / mo
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            )}
          </div>

          {errors.girviId && (
            <p className="text-sm text-status-error">{errors.girviId}</p>
          )}
        </div>

        {/* ── Selected Girvi Card ──────────────────────────────────────────── */}
        {girvi && !detailLoading && (
          <div className={`mt-4 rounded-lg border-2 p-4 space-y-3
            ${canTransfer(girvi.status, girvi.isTransferred)
              ? 'border-accent/30 bg-accent/5'
              : 'border-status-error/30 bg-status-error/5'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base font-bold text-text-primary">
                    {girvi.girviNumber}
                  </p>
                  <Badge
                    variant={STATUS_VARIANT[girvi.status] as any ?? 'default'}
                    size="sm"
                  >
                    {girvi.status.toUpperCase()}
                  </Badge>
                  {girvi.isTransferred && (
                    <Badge variant="warning" size="sm">TRANSFERRED</Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-text-tertiary">
                  {new Date(girvi.girviDate).toLocaleDateString('en-IN')}
                </p>
              </div>

              {canTransfer(girvi.status, girvi.isTransferred) ? (
                <div className="flex items-center gap-1 text-xs text-status-success">
                  <CheckCircle2 className="h-4 w-4" />
                  {t('girviTransfer.girvi.canTransfer', 'Can Transfer')}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-status-error">
                  <AlertCircle className="h-4 w-4" />
                  {t('girviTransfer.girvi.cannotTransferLabel', 'Cannot Transfer')}
                </div>
              )}
            </div>

            {/* Customer row */}
            {customer && (
              <div className="flex items-center gap-3 rounded-md bg-bg-primary px-3 py-2">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                  {customer.firstName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {customer.firstName} {customer.lastName || ''}
                  </p>
                  <p className="text-xs text-text-secondary">
                    📱 {customer.phone}
                    {customer.customerCode && (
                      <span className="ml-2 text-text-tertiary">#{customer.customerCode}</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Financial grid */}
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: t('girviTransfer.girvi.outstanding', 'Outstanding'),
                  value: `₹${Number(girvi.outstandingPrincipal || 0).toLocaleString('en-IN')}`,
                  highlight: true,
                },
                {
                  label: t('girviTransfer.girvi.interest', 'Interest Rate'),
                  value: `${girvi.interestRate}% / mo`,
                },
                {
                  label: t('girviTransfer.girvi.type', 'Type'),
                  value: girvi.interestType,
                },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="rounded-md bg-bg-primary px-2 py-2 text-center"
                >
                  <p className="text-xs text-text-tertiary">{stat.label}</p>
                  <p className={`text-sm font-semibold capitalize
                    ${stat.highlight ? 'text-accent' : 'text-text-primary'}`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Items */}
            {girvi.items && girvi.items.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-text-secondary">
                  {t('girviTransfer.girvi.items', 'Pledged Items')} ({girvi.items.length})
                </p>
                {girvi.items.map((item: any, idx: number) => (
                  <div
                    key={item._id || idx}
                    className="flex items-center justify-between rounded-md bg-bg-primary px-3 py-1.5 text-xs"
                  >
                    <span className="font-medium text-text-primary">
                      {idx + 1}. {item.itemName}
                    </span>
                    <span className="text-text-secondary capitalize">
                      {item.itemType} · {item.netWeight}g
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Warning if cannot transfer */}
            {!canTransfer(girvi.status, girvi.isTransferred) && (
              <div className="flex items-start gap-2 rounded-md border border-status-error/30 bg-status-error/10 p-2 text-xs text-status-error">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  {girvi.isTransferred
                    ? t('girviTransfer.girvi.alreadyTransferredMsg', 'This girvi is already transferred to another party.')
                    : t('girviTransfer.girvi.wrongStatusMsg', `Only active or overdue girvis can be transferred. Current status: ${girvi.status}`)
                  }
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}