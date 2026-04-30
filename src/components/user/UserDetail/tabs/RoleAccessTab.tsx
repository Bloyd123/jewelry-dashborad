// FILE: src/components/user/UserDetail/tabs/RoleAccessTab.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, Store, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import type { User } from '@/types/user.types'

interface RoleAccessTabProps {
  user: User
}

const permissionCategories: Record<string, string[]> = {
  'Customer Management': [
    'canViewCustomers', 'canCreateCustomer', 'canUpdateCustomer',
    'canDeleteCustomers', 'canManageCustomers', 'canViewCustomerHistory',
    'canViewCustomerFinancials', 'canAddLoyaltyPoints', 'canRedeemLoyaltyPoints',
  ],
  'Sales Management': [
    'canViewSales', 'canCreateSale', 'canUpdateSale', 'canDeleteSales',
    'canConfirmSale', 'canCancelSale', 'canApplyDiscounts',
    'canViewSalesAnalytics', 'canManageSales', 'canAccessPOS',
  ],
  'Product Management': [
    'canViewProducts', 'canCreateProduct', 'canUpdateProduct',
    'canDeleteProducts', 'canUpdateStock', 'canManageProducts',
    'canManageInventory', 'canViewInventory',
  ],
  'Purchase Management': [
    'canViewPurchases', 'canCreatePurchase', 'canUpdatePurchase',
    'canApprovePurchases', 'canManagePurchases',
  ],
  'User Management': [
    'canViewUsers', 'canCreateUsers', 'canEditUsers',
    'canDeleteUsers', 'canManageUsers',
  ],
  'Reports & Analytics': [
    'canViewReports', 'canGenerateReports', 'canExportReports',
    'canViewAnalytics', 'canViewDashboard',
  ],
  'Shop Management': [
    'canViewShops', 'canUpdateShop', 'canManageShopSettings',
    'canUpdateMetalRates', 'canViewShopStatistics',
  ],
  'Financial': [
    'canViewFinancials', 'canViewProfitLoss', 'canApproveTransactions',
    'canReceivePayments', 'canMakePayments',
  ],
}

export const RoleAccessTab: React.FC<RoleAccessTabProps> = ({ user }) => {
  const { t } = useTranslation()

  const getRoleDescription = (role: string) => {
    const descriptions: Record<string, string> = {
      super_admin: t('user.roleDescriptions.superAdmin'),
      org_admin: t('user.roleDescriptions.orgAdmin'),
      shop_admin: t('user.roleDescriptions.shopAdmin'),
      manager: t('user.roleDescriptions.manager'),
      staff: t('user.roleDescriptions.staff'),
      accountant: t('user.roleDescriptions.accountant'),
      viewer: t('user.roleDescriptions.viewer'),
    }
    return descriptions[role] || ''
  }

  const roleVariants: Record<string, any> = {
    super_admin: 'vip',
    org_admin: 'warning',
    shop_admin: 'info',
    manager: 'default',
    staff: 'default',
    accountant: 'default',
    viewer: 'inactive',
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">

      {/* Role Card */}
      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <Shield className="h-5 w-5" />
            {t('user.roleAndPermissions')}
          </CardTitle>
          <CardDescription className="text-text-secondary">
            {t('user.roleAndPermissionsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-border-primary bg-bg-tertiary p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={roleVariants[user.role] || 'default'}>
                  {user.role.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-text-secondary">
                {getRoleDescription(user.role)}
              </p>
            </div>
          </div>

          {/* Organization */}
          {user.organizationId && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('user.organization')}
              </Label>
              <p className="font-mono text-sm text-text-primary">
                {typeof user.organizationId === 'object'
                  ? (user.organizationId as any)?.name || '—'
                  : user.organizationId}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Primary Shop Card */}
      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <Store className="h-5 w-5" />
            {t('userProfile.shopAccess.primaryShop')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.primaryShop ? (
            <div className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-tertiary p-4">
              <div className="space-y-1">
                <p className="font-medium text-text-primary">
                  {typeof user.primaryShop === 'object'
                    ? (user.primaryShop as any)?.name || t('userProfile.shopAccess.primaryShopAssigned')
                    : `Shop ${String(user.primaryShop).slice(-4)}`}
                </p>
                <p className="text-sm text-text-tertiary">
                  {t('userProfile.shopAccess.role')}: {user.role}
                </p>
              </div>
              <Badge variant="success">{t('common.active')}</Badge>
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">
              {t('userProfile.shopAccess.noPrimaryShop')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Permissions Card — only if shopRole exists (shop-level users) */}
      {['shop_admin', 'manager', 'staff', 'accountant', 'viewer'].includes(user.role) && (
        <Card className="border-border-primary bg-bg-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-text-primary">
              <Shield className="h-5 w-5" />
              {t('userProfile.shopAccess.accessPermissions')}
            </CardTitle>
            <CardDescription className="text-text-secondary">
              {t('userProfile.shopAccess.accessPermissionsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* shopAccess permissions — populated from API if available */}
            {(user as any).shopAccesses && (user as any).shopAccesses.length > 0 ? (
              (user as any).shopAccesses.map((access: any) => (
                <div key={access.shopId} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-text-primary">
                      {access.shopName || access.shopId}
                    </p>
                    <Badge variant={access.isActive ? 'success' : 'inactive'}>
                      {access.isActive ? t('common.active') : t('common.inactive')}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    {Object.entries(permissionCategories).map(([category, perms]) => {
                      const userPerms = perms.filter(
                        perm => access.permissions?.[perm] === true
                      )
                      if (userPerms.length === 0) return null
                      return (
                        <div key={category} className="space-y-1.5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
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
              <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                <p className="text-sm text-text-secondary">
                  {t('user.permissions.limitedAccess')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Org Admin Permissions */}
      {user.role === 'org_admin' && (
        <Card className="border-border-primary bg-bg-secondary">
          <CardHeader>
            <CardTitle className="text-text-primary">
              {t('user.rolePermissions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t('user.permissions.manageOrganization')}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t('user.permissions.createShops')}
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default RoleAccessTab