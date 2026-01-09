// FILE: src/components/ui/filters/FilterSheet/FilterSheet.tsx
// Mobile Bottom Sheet for Filters - Updated

import * as React from 'react'
import { Filter, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/overlay/Sheet'
import { cn } from '@/lib/utils'

// TYPES

export interface FilterSheetProps {
  children: React.ReactNode
  activeFilterCount?: number
  onClearAll?: () => void
  onApply?: () => void
  triggerLabel?: string
  title?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

// FILTER SHEET COMPONENT

export const FilterSheet = React.forwardRef<HTMLDivElement, FilterSheetProps>(
  (
    {
      children,
      activeFilterCount = 0,
      onClearAll,
      onApply,
      triggerLabel,
      title,
      open: controlledOpen,
      onOpenChange,
      showTrigger = true,
      size = 'xl',
      className,
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [internalOpen, setInternalOpen] = React.useState(false)

    // Use controlled or uncontrolled open state
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen
    const setOpen = onOpenChange || setInternalOpen

    const handleApply = () => {
      onApply?.()
      setOpen(false)
    }

    const handleClearAll = () => {
      onClearAll?.()
    }

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {/* Trigger Button */}
        {showTrigger && (
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              {triggerLabel || t('filters.moreFilters')}
              {activeFilterCount > 0 && (
                <Badge
                  variant="error"
                  size="sm"
                  className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
        )}

        {/* Sheet Content */}
        <SheetContent size={size} showHandle showClose>
          {/* Header with Clear Button */}
          <SheetHeader>
            <div className="flex items-center justify-between pr-8">
              <SheetTitle>{title || t('filters.advancedFilters')}</SheetTitle>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-8 px-2 text-xs"
                >
                  <X className="mr-1 h-3 w-3" />
                  {t('filters.clearAll')} ({activeFilterCount})
                </Button>
              )}
            </div>
          </SheetHeader>

          {/* Scrollable Filter Content */}
          <SheetBody ref={ref} className={cn('space-y-6', className)}>
            {children}
          </SheetBody>

          {/* Fixed Action Footer */}
          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={handleApply} className="flex-1">
              {t('common.apply')}
              {activeFilterCount > 0 && ` (${activeFilterCount})`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }
)

FilterSheet.displayName = 'FilterSheet'
