// FILE: src/components/supplier/SupplierDetailsPage/MobileSupplierDetailHeader.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  Store,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Star,
  DollarSign,
  FileText,
  Activity,
  MoreVertical,
  RefreshCw,
   Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Supplier } from '@/types/supplier.types'
import type { ManagementAction } from '@/components/supplier/SupplierManagementModal/SupplierManagementModal.types'

interface MobileSupplierDetailHeaderProps {
  supplier: Supplier
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onEditClick?: () => void
  onRefetch?: () => void
  onManagementAction?: (action: ManagementAction) => void
}

export const MobileSupplierDetailHeader: React.FC<
  MobileSupplierDetailHeaderProps
> = ({
  supplier,
  activeTab = 'overview',
  onTabChange,
  onBackClick,
  onEditClick,
  onRefetch,
  onManagementAction,
}) => {
  const { t } = useTranslation()
  const [currentTab, setCurrentTab] = useState(activeTab)

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  const tabItems = [
    {
      value: 'overview',
      label: t('suppliers.tabs.overview'),
      icon: <Store className="h-4 w-4" />,
    },
    {
      value: 'financial',
      label: t('suppliers.tabs.financial'),
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      value: 'documents',
      label: t('suppliers.tabs.documents'),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      value: 'activity',
      label: t('suppliers.tabs.activity'),
      icon: <Activity className="h-4 w-4" />,
    },
  ]

  return (
    <div className="space-y-0">
      <div className="border-b border-border-secondary bg-bg-secondary">
        <div className="space-y-3 px-4 py-3">

          {/* Back + Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="gap-2 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('common.backToList')}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEditClick}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                      <DropdownMenuItem>
    <Download className="mr-2 h-4 w-4" />
    {t('common.export')}
  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onRefetch}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t('suppliers.refreshData')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onManagementAction?.('blacklist')}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    {t('suppliers.blacklisttext')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-status-error"
                    onClick={() => onManagementAction?.('delete')}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('common.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Supplier Info */}
          <div className="flex items-start gap-3">
            <div className="bg-accent/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <Store className="h-6 w-6 text-accent" />
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="space-y-1">
                <h1 className="truncate text-lg font-bold text-text-primary">
                  {supplier.businessName}
                </h1>
                <div className="flex items-center gap-2 text-sm text-text-tertiary">
                  <span className="font-mono">{supplier.supplierCode}</span>
                  <span>•</span>
                  <span>{supplier.contactPerson.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {supplier.isActive ? (
                  <Badge variant="success" size="sm" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {t('common.active')}
                  </Badge>
                ) : (
                  <Badge variant="error" size="sm" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {t('suppliers.inactive')}
                  </Badge>
                )}
                {supplier.isPreferred && (
                  <Badge variant="info" size="sm" className="gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {t('suppliers.preferredtext')}
                  </Badge>
                )}
                <Badge variant="default" size="sm" className="capitalize">
                  {supplier.supplierType}
                </Badge>
                <Badge variant="outline" size="sm" className="capitalize">
                  {supplier.supplierCategory}
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-bg-primary p-2 text-center">
              <p className="text-xs text-text-tertiary">
                {t('suppliers.totalPurchases')}
              </p>
              <p className="text-sm font-semibold text-text-primary">
                ₹{supplier.totalPurchases?.toLocaleString('en-IN') || 0}
              </p>
            </div>
            <div className="rounded-lg bg-bg-primary p-2 text-center">
              <p className="text-xs text-text-tertiary">
                {t('suppliers.totalDue')}
              </p>
              <p className="text-sm font-semibold text-status-error">
                ₹{supplier.totalDue?.toLocaleString('en-IN') || 0}
              </p>
            </div>
            <div className="rounded-lg bg-bg-primary p-2 text-center">
              <p className="text-xs text-text-tertiary">
                {t('suppliers.overallRating')}
              </p>
              <p className="text-sm font-semibold text-accent">
                {supplier.rating?.toFixed(1) || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto px-4">
          <Tabs
            tabs={tabItems}
            value={currentTab}
            onValueChange={handleTabChange}
            variant="underline"
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}

export default MobileSupplierDetailHeader