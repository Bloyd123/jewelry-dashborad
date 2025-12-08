// ============================================================================
// FILE: src/components/customer/CustomerCard/CustomerCard.mobile.tsx
// Mobile CustomerCard Component
// ============================================================================

import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Users,
  Phone,
  Mail,
//   MapPin,
//   Calendar,
//   Award,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
//   Crown,
//   ShoppingBag,
//   Tag,
  ChevronRight,
  MoreVertical,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Customer, CustomerListItem } from '@/types'

interface CustomerCardMobileProps {
  customer: Customer | CustomerListItem
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
  variant?: 'default' | 'compact'
}

export default function CustomerCardMobile({
  customer,
  onClick,
  onEdit,
  onDelete,
  showActions = true,
  variant = 'default',
}: CustomerCardMobileProps) {
  const { t } = useTranslation()

  const fullName = `${customer.firstName} ${customer.lastName || ''}`.trim()
  const isFullCustomer = 'address' in customer

  const getStatusBadge = () => {
    if (customer.isBlacklisted) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-status-error/10 text-status-error border border-status-error/20">
          <AlertCircle className="h-3 w-3" />
          {t('customer.blacklisted')}
        </span>
      )
    }
    if (customer.isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-status-success/10 text-status-success border border-status-success/20">
          <CheckCircle className="h-3 w-3" />
          {t('customer.active')}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-bg-tertiary text-text-tertiary border border-border-primary">
        {t('customer.inactive')}
      </span>
    )
  }

  if (variant === 'compact') {
    return (
      <Card
        className="bg-bg-secondary border-border-primary active:bg-bg-tertiary transition-colors"
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center">
              <span className="text-accent font-semibold">
                {customer.firstName.charAt(0).toUpperCase()}
                {customer.lastName?.charAt(0).toUpperCase() || ''}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-text-primary font-medium truncate">
                  {fullName}
                </h3>
                {getStatusBadge()}
              </div>
              <p className="text-text-tertiary text-xs font-mono mt-1">
                {customer.customerCode}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {customer.phone}
                </span>
                <span className="text-accent font-medium">
                  {customer.loyaltyPoints} pts
                </span>
              </div>
            </div>

            {/* Actions Menu */}
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-bg-secondary border-border-primary">
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit} className="text-text-primary">
                      <Edit className="h-4 w-4 mr-2" />
                      {t('common.edit')}
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={onDelete} className="text-status-error">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('common.delete')}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Arrow */}
            {onClick && !showActions && (
              <ChevronRight className="h-5 w-5 text-text-tertiary flex-shrink-0" />
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="bg-bg-secondary border-border-primary active:bg-bg-tertiary transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="h-14 w-14 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold text-lg">
                {customer.firstName.charAt(0).toUpperCase()}
                {customer.lastName?.charAt(0).toUpperCase() || ''}
              </span>
            </div>

            {/* Name & Code */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary truncate">
                {fullName}
              </h3>
              <p className="text-text-tertiary text-xs font-mono mt-1">
                {customer.customerCode}
              </p>
            </div>
          </div>

          {/* Actions Menu */}
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-bg-secondary border-border-primary">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit} className="text-text-primary">
                    <Edit className="h-4 w-4 mr-2" />
                    {t('common.edit')}
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={onDelete} className="text-status-error">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('common.delete')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {getStatusBadge()}
          {customer.customerType && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-bg-tertiary text-text-secondary border border-border-primary">
              {t(`customer.type.${customer.customerType}`)}
            </span>
          )}
        </div>

        {/* Contact */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Phone className="h-4 w-4 text-text-tertiary" />
            <span>{customer.phone}</span>
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Mail className="h-4 w-4 text-text-tertiary" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-primary">
          <div>
            <div className="text-text-tertiary text-xs mb-1">
              {t('customer.purchases')}
            </div>
            <div className="text-text-primary font-semibold">
              ₹{customer.totalPurchases.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-text-tertiary text-xs mb-1">
              {t('customer.points')}
            </div>
            <div className="text-accent font-semibold">
              {customer.loyaltyPoints}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}