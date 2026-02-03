// FILE: src/pages/UserProfile/tabs/PersonalInfoTab.tsx
// Personal Information Tab Component
//  FIXED: Uses userSlice instead of authSlice, proper state management

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building2,
  Hash,
  Save,
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
import { Avatar } from '@/components/ui/data-display/Avatar/Avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppSelector } from '@/store/hooks/base'
import { useAuth } from '@/hooks/auth'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { UpdateProfileRequest } from '@/types'

//  NEW: Import from userSlice
import { selectUserProfile } from '@/store/slices/userSlice'

export const PersonalInfoTab = () => {
  const { t } = useTranslation()

  //  FIXED: Get user from userSlice instead of authSlice
  const user = useAppSelector(selectUserProfile)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    designation: user?.designation || '',
    department: user?.department || 'other',
    employeeId: user?.employeeId || '',
    joiningDate: user?.joiningDate || null,
    profileImage: user?.profileImage || '',
  })

  const { updateProfile } = useAuth()
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()
  const [isLoading, setIsLoading] = useState(false)

  //  FIXED: Compute fullName properly
  const fullName =
    user?.fullName ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    'User'

  //  FIXED: Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        designation: user.designation || '',
        department: user.department || 'other',
        employeeId: user.employeeId || '',
        joiningDate: user.joiningDate || null,
        profileImage: user.profileImage || '',
      })
    }
  }, [user])

  //  FIXED: Cancel handler resets to original user data
  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        designation: user.designation || '',
        department: user.department || 'other',
        employeeId: user.employeeId || '',
        joiningDate: user.joiningDate || null,
        profileImage: user.profileImage || '',
      })
    }
    setIsEditing(false)
  }

  //  FIXED: Save handler with proper error handling
  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Only send allowed fields (matching backend validation)
      const updateData: UpdateProfileRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        designation: formData.designation,
        // profileImage: formData.profileImage, // Uncomment when image upload is ready
      }

      await updateProfile(updateData)

      showSuccess(
        t('userProfile.personalInfo.updateSuccess'),
        t('userProfile.personalInfo.profileUpdated')
      )
      setIsEditing(false)
    } catch (error: any) {
      console.error('Profile update error:', error)
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('userProfile.personalInfo.profilePicture')}</CardTitle>
          <CardDescription>
            {t('userProfile.personalInfo.profilePictureDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar
            src={formData.profileImage || undefined}
            name={fullName}
            size="xl"
          />
          <div className="flex gap-3">
            <Button variant="outline" size="sm" disabled>
              {t('userProfile.personalInfo.changePhoto')}
            </Button>
            <Button variant="ghost" size="sm" disabled>
              {t('userProfile.personalInfo.removePhoto')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('userProfile.personalInfo.basicInfo')}</CardTitle>
            <CardDescription>
              {t('userProfile.personalInfo.basicInfoDesc')}
            </CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} size="sm">
              {t('common.edit')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('common.saving')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('common.save')}
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Username - READ ONLY */}
            <div className="space-y-2">
              <Label htmlFor="username">
                <User className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.username')}
              </Label>
              <Input
                id="username"
                value={formData.username}
                disabled={true}
                className="cursor-not-allowed bg-bg-tertiary"
              />
            </div>

            {/* Email - READ ONLY */}
            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled={true}
                className="cursor-not-allowed bg-bg-tertiary"
              />
            </div>

            {/* First Name - EDITABLE */}
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {t('userProfile.personalInfo.firstName')}
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                disabled={!isEditing}
                onChange={e =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder={t('userProfile.personalInfo.firstNamePlaceholder')}
              />
            </div>

            {/* Last Name - EDITABLE */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                {t('userProfile.personalInfo.lastName')}
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                disabled={!isEditing}
                onChange={e =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder={t('userProfile.personalInfo.lastNamePlaceholder')}
              />
            </div>

            {/* Phone - EDITABLE */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.phone')}
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                disabled={!isEditing}
                onChange={e =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="9999999999"
                maxLength={10}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('userProfile.personalInfo.professionalInfo')}
          </CardTitle>
          <CardDescription>
            {t('userProfile.personalInfo.professionalInfoDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Designation - EDITABLE */}
            <div className="space-y-2">
              <Label htmlFor="designation">
                <Briefcase className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.designation')}
              </Label>
              <Input
                id="designation"
                value={formData.designation}
                disabled={!isEditing}
                onChange={e =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                placeholder={t(
                  'userProfile.personalInfo.designationPlaceholder'
                )}
              />
            </div>

            {/* Department - READ ONLY */}
            <div className="space-y-2">
              <Label htmlFor="department">
                <Building2 className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.department')}
              </Label>
              <Select value={formData.department} disabled={true}>
                <SelectTrigger
                  id="department"
                  className="cursor-not-allowed bg-bg-tertiary"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">
                    {t('departments.sales')}
                  </SelectItem>
                  <SelectItem value="purchase">
                    {t('departments.purchase')}
                  </SelectItem>
                  <SelectItem value="inventory">
                    {t('departments.inventory')}
                  </SelectItem>
                  <SelectItem value="accounts">
                    {t('departments.accounts')}
                  </SelectItem>
                  <SelectItem value="management">
                    {t('departments.management')}
                  </SelectItem>
                  <SelectItem value="workshop">
                    {t('departments.workshop')}
                  </SelectItem>
                  <SelectItem value="quality_check">
                    {t('departments.quality_check')}
                  </SelectItem>
                  <SelectItem value="customer_service">
                    {t('departments.customer_service')}
                  </SelectItem>
                  <SelectItem value="other">
                    {t('departments.other')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employee ID - READ ONLY */}
            <div className="space-y-2">
              <Label htmlFor="employeeId">
                <Hash className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.employeeId')}
              </Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                disabled
                className="cursor-not-allowed bg-bg-tertiary"
              />
            </div>

            {/* Joining Date - READ ONLY */}
            <div className="space-y-2">
              <Label htmlFor="joiningDate">
                <Calendar className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.joiningDate')}
              </Label>
              <Input
                id="joiningDate"
                type="date"
                value={
                  formData.joiningDate
                    ? new Date(formData.joiningDate).toISOString().split('T')[0]
                    : ''
                }
                disabled
                className="cursor-not-allowed bg-bg-tertiary"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
