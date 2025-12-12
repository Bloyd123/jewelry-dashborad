// ============================================================================
// FILE: src/components/ui/filters/FilterSheet/FilterSheet.tsx
// Mobile Bottom Sheet for Filters
// ============================================================================

import * as React from 'react'
import { Filter, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/overlay/Sheet'
import { Badge } from '@/components/ui/data-display/Badge'
// import { Separator } from '@/components/ui/layout/Separator'

export interface FilterSheetProps {
  children: React.ReactNode
  activeFilterCount?: number
  onClearAll?: () => void
  onApply?: () => void
  triggerLabel?: string
  title?: string
  className?: string
}

export const FilterSheet = React.forwardRef<HTMLDivElement, FilterSheetProps>(
  (
    {
      children,
      activeFilterCount = 0,
      onClearAll,
      onApply,
      triggerLabel,
      title,
      className,
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [open, setOpen] = React.useState(false)

    const handleApply = () => {
      onApply?.()
      setOpen(false)
    }

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            {triggerLabel || t('filters.moreFilters')}
            {activeFilterCount > 0 && (
              <Badge
                variant="accent"
                size="sm"
                className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>{title || t('filters.advancedFilters')}</span>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="h-8 px-2 text-xs"
                >
                  <X className="mr-1 h-3 w-3" />
                  {t('filters.clearAll')}
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>

          <div
            ref={ref}
            className={cn(
              'mt-6 space-y-6 overflow-y-auto max-h-[calc(85vh-140px)] pb-4',
              className
            )}
          >
            {children}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-bg-secondary border-t border-border-primary">
            <Button className="w-full" onClick={handleApply}>
              {t('common.apply')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }
)

FilterSheet.displayName = 'FilterSheet'