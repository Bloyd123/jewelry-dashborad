// ============================================================================
// FILE: src/features/customer/components/CustomerTable/CustomerTableActions.tsx
// Customer Table Row Actions Menu
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  Edit,
  Trash2,
  Ban,
  ShieldCheck,
  Gift,
  Phone,
  Mail,
  MessageSquare,
  CreditCard,
  FileText,
  Copy,
  Star,
  AlertCircle,
} from 'lucide-react'
import type { RowAction } from '@/components/ui/data-display/DataTable'
import type { CustomerListItem } from '@/types'

// ============================================================================
// ACTION HANDLERS TYPE
// ============================================================================

export interface CustomerActionHandlers {
  onView?: (customer: CustomerListItem) => void
  onEdit?: (customer: CustomerListItem) => void
  onDelete?: (customer: CustomerListItem) => void
  onBlacklist?: (customer: CustomerListItem) => void
  onRemoveBlacklist?: (customer: CustomerListItem) => void
  onAddLoyaltyPoints?: (customer: CustomerListItem) => void
  onRedeemLoyaltyPoints?: (customer: CustomerListItem) => void
  onCall?: (customer: CustomerListItem) => void
  onEmail?: (customer: CustomerListItem) => void
  onWhatsApp?: (customer: CustomerListItem) => void
  onRecordPayment?: (customer: CustomerListItem) => void
  onViewOrders?: (customer: CustomerListItem) => void
  onCopyDetails?: (customer: CustomerListItem) => void
  onMarkAsVIP?: (customer: CustomerListItem) => void
  onViewTransactions?: (customer: CustomerListItem) => void
}

// ============================================================================
// PERMISSIONS TYPE
// ============================================================================

export interface CustomerPermissions {
  canViewCustomers?: boolean
  canEditCustomers?: boolean
  canDeleteCustomers?: boolean
  canManageCustomers?: boolean
  canBlacklistCustomer?: boolean
  canRemoveCustomerBlacklist?: boolean
  canAddLoyaltyPoints?: boolean
  canRedeemLoyaltyPoints?: boolean
  canCreateSales?: boolean
  canCreatePayments?: boolean
  canViewSales?: boolean
  canViewTransactions?: boolean
}

// ============================================================================
// GET ROW ACTIONS
// ============================================================================

export const getCustomerRowActions = (
  handlers: CustomerActionHandlers,
  permissions: CustomerPermissions = {}
): RowAction<CustomerListItem>[] => {
  const actions: RowAction<CustomerListItem>[] = []

  // ========================================================================
  // VIEW CUSTOMER
  // ========================================================================
  if (permissions.canViewCustomers && handlers.onView) {
    actions.push({
      label: 'customer.actions.view',
      icon: <Eye className="h-4 w-4" />,
      onClick: handlers.onView,
    })
  }

  // ========================================================================
  // EDIT CUSTOMER
  // ========================================================================
  if (permissions.canEditCustomers && handlers.onEdit) {
    actions.push({
      label: 'customer.actions.edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: handlers.onEdit,
      disabled: (row) => row.isBlacklisted,
    })
  }

  // ========================================================================
  // QUICK ACTIONS SEPARATOR
  // ========================================================================
  if (handlers.onCall || handlers.onWhatsApp || handlers.onEmail) {
    // Quick Communication Actions
    if (handlers.onCall) {
      actions.push({
        label: 'customer.actions.call',
        icon: <Phone className="h-4 w-4" />,
        onClick: handlers.onCall,
      })
    }

    if (handlers.onWhatsApp) {
      actions.push({
        label: 'customer.actions.whatsapp',
        icon: <MessageSquare className="h-4 w-4" />,
        onClick: handlers.onWhatsApp,
        hidden: (row) => !row.whatsappNumber && !row.phone,
      })
    }

    if (handlers.onEmail) {
      actions.push({
        label: 'customer.actions.email',
        icon: <Mail className="h-4 w-4" />,
        onClick: handlers.onEmail,
        hidden: (row) => !row.email,
      })
    }
  }

  // ========================================================================
  // VIEW ORDERS
  // ========================================================================
  if (permissions.canViewSales && handlers.onViewOrders) {
    actions.push({
      label: 'customer.actions.viewOrders',
      icon: <FileText className="h-4 w-4" />,
      onClick: handlers.onViewOrders,
    })
  }

  // ========================================================================
  // VIEW TRANSACTIONS
  // ========================================================================
  if (permissions.canViewTransactions && handlers.onViewTransactions) {
    actions.push({
      label: 'customer.actions.viewTransactions',
      icon: <CreditCard className="h-4 w-4" />,
      onClick: handlers.onViewTransactions,
    })
  }

  // ========================================================================
  // RECORD PAYMENT
  // ========================================================================
  if (permissions.canCreatePayments && handlers.onRecordPayment) {
    actions.push({
      label: 'customer.actions.recordPayment',
      icon: <CreditCard className="h-4 w-4" />,
      onClick: handlers.onRecordPayment,
      hidden: (row) => !row.totalDue || row.totalDue <= 0,
    })
  }

  // ========================================================================
  // LOYALTY POINTS ACTIONS
  // ========================================================================
  if (permissions.canAddLoyaltyPoints && handlers.onAddLoyaltyPoints) {
    actions.push({
      label: 'customer.actions.addLoyaltyPoints',
      icon: <Gift className="h-4 w-4" />,
      onClick: handlers.onAddLoyaltyPoints,
      disabled: (row) => row.isBlacklisted,
    })
  }

  if (permissions.canRedeemLoyaltyPoints && handlers.onRedeemLoyaltyPoints) {
    actions.push({
      label: 'customer.actions.redeemLoyaltyPoints',
      icon: <Gift className="h-4 w-4" />,
      onClick: handlers.onRedeemLoyaltyPoints,
      disabled: (row) => !row.loyaltyPoints || row.loyaltyPoints <= 0 || row.isBlacklisted,
    })
  }

  // ========================================================================
  // MARK AS VIP
  // ========================================================================
  if (permissions.canManageCustomers && handlers.onMarkAsVIP) {
    actions.push({
      label: 'customer.actions.markAsVIP',
      icon: <Star className="h-4 w-4" />,
      onClick: handlers.onMarkAsVIP,
      hidden: (row) => row.customerType === 'vip',
      disabled: (row) => row.isBlacklisted,
    })
  }

  // ========================================================================
  // COPY DETAILS
  // ========================================================================
  if (handlers.onCopyDetails) {
    actions.push({
      label: 'customer.actions.copyDetails',
      icon: <Copy className="h-4 w-4" />,
      onClick: handlers.onCopyDetails,
    })
  }

  // ========================================================================
  // BLACKLIST MANAGEMENT
  // ========================================================================
  if (permissions.canBlacklistCustomer && handlers.onBlacklist) {
    actions.push({
      label: 'customer.actions.blacklist',
      icon: <Ban className="h-4 w-4" />,
      variant: 'destructive',
      onClick: handlers.onBlacklist,
      hidden: (row) => row.isBlacklisted,
    })
  }

  if (permissions.canRemoveCustomerBlacklist && handlers.onRemoveBlacklist) {
    actions.push({
      label: 'customer.actions.removeBlacklist',
      icon: <ShieldCheck className="h-4 w-4" />,
      onClick: handlers.onRemoveBlacklist,
      hidden: (row) => !row.isBlacklisted,
    })
  }

  // ========================================================================
  // DELETE CUSTOMER
  // ========================================================================
  if (permissions.canDeleteCustomers && permissions.canManageCustomers && handlers.onDelete) {
    actions.push({
      label: 'customer.actions.delete',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      onClick: handlers.onDelete,
      disabled: (row) => {
        // Cannot delete if customer has outstanding balance
        if (row.totalDue && row.totalDue > 0) return true
        // Cannot delete if customer has orders
        if (row.statistics?.totalOrders && row.statistics.totalOrders > 0) return true
        return false
      },
    })
  }

  return actions
}

// ============================================================================
// SIMPLE ROW ACTIONS (Basic View)
// ============================================================================

export const getSimpleCustomerRowActions = (
  handlers: CustomerActionHandlers,
  permissions: CustomerPermissions = {}
): RowAction<CustomerListItem>[] => {
  const actions: RowAction<CustomerListItem>[] = []

  // View
  if (permissions.canViewCustomers && handlers.onView) {
    actions.push({
      label: 'customer.actions.view',
      icon: <Eye className="h-4 w-4" />,
      onClick: handlers.onView,
    })
  }

  // Edit
  if (permissions.canEditCustomers && handlers.onEdit) {
    actions.push({
      label: 'customer.actions.edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: handlers.onEdit,
    })
  }

  // Delete
  if (permissions.canDeleteCustomers && handlers.onDelete) {
    actions.push({
      label: 'customer.actions.delete',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      onClick: handlers.onDelete,
      disabled: (row) => (row.totalDue && row.totalDue > 0) || false,
    })
  }

  return actions
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Copy customer details to clipboard
 */
export const copyCustomerDetails = async (customer: CustomerListItem): Promise<boolean> => {
  const details = `
Customer Code: ${customer.customerCode}
Name: ${customer.firstName} ${customer.lastName || ''}
Phone: ${customer.phone}
Email: ${customer.email || 'N/A'}
Customer Type: ${customer.customerType}
Total Purchases: ₹${customer.totalPurchases?.toLocaleString() || 0}
Outstanding Due: ₹${customer.totalDue?.toLocaleString() || 0}
Loyalty Points: ${customer.loyaltyPoints || 0}
  `.trim()

  try {
    await navigator.clipboard.writeText(details)
    return true
  } catch (error) {
    console.error('Failed to copy customer details:', error)
    return false
  }
}

/**
 * Open phone dialer
 */
export const openPhoneDialer = (phone: string): void => {
  window.open(`tel:${phone}`, '_self')
}

/**
 * Open email client
 */
export const openEmailClient = (email: string): void => {
  window.open(`mailto:${email}`, '_blank')
}

/**
 * Open WhatsApp
 */
export const openWhatsApp = (phone: string): void => {
  // Remove +91 and spaces
  const cleanPhone = phone.replace(/\+91|\s/g, '')
  window.open(`https://wa.me/91${cleanPhone}`, '_blank')
}

// ============================================================================
// EXPORT
// ============================================================================

export default getCustomerRowActions