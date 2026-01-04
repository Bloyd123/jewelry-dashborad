// ============================================================================
// FILE: src/pages/UserProfile/tabs/PersonalInfoTab.tsx
// Personal Information Tab Component
// ============================================================================

import { useState } from 'react'
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
import { dummyUser } from '@/pages/user/data'

export const PersonalInfoTab = () => {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(dummyUser)

  const handleSave = () => {
    console.log('Saving personal info:', formData)
    setIsEditing(false)
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
            name={formData.fullName}
            size="xl"
          />
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              {t('userProfile.personalInfo.changePhoto')}
            </Button>
            <Button variant="ghost" size="sm">
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
              <Button onClick={handleSave} size="sm">
                <Save className="mr-2 h-4 w-4" />
                {t('common.save')}
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                size="sm"
              >
                {t('common.cancel')}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">
                <User className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.username')}
              </Label>
              <Input
                id="username"
                value={formData.username}
                disabled={!isEditing}
                onChange={e =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled={!isEditing}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* First Name */}
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
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                {t('userProfile.personalInfo.lastName')}
              </Label>
              <Input
                id="lastName"
                value={formData.lastName || ''}
                disabled={!isEditing}
                onChange={e =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.phone')}
              </Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                disabled={!isEditing}
                onChange={e =>
                  setFormData({ ...formData, phone: e.target.value })
                }
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
            {/* Designation */}
            <div className="space-y-2">
              <Label htmlFor="designation">
                <Briefcase className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.designation')}
              </Label>
              <Input
                id="designation"
                value={formData.designation || ''}
                disabled={!isEditing}
                onChange={e =>
                  setFormData({ ...formData, designation: e.target.value })
                }
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">
                <Building2 className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.department')}
              </Label>
              <Select
                value={formData.department}
                disabled={!isEditing}
                onValueChange={value =>
                  setFormData({ ...formData, department: value as any })
                }
              >
                <SelectTrigger id="department">
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

            {/* Employee ID */}
            <div className="space-y-2">
              <Label htmlFor="employeeId">
                <Hash className="mr-2 inline h-4 w-4" />
                {t('userProfile.personalInfo.employeeId')}
              </Label>
              <Input
                id="employeeId"
                value={formData.employeeId || ''}
                disabled
              />
            </div>

            {/* Joining Date */}
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
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
