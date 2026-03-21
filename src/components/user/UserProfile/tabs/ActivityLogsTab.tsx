// FILE: src/pages/UserProfile/tabs/ActivityLogsTab.tsx
// Activity Logs Tab Component

import { useTranslation } from 'react-i18next'
import { useState, useEffect, useCallback } from 'react'
import * as authService from '@/api/services/authService'
import { Clock, Activity, Filter } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const ActivityLogsTab = () => {
  const { t } = useTranslation()
  
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [actionFilter, setActionFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7days')

  const fetchLogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await authService.getActivityLogs({ 
        action: actionFilter, 
        dateRange 
      })
      // ✅ Response structure handle karo
      const logsData = response?.data?.data || response?.data || []
      setLogs(Array.isArray(logsData) ? logsData : [])
    } catch (error) {
      console.error('Activity logs fetch error:', error)
      setLogs([])
    } finally {
      setIsLoading(false)
    }
  }, [actionFilter, dateRange])

  // ✅ Mount hone par fetch karo
  useEffect(() => {
    fetchLogs()
  }, [])
  const getActionBadgeVariant = (action: string) => {
    if (action === 'login') return 'success'
    if (action === 'profile_update') return 'info'
    if (action === 'logout') return 'default'
    return 'default'
  }

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Filter className="mr-2 inline h-5 w-5" />
            {t('userProfile.activityLogs.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                {t('userProfile.activityLogs.actionType')}
              </label>
              <Select 
  value={actionFilter}
  onValueChange={setActionFilter}
>
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
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                {t('userProfile.activityLogs.dateRange')}
              </label>
              <Select 
  value={dateRange}
  onValueChange={setDateRange}
>
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
  onClick={fetchLogs}
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

      {/* Activity Logs Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Activity className="mr-2 inline h-5 w-5" />
            {t('userProfile.activityLogs.recentActivity')}
          </CardTitle>
          <CardDescription>
            {t('userProfile.activityLogs.recentActivityDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
{isLoading ? (
  <div className="flex items-center justify-center py-8">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-border-primary border-t-accent" />
  </div>
) : logs.length > 0 ? (
  <div className="space-y-4">
    {logs.map((log: any) => (
      <div
        key={log._id}
        className="flex items-start gap-4 rounded-lg border border-border-primary p-4 transition-colors hover:bg-bg-tertiary"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-tertiary">
          <Clock className="h-5 w-5 text-text-secondary" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant={getActionBadgeVariant(log.action)}>
              {log.action}
            </Badge>
            <span className="text-sm text-text-secondary">
              {log.module}
            </span>
          </div>
          <p className="text-sm text-text-primary">
            {log.description}
          </p>
          <p className="text-xs text-text-tertiary">
            {new Date(log.createdAt).toLocaleString()} 
          </p>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-center text-sm text-text-tertiary">
    {t('userProfile.activityLogs.noActivity')}
  </p>
)}
        </CardContent>
      </Card>
    </div>
  )
}
