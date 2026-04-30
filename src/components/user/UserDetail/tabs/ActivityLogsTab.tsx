// FILE: src/components/user/UserDetail/tabs/ActivityLogsTab.tsx

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity, Clock, Filter, LogIn, LogOut, Edit, Shield } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { User } from '@/types/user.types'
import { useGetUserActivityLogsQuery } from '@/store/api/userApi'

interface ActivityLogsTabProps {
  user: User
}

export const ActivityLogsTab: React.FC<ActivityLogsTabProps> = ({ user }) => {
  const { t } = useTranslation()

  const [actionFilter, setActionFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7days')
  const [appliedFilters, setAppliedFilters] = useState({
    action: 'all',
    dateRange: '7days',
  })

  const { data, isLoading, refetch } = useGetUserActivityLogsQuery(
    {
      userId: user._id,
      action: appliedFilters.action !== 'all' ? appliedFilters.action : undefined,
      dateRange: appliedFilters.dateRange,
    },
    { skip: !user._id }
  )

  const logs = data?.data?.logs || data?.data || []

  const handleApplyFilters = () => {
    setAppliedFilters({ action: actionFilter, dateRange })
  }

  const getActivityIcon = (action: string) => {
    if (action.includes('login'))   return <LogIn className="h-5 w-5 text-status-success" />
    if (action.includes('logout'))  return <LogOut className="h-5 w-5 text-text-tertiary" />
    if (action.includes('update') || action.includes('profile')) return <Edit className="h-5 w-5 text-status-info" />
    if (action.includes('2fa') || action.includes('password'))   return <Shield className="h-5 w-5 text-status-warning" />
    return <Activity className="h-5 w-5 text-text-tertiary" />
  }

  const getActionBadgeVariant = (action: string): any => {
    if (action.includes('login'))    return 'success'
    if (action.includes('logout'))   return 'default'
    if (action.includes('update'))   return 'info'
    if (action.includes('password')) return 'warning'
    if (action.includes('delete'))   return 'danger'
    return 'default'
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">

      {/* Filters */}
      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <Filter className="h-5 w-5" />
            {t('userProfile.activityLogs.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm text-text-primary">
                {t('userProfile.activityLogs.actionType')}
              </Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t('userProfile.activityLogs.allActions')}
                  </SelectItem>
                  <SelectItem value="login">
                    {t('userProfile.activityLogs.login')}
                  </SelectItem>
                  <SelectItem value="logout">
                    {t('userProfile.activityLogs.logout')}
                  </SelectItem>
                  <SelectItem value="profile_update">
                    {t('userProfile.activityLogs.profileUpdate')}
                  </SelectItem>
                  <SelectItem value="password_change">
                    Password Change
                  </SelectItem>
                  <SelectItem value="user_updated">
                    User Updated
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-text-primary">
                {t('userProfile.activityLogs.dateRange')}
              </Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">
                    {t('userProfile.activityLogs.today')}
                  </SelectItem>
                  <SelectItem value="7days">
                    {t('userProfile.activityLogs.last7Days')}
                  </SelectItem>
                  <SelectItem value="30days">
                    {t('userProfile.activityLogs.last30Days')}
                  </SelectItem>
                  <SelectItem value="all">
                    {t('userProfile.activityLogs.allTime')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleApplyFilters}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-text-secondary border-t-transparent" />
                    {t('common.loading')}
                  </div>
                ) : (
                  t('userProfile.activityLogs.applyFilters')
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-full">
            <Activity className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              {t('userProfile.activityLogs.recentActivity')}
            </p>
            <p className="text-xs text-text-secondary">
              {t('userProfile.activityLogs.recentActivityDesc')} — {Array.isArray(logs) ? logs.length : 0} {t('common.records')}
            </p>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <Card className="border-border-primary bg-bg-secondary">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-border-primary border-t-accent" />
            </div>
          ) : Array.isArray(logs) && logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log: any, index: number) => (
                <div
                  key={log._id || index}
                  className="flex items-start gap-4 rounded-lg border border-border-primary bg-bg-primary p-4 transition-colors hover:bg-bg-tertiary"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-bg-secondary">
                    {getActivityIcon(log.action)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getActionBadgeVariant(log.action)} size="sm">
                        {log.action}
                      </Badge>
                      {log.module && (
                        <span className="text-xs text-text-tertiary">
                          {log.module}
                        </span>
                      )}
                    </div>
                    {log.description && (
                      <p className="text-sm text-text-primary">{log.description}</p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-text-tertiary">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                      {log.ipAddress && (
                        <>
                          <span>•</span>
                          <span>{log.ipAddress}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="mb-3 h-10 w-10 text-text-tertiary" />
              <p className="text-sm text-text-tertiary">
                {t('userProfile.activityLogs.noActivity')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ActivityLogsTab