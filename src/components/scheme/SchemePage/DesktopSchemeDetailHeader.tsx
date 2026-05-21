// FILE: src/components/scheme/SchemePage/DesktopSchemeDetailHeader.tsx

import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import {
  Settings, ChevronLeft, Users, BarChart3,
  FileText, Calendar, Activity, Play,
  Pause, Archive, CheckCircle, XCircle,
} from 'lucide-react'
import { Button }      from '@/components/ui/button'
import { Badge }       from '@/components/ui/data-display/Badge'
import { Breadcrumb }  from '@/components/ui/navigation/Breadcrumb/Breadcrumb'
import { Tabs }        from '@/components/ui/navigation/Tabs/Tabs'
import { Separator }   from '@/components/ui/layout/Separator/Separator'
import { Avatar }      from '@/components/ui/data-display/Avatar/Avatar'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { Textarea }    from '@/components/ui/textarea'
import { Label }       from '@/components/ui/label'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'
import { useSchemeActions }   from '@/hooks/scheme/useSchemeActions'
import { useAuth }     from '@/hooks/auth'
import type { Scheme } from '@/types/scheme.types'

interface DesktopSchemeDetailHeaderProps {
  scheme:           Scheme
  activeTab?:       string
  onTabChange?:     (tab: string) => void
  onBackClick?:     () => void
  onSettingsClick?: () => void
}

export const DesktopSchemeDetailHeader: React.FC<
  DesktopSchemeDetailHeaderProps
> = ({
  scheme,
  activeTab = 'overview',
  onTabChange,
  onBackClick,
  onSettingsClick,
}) => {
  const { t }             = useTranslation()
  const { can }           = usePermissionCheck()
  const { currentShopId } = useAuth()

  const [currentTab, setCurrentTab] = useState(activeTab)

  // Dialogs
  const [pauseDialog,   setPauseDialog]   = useState({ open: false, reason: '' })
  const [rejectDialog,  setRejectDialog]  = useState({ open: false, reason: '' })
  const [approveDialog, setApproveDialog] = useState({ open: false, notes:  '' })
  const [activateDialog,setActivateDialog]= useState(false)
  const [archiveDialog, setArchiveDialog] = useState(false)

  const {
    activateScheme, isActivating,
    pauseScheme,    isPausing,
    archiveScheme,  isArchiving,
    approveScheme,  isApproving,
    rejectScheme,   isRejecting,
  } = useSchemeActions(currentShopId!)

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  // ── Tabs ────────────────────────────────────
  const tabItems = [
    {
      value: 'overview',
      label: t('scheme.tabs.overview'),
      icon:  <FileText className="h-4 w-4" />,
    },
    {
      value: 'enrollments',
      label: t('scheme.tabs.enrollments'),
      icon:  <Users className="h-4 w-4" />,
    },
    {
      value: 'payments',
      label: t('scheme.tabs.payments'),
      icon:  <Activity className="h-4 w-4" />,
    },
    {
      value: 'schedule',
      label: t('scheme.tabs.schedule'),
      icon:  <Calendar className="h-4 w-4" />,
    },
    ...(can('canViewAnalytics')
      ? [{
          value: 'analytics',
          label: t('scheme.tabs.analytics'),
          icon:  <BarChart3 className="h-4 w-4" />,
        }]
      : []),
  ]

  const breadcrumbItems = [
    { label: t('scheme.title'), onClick: onBackClick },
    { label: scheme.schemeName },
  ]

  // ── Status badge colors ──────────────────────
  const statusVariants: Record<string, string> = {
    active:   'active',
    draft:    'default',
    paused:   'warning',
    expired:  'error',
    archived: 'inactive',
  }

  const approvalVariants: Record<string, string> = {
    approved: 'success',
    pending:  'warning',
    rejected: 'error',
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount)

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-0">
      <div className="border-b border-border-secondary bg-bg-secondary">
        <div className="space-y-4 px-6 py-4">

          {/* Top Row — Breadcrumb + Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackClick}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('scheme.common.backToList')}
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Breadcrumb items={breadcrumbItems} showHome={true} />
            </div>

            {/* Action Buttons */}
            {can('canManageSchemes') && (
              <div className="flex items-center gap-2">
                {/* Approve */}
                {scheme.approvalStatus === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setApproveDialog({ open: true, notes: '' })}
                      className="gap-2 border-status-success/30 text-status-success hover:bg-status-success/10"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t('scheme.actions.approve')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRejectDialog({ open: true, reason: '' })}
                      className="gap-2 border-status-error/30 text-status-error hover:bg-status-error/10"
                    >
                      <XCircle className="h-4 w-4" />
                      {t('scheme.actions.reject')}
                    </Button>
                  </>
                )}

                {/* Activate */}
                {scheme.status === 'draft' || scheme.status === 'paused' ? (
                  scheme.approvalStatus === 'approved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActivateDialog(true)}
                      className="gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {t('scheme.actions.activate')}
                    </Button>
                  )
                ) : null}

                {/* Pause */}
                {scheme.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPauseDialog({ open: true, reason: '' })}
                    className="gap-2"
                  >
                    <Pause className="h-4 w-4" />
                    {t('scheme.actions.pause')}
                  </Button>
                )}

                {/* Settings */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSettingsClick}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {t('scheme.common.settings')}
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Scheme Info Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar
                name={scheme.schemeName}
                size="xl"
                status={scheme.validity?.isActive ? 'online' : 'offline'}
              />

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-text-primary">
                      {scheme.schemeName}
                    </h1>
                    <span className="font-mono text-sm text-text-tertiary">
                      {scheme.schemeCode}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={statusVariants[scheme.status] as any}
                      size="sm"
                    >
                      {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                    </Badge>
                    <Badge
                      variant={approvalVariants[scheme.approvalStatus] as any}
                      size="sm"
                    >
                      {scheme.approvalStatus.charAt(0).toUpperCase() +
                       scheme.approvalStatus.slice(1)}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {scheme.schemeType.replace('_', ' ')}
                    </Badge>
                    {scheme.marketing?.isFeatured && (
                      <Badge variant="accent" size="sm">
                        {t('scheme.featured')}
                      </Badge>
                    )}
                  </div>

                  {scheme.description && (
                    <p className="max-w-xl text-sm text-text-secondary">
                      {scheme.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-3">
              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('scheme.installmentAmount')}
                </p>
                <p className="text-lg font-bold text-text-primary">
                  {formatCurrency(scheme.installments?.installmentAmount || 0)}
                </p>
              </div>

              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('scheme.maturityValue')}
                </p>
                <p className="text-lg font-bold text-status-success">
                  {formatCurrency(scheme.maturity?.totalMaturityValue || 0)}
                </p>
              </div>

              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('scheme.activeEnrollments')}
                </p>
                <p className="text-lg font-bold text-accent">
                  {scheme.statistics?.activeEnrollments || 0}
                </p>
              </div>

              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('scheme.totalRevenue')}
                </p>
                <p className="text-lg font-bold text-text-primary">
                  {formatCurrency(scheme.statistics?.totalRevenue || 0)}
                </p>
              </div>
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

      {/* ── DIALOGS ─────────────────────────── */}

      {/* Activate */}
      <ConfirmDialog
        open={activateDialog}
        onOpenChange={setActivateDialog}
        title={t('scheme.actions.activate')}
        description={t('scheme.confirmActivate', { name: scheme.schemeName })}
        variant="success"
        confirmLabel={t('scheme.actions.activate')}
        cancelLabel={t('common.cancel')}
        onConfirm={async () => {
          await activateScheme(scheme._id)
          setActivateDialog(false)
        }}
        loading={isActivating}
      />

      {/* Pause */}
      <ConfirmDialog
        open={pauseDialog.open}
        onOpenChange={open => setPauseDialog(prev => ({ ...prev, open }))}
        title={t('scheme.actions.pause')}
        variant="warning"
        confirmLabel={t('scheme.actions.pause')}
        cancelLabel={t('common.cancel')}
        onConfirm={async () => {
          await pauseScheme(scheme._id, pauseDialog.reason)
          setPauseDialog({ open: false, reason: '' })
        }}
        loading={isPausing}
      >
        <div className="px-6 pb-4">
          <Label className="mb-1">{t('scheme.pauseReason')}</Label>
          <Textarea
            value={pauseDialog.reason}
            onChange={e =>
              setPauseDialog(prev => ({ ...prev, reason: e.target.value }))
            }
            rows={3}
            placeholder={t('scheme.pauseReasonPlaceholder')}
          />
        </div>
      </ConfirmDialog>

      {/* Archive */}
      <ConfirmDialog
        open={archiveDialog}
        onOpenChange={setArchiveDialog}
        title={t('scheme.actions.archive')}
        description={t('scheme.confirmArchive', { name: scheme.schemeName })}
        variant="warning"
        confirmLabel={t('scheme.actions.archive')}
        cancelLabel={t('common.cancel')}
        onConfirm={async () => {
          await archiveScheme(scheme._id)
          setArchiveDialog(false)
        }}
        loading={isArchiving}
      />

      {/* Approve */}
      <ConfirmDialog
        open={approveDialog.open}
        onOpenChange={open => setApproveDialog(prev => ({ ...prev, open }))}
        title={t('scheme.actions.approve')}
        variant="success"
        confirmLabel={t('scheme.actions.approve')}
        cancelLabel={t('common.cancel')}
        onConfirm={async () => {
          await approveScheme(scheme._id, approveDialog.notes)
          setApproveDialog({ open: false, notes: '' })
        }}
        loading={isApproving}
      >
        <div className="px-6 pb-4">
          <Label className="mb-1">{t('scheme.approveNotes')}</Label>
          <Textarea
            value={approveDialog.notes}
            onChange={e =>
              setApproveDialog(prev => ({ ...prev, notes: e.target.value }))
            }
            rows={3}
            placeholder={t('scheme.approveNotesPlaceholder')}
          />
        </div>
      </ConfirmDialog>

      {/* Reject */}
      <ConfirmDialog
        open={rejectDialog.open}
        onOpenChange={open => setRejectDialog(prev => ({ ...prev, open }))}
        title={t('scheme.actions.reject')}
        variant="danger"
        confirmLabel={t('scheme.actions.reject')}
        cancelLabel={t('common.cancel')}
        onConfirm={async () => {
          await rejectScheme(scheme._id, rejectDialog.reason)
          setRejectDialog({ open: false, reason: '' })
        }}
        loading={isRejecting}
        disabled={!rejectDialog.reason.trim()}
      >
        <div className="px-6 pb-4">
          <Label className="mb-1">{t('scheme.rejectReason')} *</Label>
          <Textarea
            value={rejectDialog.reason}
            onChange={e =>
              setRejectDialog(prev => ({ ...prev, reason: e.target.value }))
            }
            rows={3}
            placeholder={t('scheme.rejectReasonPlaceholder')}
          />
        </div>
      </ConfirmDialog>
    </div>
  )
}