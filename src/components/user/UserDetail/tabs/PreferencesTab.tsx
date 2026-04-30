// FILE: src/components/user/UserDetail/tabs/PreferencesTab.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Clock, DollarSign, Calendar, Palette, Bell } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import type { User } from '@/types/user.types'

interface PreferencesTabProps {
  user: User
}

export const PreferencesTab: React.FC<PreferencesTabProps> = ({ user }) => {
  const { t } = useTranslation()

  const prefs = user.preferences

  const preferenceItems = [
    {
      icon: Globe,
      label: t('userProfile.preferences.language'),
      value: prefs?.language || 'en',
      display: {
        en: 'English',
        hi: 'हिन्दी (Hindi)',
        mr: 'मराठी (Marathi)',
        gu: 'ગુજરાતી (Gujarati)',
        ta: 'தமிழ் (Tamil)',
        te: 'తెలుగు (Telugu)',
      }[prefs?.language || 'en'] || prefs?.language,
    },
    {
      icon: Clock,
      label: t('userProfile.preferences.timezone'),
      value: prefs?.timezone || 'Asia/Kolkata',
      display: prefs?.timezone || 'Asia/Kolkata',
    },
    {
      icon: DollarSign,
      label: t('userProfile.preferences.currency'),
      value: prefs?.currency || 'INR',
      display: {
        INR: '₹ INR - Indian Rupee',
        USD: '$ USD - US Dollar',
        EUR: '€ EUR - Euro',
        GBP: '£ GBP - British Pound',
        AED: 'د.إ AED - UAE Dirham',
      }[prefs?.currency || 'INR'] || prefs?.currency,
    },
    {
      icon: Calendar,
      label: t('userProfile.preferences.dateFormat'),
      value: prefs?.dateFormat || 'DD/MM/YYYY',
      display: prefs?.dateFormat || 'DD/MM/YYYY',
    },
    {
      icon: Palette,
      label: t('userProfile.preferences.theme'),
      value: prefs?.theme || 'light',
      display: {
        light: t('userProfile.preferences.lightMode'),
        dark: t('userProfile.preferences.darkMode'),
        auto: t('userProfile.preferences.autoMode'),
      }[prefs?.theme || 'light'] || prefs?.theme,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader>
          <CardTitle className="text-text-primary">
            {t('user.preferences')}
          </CardTitle>
          <CardDescription className="text-text-secondary">
            {t('user.preferencesDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {preferenceItems.map(({ icon: Icon, label, display }) => (
              <div
                key={label}
                className="flex flex-col gap-1.5 rounded-lg border border-border-primary bg-bg-tertiary p-4"
              >
                <Label className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Label>
                <p className="text-sm font-medium text-text-primary">{display}</p>
              </div>
            ))}

            {/* Notifications */}
            <div className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-tertiary p-4">
              <div className="flex flex-col gap-1">
                <Label className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Bell className="h-3.5 w-3.5" />
                  {t('user.notifications')}
                </Label>
                <p className="text-sm text-text-tertiary">
                  {t('user.notificationsDescription')}
                </p>
              </div>
              <Badge
                variant={prefs?.notificationsEnabled ? 'success' : 'inactive'}
                size="sm"
              >
                {prefs?.notificationsEnabled ? t('common.enabled') : t('common.disabled')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PreferencesTab