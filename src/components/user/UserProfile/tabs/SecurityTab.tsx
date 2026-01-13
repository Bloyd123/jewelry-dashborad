// FILE: src/pages/UserProfile/tabs/SecurityTab.tsx
// Security & Authentication Tab Component

import { validateChangePasswordForm } from '@/validators/changePasswordValidation'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useAuth } from '@/hooks/useAuth'
import { useNotification } from '@/hooks/useNotification'
import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  selectActiveSessions,
  selectIsSessionsLoading,
  selectIsRevokingSession,
} from '@/store/slices/authSlice'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
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
import {
  Enable2FAModal,
  Disable2FAModal,
  BackupCodesDisplay,
} from '@/components/user/UserProfile/UserprofileModal/2fa'
import { useTwoFactorEnabled } from '@/store/hooks/auth'
import { useAppSelector } from '@/store/hooks/base'

import { Eye, EyeOff } from 'lucide-react'
import { useEffect } from 'react'
export const SecurityTab = () => {
  const { t } = useTranslation()
  const twoFactorEnabled = useTwoFactorEnabled()
  const user = useAppSelector(state => state.auth.user)
  const [showEnableModal, setShowEnableModal] = useState(false)
  const [showDisableModal, setShowDisableModal] = useState(false)
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const backupCodes = user?.backupCodes || []
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const tokenId = useAppSelector(state => state.auth.tokenId) //

  //  : Sessions state
  const activeSessions = useAppSelector(selectActiveSessions) || []
  const isSessionsLoading = useAppSelector(selectIsSessionsLoading)
  const isRevokingSession = useAppSelector(selectIsRevokingSession)
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(
    null
  ) //
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showLogoutAllDialog, setShowLogoutAllDialog] = useState(false)
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false)
  const { changePassword, logoutAll, getSessions, revokeUserSession } =
    useAuth()
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()
  const usedCodes = user?.backupCodesUsed ?? []

  const handleEnable2FASuccess = () => {
    // Redux will update automatically from API response
    showSuccess(
      t('userProfile.security.2faEnabled'),
      t('userProfile.security.2faEnabledSuccess')
    )
  }

  const handleDisable2FASuccess = () => {
    // Redux will update automatically from API response
    showSuccess(
      t('userProfile.security.2faDisabled'),
      t('userProfile.security.2faDisabledSuccess')
    )
  }
  // Handlers
  const handleEnable2FA = () => {
    setShowEnableModal(true)
  }

  const handleDisable2FA = () => {
    setShowDisableModal(true)
  }

  const handleChangePassword = useCallback(async () => {
    // Validate form
    const validation = validateChangePasswordForm(passwordData)

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      // FIX: Check the result object
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      })

      // FIX: Handle error in result
      if (!result.success) {
        handleError(result.error, setErrors)
        return
      }

      showSuccess(
        t('userProfile.security.passwordChanged'),
        t('userProfile.security.passwordChangedSuccess')
      )

      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      // This catch is for unexpected errors
      handleError(error, setErrors)
    } finally {
      setLoading(false)
    }
  }, [passwordData, changePassword, showSuccess, handleError, t])
  //  : Fetch sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        await getSessions()
      } catch (error) {
        console.error('Failed to fetch sessions:', error)
      }
    }

    fetchSessions()
  }, [getSessions])
  //  : Handle revoke session
  const handleRevokeSession = useCallback(
    async (sessionTokenId: string) => {
      setRevokingSessionId(sessionTokenId)

      try {
        await revokeUserSession(sessionTokenId)

        showSuccess(
          t('userProfile.security.sessionRevoked'),
          t('userProfile.security.sessionRevokedSuccess')
        )
      } catch (error: any) {
        handleError(error)
      } finally {
        setRevokingSessionId(null)
      }
    },
    [revokeUserSession, showSuccess, handleError, t]
  )

  //  : Handle logout all devices
  const handleLogoutAllDevices = useCallback(async () => {
    setIsLoggingOutAll(true)

    try {
      const result = await logoutAll()

      if (result.success) {
        showSuccess(
          t('userProfile.security.logoutAllSuccess'),
          t('userProfile.security.logoutAllSuccessDesc')
        )
        // User will be redirected to login automatically by Redux
      }
    } catch (error: any) {
      handleError(error, setErrors)
      setIsLoggingOutAll(false)
    }
    // Note: Don't reset loading on success - user will be redirected
  }, [logoutAll, showSuccess, handleError, t])

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

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
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              {t('userProfile.security.currentPassword')}
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={e => {
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                  // Clear error when typing
                  if (errors.currentPassword) {
                    setErrors(prev => {
                      const newErrors = { ...prev }
                      delete newErrors.currentPassword
                      return newErrors
                    })
                  }
                }}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    current: !showPassword.current,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                {showPassword.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-2 text-sm text-status-error">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              {t('userProfile.security.newPassword')}
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={e => {
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                  // Clear error when typing
                  if (errors.newPassword) {
                    setErrors(prev => {
                      const newErrors = { ...prev }
                      delete newErrors.newPassword
                      return newErrors
                    })
                  }
                }}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({ ...showPassword, new: !showPassword.new })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                {showPassword.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-2 text-sm text-status-error">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t('userProfile.security.confirmPassword')}
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={e => {
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                  // Clear error when typing
                  if (errors.confirmPassword) {
                    setErrors(prev => {
                      const newErrors = { ...prev }
                      delete newErrors.confirmPassword
                      return newErrors
                    })
                  }
                }}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    confirm: !showPassword.confirm,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                {showPassword.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-status-error">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleChangePassword}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('common.updating')}
              </div>
            ) : (
              t('userProfile.security.updatePassword')
            )}
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
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {t('userProfile.security.twoFactorStatus')}
                </p>
                <p className="text-xs text-text-tertiary">
                  {twoFactorEnabled
                    ? t('userProfile.security.enabled')
                    : t('userProfile.security.disabled')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {twoFactorEnabled ? (
                <Badge variant="success">Enabled</Badge>
              ) : (
                <Badge variant="default">Disabled</Badge>
              )}
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={
                  twoFactorEnabled ? handleDisable2FA : handleEnable2FA
                }
              />
            </div>
          </div>

          {/* Actions when enabled */}
          {twoFactorEnabled && (
            <div className="space-y-2 border-t border-border-primary pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowBackupCodes(!showBackupCodes)}
              >
                {showBackupCodes ? 'Hide' : 'View'} Backup Codes
              </Button>

              {showBackupCodes && (
                <BackupCodesDisplay
                  codes={backupCodes}
                  usedCodes={usedCodes}
                  showUsedStatus={true}
                />
              )}
            </div>
          )}

          {/* Action when disabled */}
          {!twoFactorEnabled && (
            <Button
              variant="default"
              className="w-full"
              onClick={handleEnable2FA}
            >
              {t('userProfile.security.enableTwoFactor')}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <Enable2FAModal
        open={showEnableModal}
        onOpenChange={setShowEnableModal}
        onSuccess={handleEnable2FASuccess}
      />

      <Disable2FAModal
        open={showDisableModal}
        onOpenChange={setShowDisableModal}
        onSuccess={handleDisable2FASuccess}
      />

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
          {/* Loading State */}
          {isSessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-border-primary border-t-accent" />
            </div>
          ) : activeSessions.length === 0 ? (
            // Empty State
            <div className="py-8 text-center text-text-tertiary">
              <p>{t('userProfile.security.noActiveSessions')}</p>
            </div>
          ) : (
            // Sessions List
            <div className="space-y-3">
              {activeSessions.map((session: any) => {
                const isCurrent = session.id === tokenId
                const isRevoking = revokingSessionId === session.id

                return (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      isCurrent
                        ? 'border-border-primary bg-bg-tertiary'
                        : 'border-border-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {session.device?.includes('Mobile') ? (
                        <Smartphone
                          className={`h-5 w-5 ${
                            isCurrent
                              ? 'text-status-success'
                              : 'text-text-secondary'
                          }`}
                        />
                      ) : (
                        <Monitor
                          className={`h-5 w-5 ${
                            isCurrent
                              ? 'text-status-success'
                              : 'text-text-secondary'
                          }`}
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {session.device || 'Unknown Device'}
                          {isCurrent &&
                            ` (${t('userProfile.security.currentDevice')})`}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {session.ipAddress || 'Unknown IP'}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {t('userProfile.security.lastActive')}:{' '}
                          {new Date(session.lastUsed).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {isCurrent ? (
                      <Badge variant="success">
                        {t('userProfile.security.active')}
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={isRevoking}
                      >
                        {isRevoking ? (
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-text-secondary border-t-transparent" />
                            {t('userProfile.security.revoking')}
                          </div>
                        ) : (
                          t('userProfile.security.revoke')
                        )}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <Separator />

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowLogoutAllDialog(true)}
            disabled={isLoggingOutAll || activeSessions.length === 0}
          >
            {isLoggingOutAll ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('userProfile.security.loggingOut')}
              </div>
            ) : (
              t('userProfile.security.logoutAllDevices')
            )}
          </Button>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={showLogoutAllDialog}
        onOpenChange={setShowLogoutAllDialog}
        variant="danger"
        title="userProfile.security.logoutAllConfirmTitle"
        description="userProfile.security.logoutAllConfirmDesc"
        confirmLabel="userProfile.security.logoutAllConfirm"
        cancelLabel="common.cancel"
        onConfirm={handleLogoutAllDevices}
        loading={isLoggingOutAll}
        showIcon={true}
        closeOnConfirm={false}
        testId="logout-all-devices-dialog"
      />
    </div>
  )
}
