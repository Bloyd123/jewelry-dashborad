// FILE: src/pages/UserProfile/tabs/ShopAccessTab.tsx
// Shop Access & Permissions Tab Component

import { useTranslation } from 'react-i18next'
import { Store, Shield, CheckCircle2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import { useAppSelector } from '@/store/hooks'
import { selectUserProfile } from '@/store/slices/userSlice'
import { selectShopAccesses } from '@/store/slices/permissionsSlice'

export const ShopAccessTab = () => {
  
  const { t } = useTranslation()
    const user = useAppSelector(selectUserProfile)
  const shopAccesses = useAppSelector(selectShopAccesses)
  // ✅ AFTER - Categories define karo
const permissionCategories = {
  'Customer Management': [
    'canViewCustomers', 'canCreateCustomer', 'canUpdateCustomer',
    'canDeleteCustomers', 'canSearchCustomer', 'canGetSingleCustomer',
    'canBlacklistCustomer', 'canRemoveCustomerBlacklist',
    'canAddLoyaltyPoints', 'canRedeemLoyaltyPoints',
    'canViewCustomerAnalytics', 'canManageCustomers', 'canViewCustomerHistory'
  ],
  'Product Management': [
    'canViewProducts', 'canCreateProduct', 'canUpdateProduct',
    'canDeleteProducts', 'canSearchProducts', 'canGetSingleProduct',
    'canUpdateStock', 'canReserveProduct', 'canCancelReservation',
    'canMarkAsSold', 'canCalculatePrice', 'canGetLowStock',
    'canViewProductHistory', 'canViewProductAnalytics',
    'canBulkDeleteProducts', 'canBulkUpdateStatus', 'canManageProducts',
    'canManageInventory', 'canViewInventory', 'canEditInventory',
    'canImportProducts', 'canExportProducts'
  ],
  'Shop Management': [
    'canViewShops', 'canCreateShop', 'canUpdateShop', 'canDeleteShop',
    'canViewSingleShop', 'canUpdateSettings', 'canUpdateMetalRates',
    'canViewShopStatistics', 'canManageShopSettings',
    'canManageMetalRates', 'canTransferInventory'
  ],
  'Sales Management': [
    'canViewSales', 'canCreateSale', 'canUpdateSale', 'canDeleteSales',
    'canGetSingleSale', 'canUpdateSaleStatus', 'canConfirmSale',
    'canMarkAsDelivered', 'canCompleteSale', 'canCancelSale',
    'canAddSalePayment', 'canGetSalePayments', 'canGenerateInvoices',
    'canSendInvoice', 'canPrintInvoice', 'canProcessReturn',
    'canApplyDiscounts', 'canViewSalesAnalytics', 'canManageSales',
    'canAccessPOS'
  ],
  'Purchase Management': [
    'canViewPurchases', 'canCreatePurchase', 'canUpdatePurchase',
    'canDeletePurchases', 'canGetSinglePurchase', 'canUpdatePurchaseStatus',
    'canMarkAsReceived', 'canCancelPurchase', 'canApprovePurchases',
    'canAddPurchasePayment', 'canViewPurchaseAnalytics', 'canManagePurchases'
  ],
  'Payment Management': [
    'canViewPayments', 'canCreatePayment', 'canGetPaymentsList',
    'canUpdatePayment', 'canDeletePayment', 'canCompletePayment',
    'canCancelPayment', 'canReceivePayments', 'canMakePayments',
    'canProcessRefund', 'canViewPaymentAnalytics', 'canGenerateReceipt'
  ],
  'Order Management': [
    'canViewOrders', 'canCreateOrder', 'canUpdateOrder', 'canCancelOrders',
    'canConfirmOrder', 'canAssignOrder', 'canManageOrders',
    'canManageRepairs', 'canManageCustomOrders', 'canViewOrderAnalytics'
  ],
  'Supplier Management': [
    'canViewSuppliers', 'canCreateSupplier', 'canUpdateSupplier',
    'canDeleteSuppliers', 'canManageSuppliers', 'canViewSupplierStatistics'
  ],
  'Reports & Analytics': [
    'canViewReports', 'canGenerateReports', 'canExportReports',
    'canViewAnalytics', 'canViewDashboard', 'canManageReports'
  ],
  'User Management': [
    'canViewUsers', 'canCreateUsers', 'canEditUsers',
    'canDeleteUsers', 'canAssignRoles', 'canManageUsers'
  ],
  'System': [
    'canManageSettings', 'canExportData', 'canDeleteRecords',
    'canViewAuditLog', 'canBackupData', 'canRestoreData',
    'canManageTaxSettings'
  ],
  'Metal Rate Management': [
    'canCreateUpdateRate', 'canGetCurrentRate', 'canGetRateHistory',
    'canGetRateByDate', 'canCompareRates', 'canGetTrendData',
    'canGetRateForPurity', 'canGetAverageRate', 'canSyncToAllShops',
    'canDeactivateRate', 'canDeleteRate'
],
'Parties & Billing': [
    'canManageParties', 'canViewPartyLedger',
    'canManageBilling', 'canViewBilling'
],
'Financial': [
    'canViewFinancials', 'canViewProfitLoss', 'canApproveTransactions'
],
'Expenses': [
    'canManageExpenses'
],
'Schemes': [
    'canManageSchemes', 'canViewSchemes', 'canCreateSchemes',
    'canEditSchemes', 'canDeleteSchemes'
],
}
console.log('user.primaryShop:', user?.primaryShop)
console.log('shopAccesses:', shopAccesses)
console.log('primaryShopAccess:', shopAccesses.find(a => a.shopId === user?.primaryShop))
  return (
    <div className="space-y-6">
      {/* Primary Shop Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Store className="mr-2 inline h-5 w-5" />
            {t('userProfile.shopAccess.primaryShop')}
          </CardTitle>
          <CardDescription>
            {t('userProfile.shopAccess.primaryShopDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
{user?.primaryShop ? (
    (() => {
        const primaryShopAccess = shopAccesses.find(
            access => access.shopId === user.primaryShop
        )

        return (
            <div className="flex items-start justify-between rounded-lg border border-border-primary bg-bg-tertiary p-4">
                <div className="space-y-1">
                    <p className="font-medium text-text-primary">
                        {primaryShopAccess?.shopName || t('userProfile.shopAccess.primaryShopAssigned')}
                    </p>
                    <p className="text-sm text-text-tertiary">
                        {t('userProfile.shopAccess.role')}: {primaryShopAccess?.role || '-'}
                    </p>
                </div>
                <Badge variant="success">{t('common.active')}</Badge>
            </div>
        )
    })()   
) : (
    <p className="text-sm text-text-tertiary">
        {t('userProfile.shopAccess.noPrimaryShop')}
    </p>
)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Shield className="mr-2 inline h-5 w-5" />
            {t('userProfile.shopAccess.accessPermissions')}
          </CardTitle>
          <CardDescription>
            {t('userProfile.shopAccess.accessPermissionsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
{shopAccesses && shopAccesses.length > 0 ? (
    shopAccesses.map((access) => (
        <div
            key={access.shopId}
            className="space-y-3 rounded-lg border border-border-primary p-4"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-text-primary">
                        {access.shopName || access.shopId}
                    </p>
                    <p className="text-sm text-text-secondary">
                        {t('userProfile.shopAccess.role')}:{' '}
                        <Badge variant="default">{access.role}</Badge>
                    </p>
                </div>
                <Badge variant={access.isActive ? 'success' : 'inactive'}>
                    {access.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
            </div>

            <Separator />
<div className="space-y-3">
    <p className="text-sm font-medium text-text-primary">
        {t('userProfile.shopAccess.permissions')}:
    </p>
    {Object.entries(permissionCategories).map(([category, perms]) => {
        // ✅ Sirf woh permissions dikhao jo user ke paas hain
        const userPerms = perms.filter(
            perm => access.permissions?.[perm] === true
        )
        // ✅ Agar is category mein koi permission nahi toh skip karo
        if (userPerms.length === 0) return null

        return (
            <div key={category} className="space-y-1">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    {category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {userPerms.map(perm => (
                        <Badge key={perm} variant="outline" size="sm">
                            <CheckCircle2 className="mr-1 h-3 w-3 text-status-success" />
                            {perm.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                    ))}
                </div>
            </div>
        )
    })}
</div>
        </div>
    ))
) : (
    <p className="text-sm text-text-tertiary">
        {t('userProfile.shopAccess.noShopAccess')}
    </p>
)}
        </CardContent>
      </Card>
    </div>
  )
}
