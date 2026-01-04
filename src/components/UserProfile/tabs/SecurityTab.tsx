// ============================================================================
// FILE: src/pages/UserProfile/tabs/SecurityTab.tsx
// Security & Authentication Tab Component
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Lock,
  Smartphone,
  Monitor,
  CheckCircle2,
  XCircle,
  Shield,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import { dummyUser } from '@/pages/user/data'

export const SecurityTab = () => {
  const { t } = useTranslation()
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChangePassword = () => {
    console.log('Changing password:', passwordData)
  }

  return (
    <div className="space-y-6">
      {/* Verification Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('userProfile.security.verificationStatus')}</CardTitle>
          <CardDescription>
            {t('userProfile.security.verificationStatusDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-status-success" />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {t('userProfile.security.emailVerified')}
                </p>
                <p className="text-xs text-text-tertiary">{dummyUser.email}</p>
              </div>
            </div>
            <Badge variant="success">{t('common.verified')}</Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {dummyUser.isPhoneVerified ? (
                <CheckCircle2 className="h-5 w-5 text-status-success" />
              ) : (
                <XCircle className="h-5 w-5 text-status-error" />
              )}
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {t('userProfile.security.phoneVerified')}
                </p>
                <p className="text-xs text-text-tertiary">{dummyUser.phone}</p>
              </div>
            </div>
            {dummyUser.isPhoneVerified ? (
              <Badge variant="success">{t('common.verified')}</Badge>
            ) : (
              <Button variant="outline" size="sm">
                {t('userProfile.security.verifyNow')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Lock className="mr-2 inline h-5 w-5" />
            {t('userProfile.security.changePassword')}
          </CardTitle>
          <CardDescription>
            {t('userProfile.security.changePasswordDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              {t('userProfile.security.currentPassword')}
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={e =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">
              {t('userProfile.security.newPassword')}
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={e =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t('userProfile.security.confirmPassword')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={e =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          <Button onClick={handleChangePassword} className="w-full">
            {t('userProfile.security.updatePassword')}
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Shield className="mr-2 inline h-5 w-5" />
            {t('userProfile.security.twoFactorAuth')}
          </CardTitle>
          <CardDescription>
            {t('userProfile.security.twoFactorAuthDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {t('userProfile.security.twoFactorStatus')}
                </p>
                <p className="text-xs text-text-tertiary">
                  {t('userProfile.security.twoFactorStatusDesc')}
                </p>
              </div>
            </div>
            <Switch checked={dummyUser.twoFactorEnabled} />
          </div>

          {!dummyUser.twoFactorEnabled && (
            <Button variant="outline" className="w-full">
              {t('userProfile.security.enableTwoFactor')}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Monitor className="mr-2 inline h-5 w-5" />
            {t('userProfile.security.activeSessions')}
          </CardTitle>
          <CardDescription>
            {t('userProfile.security.activeSessionsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* Current Session */}
            <div className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-tertiary p-3">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-status-success" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {t('userProfile.security.currentDevice')}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {dummyUser.lastLoginIP}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {t('userProfile.security.lastActive')}:{' '}
                    {new Date(dummyUser.lastLogin!).toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge variant="success">
                {t('userProfile.security.active')}
              </Badge>
            </div>

            {/* Dummy other sessions */}
            <div className="flex items-center justify-between rounded-lg border border-border-primary p-3">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-text-secondary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Mobile Device
                  </p>
                  <p className="text-xs text-text-tertiary">192.168.1.105</p>
                  <p className="text-xs text-text-tertiary">
                    {t('userProfile.security.lastActive')}: 2 hours ago
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {t('userProfile.security.revoke')}
              </Button>
            </div>
          </div>

          <Separator />

          <Button variant="destructive" className="w-full">
            {t('userProfile.security.logoutAllDevices')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
