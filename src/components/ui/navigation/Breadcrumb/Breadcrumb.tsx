// ============================================================================
// FILE: src/components/ui/navigation/Breadcrumb/Breadcrumb.tsx
// Theme-based Breadcrumb Component - Flexible & Responsive
// ============================================================================

import * as React from 'react'
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  showHome?: boolean
  maxItems?: number
  className?: string
}

// ============================================================================
// BREADCRUMB COMPONENT
// ============================================================================

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  showHome = true,
  maxItems = 3,
  className,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick()
    } else if (item.href) {
      navigate(item.href)
    }
  }

  // Add home item if needed
  const allItems = showHome
    ? [
      { label: t('commontext.Home'), href: '/', icon: <Home className="h-4 w-4" /> },
        ...items,
      ]
    : items

  // Handle collapsed items for mobile
  const shouldCollapse = allItems.length > maxItems
  const collapsedItems = shouldCollapse
    ? [
        allItems[0],
        ...allItems.slice(1, -maxItems + 1),
        ...allItems.slice(-maxItems + 1),
      ]
    : allItems

  const hiddenItems = shouldCollapse ? allItems.slice(1, -maxItems + 1) : []

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex flex-wrap items-center gap-1 text-sm', className)}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {/* First item */}
        {collapsedItems[0] && (
          <BreadcrumbItemComponent
            item={collapsedItems[0]}
            isLast={collapsedItems.length === 1}
            onClick={handleClick}
          />
        )}

        {/* Collapsed items dropdown */}
        {shouldCollapse && hiddenItems.length > 0 && (
          <>
            <BreadcrumbSeparator separator={separator} />
            <li className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors',
                    'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
                  )}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hiddenItems.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => handleClick(item)}
                      className="cursor-pointer"
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </>
        )}

        {/* Remaining items */}
        {collapsedItems
          .slice(shouldCollapse ? -maxItems + 1 : 1)
          .map((item, index, arr) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator separator={separator} />
              <BreadcrumbItemComponent
                item={item}
                isLast={index === arr.length - 1}
                onClick={handleClick}
              />
            </React.Fragment>
          ))}
      </ol>
    </nav>
  )
}

// ============================================================================
// BREADCRUMB ITEM COMPONENT
// ============================================================================

interface BreadcrumbItemComponentProps {
  item: BreadcrumbItem
  isLast: boolean
  onClick: (item: BreadcrumbItem) => void
}

const BreadcrumbItemComponent: React.FC<BreadcrumbItemComponentProps> = ({
  item,
  isLast,
  onClick,
}) => {
  const isClickable = !isLast && (item.href || item.onClick)

  return (
    <li className="flex items-center">
      {isClickable ? (
        <button
          onClick={() => onClick(item)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors',
            'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
          )}
        >
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          <span className="max-w-[150px] truncate sm:max-w-[200px]">
            {item.label}
          </span>
        </button>
      ) : (
        <span
          className={cn(
            'flex items-center gap-1.5 px-2 py-1',
            isLast ? 'font-medium text-text-primary' : 'text-text-tertiary'
          )}
          aria-current={isLast ? 'page' : undefined}
        >
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          <span className="max-w-[150px] truncate sm:max-w-[200px]">
            {item.label}
          </span>
        </span>
      )}
    </li>
  )
}

// ============================================================================
// BREADCRUMB SEPARATOR
// ============================================================================

const BreadcrumbSeparator: React.FC<{ separator: React.ReactNode }> = ({
  separator,
}) => (
  <li className="flex items-center text-text-tertiary" aria-hidden="true">
    {separator}
  </li>
)

Breadcrumb.displayName = 'Breadcrumb'
