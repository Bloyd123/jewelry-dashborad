// ============================================================================
// FILE: src/pages/UserProfile/tabs/ShopAccessTab.tsx
// Shop Access & Permissions Tab Component
// ============================================================================

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
import { dummyUserWithRelations } from '@/pages/user/data'

export const ShopAccessTab = () => {
  const { t } = useTranslation()

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
          {dummyUserWithRelations.primaryShopDetails ? (
            <div className="flex items-start justify-between rounded-lg border border-border-primary bg-bg-tertiary p-4">
              <div className="space-y-1">
                <p className="font-medium text-text-primary">
                  {dummyUserWithRelations.primaryShopDetails.name}
                </p>
                <p className="text-sm text-text-tertiary">
                  {t('userProfile.shopAccess.shopCode')}:{' '}
                  {dummyUserWithRelations.primaryShopDetails.code}
                </p>
                <p className="text-xs text-text-tertiary">
                  {dummyUserWithRelations.primaryShopDetails.address}
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

      {/* Shop Access & Permissions Card */}
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
          {dummyUserWithRelations.shopAccesses &&
          dummyUserWithRelations.shopAccesses.length > 0 ? (
            dummyUserWithRelations.shopAccesses.map((access: any) => (
              <div
                key={access._id}
                className="space-y-3 rounded-lg border border-border-primary p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary">
                      {access.shopId}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {t('userProfile.shopAccess.role')}:{' '}
                      <Badge variant="default">{access.role}</Badge>
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-text-primary">
                    {t('userProfile.shopAccess.permissions')}:
                  </p>

                  {/* Inventory Permissions */}
                  {access.permissions.inventory && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-text-secondary">
                        {t('userProfile.shopAccess.inventory')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {access.permissions.inventory.view && (
                          <Badge variant="outline" size="sm">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t('userProfile.shopAccess.view')}
                          </Badge>
                        )}
                        {access.permissions.inventory.create && (
                          <Badge variant="outline" size="sm">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t('userProfile.shopAccess.create')}
                          </Badge>
                        )}
                        {access.permissions.inventory.edit && (
                          <Badge variant="outline" size="sm">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t('userProfile.shopAccess.edit')}
                          </Badge>
                        )}
                        {access.permissions.inventory.delete && (
                          <Badge variant="outline" size="sm">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t('userProfile.shopAccess.delete')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sales Permissions */}
                  {access.permissions.sales && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-text-secondary">
                        {t('userProfile.shopAccess.sales')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {access.permissions.sales.view && (
                          <Badge variant="outline" size="sm">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t('userProfile.shopAccess.view')}
                          </Badge>
                        )}
                        {access.permissions.sales.create && (
                          <Badge variant="outline" size="sm">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t('userProfile.shopAccess.create')}
                          </Badge>
                        )}
                        {access.permissions.sales.edit && (
                          <Badge variant="outline" size="sm">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t('userProfile.shopAccess.edit')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Purchase Permissions */}
                  {access.permissions.purchase && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-text-secondary">
                        {t('userProfile.shopAccess.purchase')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {access.permissions.purchase.view && (
                          <Badge variant="outline" size="sm">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t('userProfile.shopAccess.view')}
                          </Badge>
                        )}
                        {access.permissions.purchase.create && (
                          <Badge variant="outline" size="sm">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t('userProfile.shopAccess.create')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
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
