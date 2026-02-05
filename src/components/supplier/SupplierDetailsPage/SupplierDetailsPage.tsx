import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  Store,
  Phone,
  Mail,
  Settings,
  MoreVertical,
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
} from 'lucide-react'

// IMPORTS - Types

import type { Supplier } from '@/types/supplier.types'

// IMPORTS - Dummy Data

// import { dummySupplier } from '@/pages/suppliers/data'
import { useNavigate, useParams } from 'react-router-dom'
import { useSupplierById } from '@/hooks/supplier'

// IMPORTS - Reusable Components

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

// IMPORTS - Tab Components (Your provided components)

import SupplierOverviewTab from '@/components/supplier/SupplierDetailsPage/tabs/OverviewTab'
import SupplierFinancialTab from '@/components/supplier/SupplierDetailsPage/tabs/FinancialTab'
import SupplierDocumentsTab from '@/components/supplier/SupplierDetailsPage/tabs/DocumentsTab'
import { SupplierManagementModal } from '@/components/supplier/SupplierManagementModal'
import type { ManagementAction } from '@/components/supplier/SupplierManagementModal/SupplierManagementModal.types'
import { useAuth } from '@/hooks/auth'


// COPY BUTTON COMPONENT

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-6 w-6 p-0"
    >
      {copied ? (
        <Check className="h-3 w-3 text-status-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  )
}

// RATING STARS COMPONENT

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
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
}

// MAIN 

const SupplierDetailPage: React.FC = () => {
  const { supplierId } = useParams<{ supplierId: string }>()
const navigate = useNavigate()
  const { currentShopId } = useAuth()
  


if (!currentShopId) {
  return (
    <div className="p-6 text-status-error">
      No shop selected
    </div>
  )
}

const shopId = currentShopId

const {
  supplier,
  isLoading,
  error,
  refetch,
} = useSupplierById(shopId, supplierId!)


  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false)
  const [managementAction, setManagementAction] =
    useState<ManagementAction | null>(null)
const handleManagementSuccess = async () => {
  await refetch()
  setIsManagementModalOpen(false)
  setManagementAction(null)
}

  if (isLoading) {
  return <div className="p-6">Loading supplier...</div>
}

if (error || !supplier) {
  return (
    <div className="p-6 text-status-error">
      Failed to load supplier
    </div>
  )
}

  const supplierData = supplier 


const breadcrumbItems = [
  { 
    label: t('suppliers.title'), 
    onClick: () => navigate('/suppliers')  
  },
  { label: supplierData.businessName },
]

  // Tab items
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

  // Handle back navigation
const handleBackClick = () => {
  navigate('/suppliers')
}



  // RENDER

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* 
          HEADER SECTION
           */}
      <div className="space-y-0">
        <div className="border-b border-border-secondary bg-bg-secondary">
          <div className="space-y-4 px-6 py-4">
            {/* Back Button and Breadcrumb */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackClick}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('common.backToList')}
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Breadcrumb items={breadcrumbItems} showHome={true} />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  {t('common.export')}
                </Button>
                <Button variant="outline" size="sm" className="gap-2"
                 onClick={() => navigate(`/suppliers/edit/${supplierId}`)} 
                >
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
 <DropdownMenuItem onClick={refetch}>
  <RefreshCw className="mr-2 h-4 w-4" />
  {t('suppliers.refreshData')}
</DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        setManagementAction('blacklist')
                        setIsManagementModalOpen(true)
                      }}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      {t('suppliers.blacklisttext')}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-status-error"
                      onClick={() => {
                        setManagementAction('delete')
                        setIsManagementModalOpen(true)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('common.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Separator />

            {/* Supplier Info Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="bg-accent/10 flex h-16 w-16 items-center justify-center rounded-lg">
                  <Store className="h-8 w-8 text-accent" />
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-text-primary">
                      {supplierData.businessName}
                    </h1>
                    {supplierData.isVerified && (
                      <Verified className="h-5 w-5 text-status-success" />
                    )}
                  </div>

                  {/* Supplier Code & Contact */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-text-tertiary">
                        {t('suppliers.supplierCode')}:
                      </span>
                      <span className="font-mono font-medium text-text-primary">
                        {supplierData.supplierCode}
                      </span>
                      <CopyButton text={supplierData.supplierCode} />
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Phone className="h-3 w-3" />
                      <span>{supplierData.contactPerson.phone}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Mail className="h-3 w-3" />
                      <span>{supplierData.contactPerson.email}</span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {supplierData.isActive ? (
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

                    {supplierData.isPreferred && (
                      <Badge variant="info" size="sm" className="gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {t('suppliers.preferredtext')}
                      </Badge>
                    )}

                    <Badge variant="default" size="sm" className="capitalize">
                      {supplierData.supplierType}
                    </Badge>

                    <Badge variant="outline" size="sm" className="capitalize">
                      {supplierData.supplierCategory}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Rating Display */}
              <div className="text-right">
                <div className="text-xs text-text-tertiary">
                  {t('suppliers.overallRating')}
                </div>
                <RatingStars rating={supplierData.rating || 0} />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6">
            <Tabs
              tabs={tabItems}
              value={activeTab}
              onValueChange={setActiveTab}
              variant="underline"
              size="md"
            />
          </div>
        </div>
      </div>

      {/* 
          TAB CONTENT SECTION
           */}
      <div className="p-6">
{activeTab === 'overview' && (
  <SupplierOverviewTab supplier={supplierData} />
)}

        {activeTab === 'financial' && <SupplierFinancialTab supplier={supplierData}  />}
        {activeTab === 'documents' && <SupplierDocumentsTab />}
        {/* {activeTab === 'activity' && <SupplierActivityTab />}  */}
      </div>
      <SupplierManagementModal
        open={isManagementModalOpen}
        onOpenChange={setIsManagementModalOpen}
        supplier={supplierData}
        action={managementAction}
        onSuccess={handleManagementSuccess}
      />
    </div>
  )
}

export default SupplierDetailPage
