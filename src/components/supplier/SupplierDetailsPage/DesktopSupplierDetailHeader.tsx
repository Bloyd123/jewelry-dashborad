// FILE: src/components/supplier/SupplierDetailsPage/DesktopSupplierDetailHeader.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  Store,
  Phone,
  Mail,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Star,
  Verified,
  Download,
  RefreshCw,
  DollarSign,
  FileText,
  Activity,
  Copy,
  Check,
  MoreVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import { Breadcrumb } from '@/components/ui/navigation/Breadcrumb/Breadcrumb'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Supplier } from '@/types/supplier.types'
import type { ManagementAction } from '@/components/supplier/SupplierManagementModal/SupplierManagementModal.types'

// COPY BUTTON
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 w-6 p-0">
      {copied ? (
        <Check className="h-3 w-3 text-status-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  )
}

// RATING STARS
const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(star => (
      <Star
        key={star}
        className={`h-4 w-4 ${
          star <= rating ? 'fill-accent text-accent' : 'text-border-secondary'
        }`}
      />
    ))}
    <span className="ml-1 text-sm font-medium text-text-primary">
      {rating.toFixed(1)}
    </span>
  </div>
)

interface DesktopSupplierDetailHeaderProps {
  supplier: Supplier
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onEditClick?: () => void
  onRefetch?: () => void
  onManagementAction?: (action: ManagementAction) => void
}

export const DesktopSupplierDetailHeader: React.FC<
  DesktopSupplierDetailHeaderProps
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

  const breadcrumbItems = [
    { label: t('suppliers.title'), onClick: onBackClick },
    { label: supplier.businessName },
  ]

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
        <div className="space-y-4 px-6 py-4">
          {/* Back + Breadcrumb + Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBackClick} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                {t('common.backToList')}
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Breadcrumb items={breadcrumbItems} showHome={true} />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                {t('common.export')}
              </Button>
              <Button variant="outline" size="sm" onClick={onEditClick} className="gap-2">
                <Edit className="h-4 w-4" />
                {t('common.edit')}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onRefetch}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t('suppliers.refreshData')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onManagementAction?.('blacklist')}>
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

          <Separator />

          {/* Supplier Info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-accent/10 flex h-16 w-16 items-center justify-center rounded-lg">
                <Store className="h-8 w-8 text-accent" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-text-primary">
                    {supplier.businessName}
                  </h1>
                  {supplier.isVerified && (
                    <Verified className="h-5 w-5 text-status-success" />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-text-tertiary">{t('suppliers.supplierCode')}:</span>
                    <span className="font-mono font-medium text-text-primary">
                      {supplier.supplierCode}
                    </span>
                    <CopyButton text={supplier.supplierCode} />
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Phone className="h-3 w-3" />
                    <span>{supplier.contactPerson.phone}</span>
                  </div>
                  {supplier.contactPerson.email && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Mail className="h-3 w-3" />
                        <span>{supplier.contactPerson.email}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
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

            {/* Rating */}
            <div className="text-right">
              <div className="text-xs text-text-tertiary">{t('suppliers.overallRating')}</div>
              <RatingStars rating={supplier.rating || 0} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <Tabs
            tabs={tabItems}
            value={currentTab}
            onValueChange={handleTabChange}
            variant="underline"
            size="md"
          />
        </div>
      </div>
    </div>
  )
}

export default DesktopSupplierDetailHeader