// ============================================================================
// FILE: src/components/customer/CustomerCard/CustomerCard.desktop.tsx
// Desktop CustomerCard Component
// ============================================================================

import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
//   CreditCard,
  Award,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Crown,
  ShoppingBag,
  Tag,
} from 'lucide-react'
import type { Customer, CustomerListItem } from '@/types'

interface CustomerCardDesktopProps {
  customer: Customer | CustomerListItem
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
  variant?: 'default' | 'compact'
}

export default function CustomerCardDesktop({
  customer,
  onClick,
  onEdit,
  onDelete,
  showActions = true,
  variant = 'default',
}: CustomerCardDesktopProps) {
  const { t } = useTranslation()

  const fullName = `${customer.firstName} ${customer.lastName || ''}`.trim()
  const isFullCustomer = 'address' in customer

  // Get status badge
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

  // Get customer type badge
  const getTypeBadge = () => {
    if (!customer.customerType) return null

    const typeConfig = {
      vip: { icon: Crown, color: 'text-accent bg-accent/10 border-accent/20' },
      wholesale: { icon: ShoppingBag, color: 'text-status-info bg-status-info/10 border-status-info/20' },
      retail: { icon: Tag, color: 'text-text-secondary bg-bg-tertiary border-border-primary' },
      regular: { icon: User, color: 'text-text-secondary bg-bg-tertiary border-border-primary' },
    }

    const config = typeConfig[customer.customerType]
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="h-3 w-3" />
        {t(`customer.type.${customer.customerType}`)}
      </span>
    )
  }

  if (variant === 'compact') {
    return (
      <Card
        className="bg-bg-secondary border-border-primary hover:border-accent transition-colors cursor-pointer"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Customer Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Avatar */}
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center">
                <span className="text-accent font-semibold text-sm">
                  {customer.firstName.charAt(0).toUpperCase()}
                  {customer.lastName?.charAt(0).toUpperCase() || ''}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-text-primary font-medium truncate">
                    {fullName}
                  </h3>
                  {getStatusBadge()}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-text-tertiary text-xs font-mono">
                    {customer.customerCode}
                  </span>
                  <span className="text-text-secondary text-sm flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {customer.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Stats & Actions */}
            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-text-tertiary text-xs">
                    {t('customer.purchases')}
                  </div>
                  <div className="text-text-primary font-semibold">
                    ₹{customer.totalPurchases.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-text-tertiary text-xs">
                    {t('customer.points')}
                  </div>
                  <div className="text-accent font-semibold">
                    {customer.loyaltyPoints}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit()
                      }}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                      }}
                      className="h-8 w-8 text-status-error hover:text-status-error hover:bg-status-error/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="bg-bg-secondary border-border-primary hover:border-accent transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="h-16 w-16 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold text-xl">
                {customer.firstName.charAt(0).toUpperCase()}
                {customer.lastName?.charAt(0).toUpperCase() || ''}
              </span>
            </div>

            {/* Name & Code */}
            <div>
              <h3 className="text-xl font-semibold text-text-primary">
                {fullName}
              </h3>
              <p className="text-text-tertiary text-sm font-mono mt-1">
                {customer.customerCode}
              </p>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {t('common.edit')}
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                  className="text-status-error hover:text-status-error hover:bg-status-error/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete')}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {getStatusBadge()}
          {getTypeBadge()}
          {'membershipTier' in customer && customer.membershipTier && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-bg-tertiary text-text-secondary border border-border-primary">
              <Award className="h-3 w-3" />
              {t(`customer.tier.${customer.membershipTier}`)}
            </span>
          )}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
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

        {/* Additional Info for Full Customer */}
        {isFullCustomer && (customer as Customer).address && (
          <div className="mb-4">
            <div className="flex items-start gap-2 text-text-secondary text-sm">
              <MapPin className="h-4 w-4 text-text-tertiary mt-0.5 flex-shrink-0" />
              <span>
                {(customer as Customer).address?.street && `${(customer as Customer).address?.street}, `}
                {(customer as Customer).address?.city && `${(customer as Customer).address?.city}, `}
                {(customer as Customer).address?.state} - {(customer as Customer).address?.pincode}
              </span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-primary">
          <div className="text-center">
            <div className="text-text-tertiary text-xs mb-1">
              {t('customer.totalPurchases')}
            </div>
            <div className="text-text-primary font-semibold text-lg">
              ₹{customer.totalPurchases.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-text-tertiary text-xs mb-1">
              {t('customer.loyaltyPoints')}
            </div>
            <div className="text-accent font-semibold text-lg">
              {customer.loyaltyPoints}
            </div>
          </div>
          {isFullCustomer && (
            <div className="text-center">
              <div className="text-text-tertiary text-xs mb-1">
                {t('customer.outstanding')}
              </div>
              <div className="text-status-warning font-semibold text-lg">
                ₹{(customer as Customer).outstandingBalance.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Member Since */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border-primary text-text-tertiary text-xs">
          <Calendar className="h-3 w-3" />
          <span>
            {t('customer.memberSince')} {new Date(customer.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}