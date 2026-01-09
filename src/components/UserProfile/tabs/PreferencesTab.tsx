// FILE: src/pages/UserProfile/tabs/PreferencesTab.tsx
// User Preferences Tab Component

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Clock, DollarSign, Calendar, Palette, Bell } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { dummyUser } from '@/pages/user/data'

export const PreferencesTab = () => {
  const { t } = useTranslation()
  const [preferences, setPreferences] = useState(dummyUser.preferences)

  const handleSave = () => {
    console.log('Saving preferences:', preferences)
  }

  return (
    <div className="space-y-6">
      {/* Language & Region Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('userProfile.preferences.languageRegion')}</CardTitle>
          <CardDescription>
            {t('userProfile.preferences.languageRegionDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">
                <Globe className="mr-2 inline h-4 w-4" />
                {t('userProfile.preferences.language')}
              </Label>
              <Select
                value={preferences.language}
                onValueChange={value =>
                  setPreferences({ ...preferences, language: value as any })
                }
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                  <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                  <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                  <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                  <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label htmlFor="timezone">
                <Clock className="mr-2 inline h-4 w-4" />
                {t('userProfile.preferences.timezone')}
              </Label>
              <Select
                value={preferences.timezone}
                onValueChange={value =>
                  setPreferences({ ...preferences, timezone: value })
                }
              >
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">
                    Asia/Kolkata (IST)
                  </SelectItem>
                  <SelectItem value="America/New_York">
                    America/New_York (EST)
                  </SelectItem>
                  <SelectItem value="Europe/London">
                    Europe/London (GMT)
                  </SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Format Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('userProfile.preferences.formatSettings')}</CardTitle>
          <CardDescription>
            {t('userProfile.preferences.formatSettingsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">
                <DollarSign className="mr-2 inline h-4 w-4" />
                {t('userProfile.preferences.currency')}
              </Label>
              <Select
                value={preferences.currency}
                onValueChange={value =>
                  setPreferences({ ...preferences, currency: value as any })
                }
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">₹ INR - Indian Rupee</SelectItem>
                  <SelectItem value="USD">$ USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">€ EUR - Euro</SelectItem>
                  <SelectItem value="GBP">£ GBP - British Pound</SelectItem>
                  <SelectItem value="AED">د.إ AED - UAE Dirham</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Format */}
            <div className="space-y-2">
              <Label htmlFor="dateFormat">
                <Calendar className="mr-2 inline h-4 w-4" />
                {t('userProfile.preferences.dateFormat')}
              </Label>
              <Select
                value={preferences.dateFormat}
                onValueChange={value =>
                  setPreferences({ ...preferences, dateFormat: value as any })
                }
              >
                <SelectTrigger id="dateFormat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Palette className="mr-2 inline h-5 w-5" />
            {t('userProfile.preferences.appearance')}
          </CardTitle>
          <CardDescription>
            {t('userProfile.preferences.appearanceDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">{t('userProfile.preferences.theme')}</Label>
            <Select
              value={preferences.theme}
              onValueChange={value =>
                setPreferences({ ...preferences, theme: value as any })
              }
            >
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  {t('userProfile.preferences.lightMode')}
                </SelectItem>
                <SelectItem value="dark">
                  {t('userProfile.preferences.darkMode')}
                </SelectItem>
                <SelectItem value="auto">
                  {t('userProfile.preferences.autoMode')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Bell className="mr-2 inline h-5 w-5" />
            {t('userProfile.preferences.notifications')}
          </CardTitle>
          <CardDescription>
            {t('userProfile.preferences.notificationsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                {t('userProfile.preferences.enableNotifications')}
              </p>
              <p className="text-xs text-text-tertiary">
                {t('userProfile.preferences.enableNotificationsDesc')}
              </p>
            </div>
            <Switch
              checked={preferences.notificationsEnabled}
              onCheckedChange={checked =>
                setPreferences({
                  ...preferences,
                  notificationsEnabled: checked,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">{t('common.cancel')}</Button>
        <Button onClick={handleSave}>{t('common.saveChanges')}</Button>
      </div>
    </div>
  )
}
