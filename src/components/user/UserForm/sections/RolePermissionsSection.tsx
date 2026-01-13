// FILE: src/components/user/UserForm/sections/RolePermissionsSection.tsx
// Role & Permissions Section - Role, Organization, Shop

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect'
import { AlertCircle } from 'lucide-react'
import type { FormSectionProps } from '../UserForm.types'
import { useCurrentUser } from '@/hooks/useAuth' 
export const RolePermissionsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()
const currentUser = useCurrentUser()
  // Role options
  const roleOptions = [
    // { value: 'super_admin', label: t('user.roles.superAdmin') },
    { value: 'org_admin', label: t('user.roles.orgAdmin') },
    { value: 'shop_admin', label: t('user.roles.shopAdmin') },
    { value: 'manager', label: t('user.roles.manager') },
    { value: 'staff', label: t('user.roles.staff') },
    { value: 'accountant', label: t('user.roles.accountant') },
    { value: 'viewer', label: t('user.roles.viewer') },
  ]

// ✅ TODO: Replace with actual API when ready
// const { data: organizations = [] } = useGetOrganizationsQuery()
// const { data: shops = [] } = useGetShopsQuery({ 
//   organizationId: data.organizationId 
// }, { skip: !data.organizationId })

// ✅ TEMPORARY: Use current user's org as single option
const organizationOptions = currentUser?.organizationId
  ? [
      {
        value: currentUser.organizationId,
        label: 'Current Organization', // TODO: Replace with actual org name
      },
    ]
  : []

// ✅ TEMPORARY: Empty shops (until API is ready)
const shopOptions: Array<{ value: string; label: string }> = []
// 🔜 When shop API is ready:
// const shopOptions = shops.map(shop => ({
//   value: shop._id,
//   label: shop.name || shop.displayName
// }))

  // Show/hide fields based on role
  const showOrganization = data.role && data.role !== 'super_admin'
  const showShop =
    data.role &&
    ['shop_admin', 'manager', 'staff', 'accountant', 'viewer'].includes(
      data.role
    )

  // Get role description
  const getRoleDescription = (role: string) => {
    const descriptions: Record<string, string> = {
      super_admin: t('user.roleDescriptions.superAdmin'),
      org_admin: t('user.roleDescriptions.orgAdmin'),
      shop_admin: t('user.roleDescriptions.shopAdmin'),
      manager: t('user.roleDescriptions.manager'),
      staff: t('user.roleDescriptions.staff'),
      accountant: t('user.roleDescriptions.accountant'),
      viewer: t('user.roleDescriptions.viewer'),
    }
    return descriptions[role] || ''
  }

  return (
    <div className="space-y-4">
      {/* Role Selection */}
      <div>
        <FormSelect
          name="role"
          label={t('user.role')}
          value={data.role || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.role}
          placeholder={t('user.selectRole')}
          options={roleOptions}
          required
          disabled={disabled}
        />

        {/* Role Description */}
        {data.role && (
          <div className="mt-2 flex items-start gap-2 rounded-md bg-bg-tertiary p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
            <p className="text-sm text-text-secondary">
              {getRoleDescription(data.role)}
            </p>
          </div>
        )}
      </div>

      {/* Organization Selection (Conditional) */}
      {showOrganization && (
        <FormSelect
          name="organizationId"
          label={t('user.organization')}
          value={data.organizationId || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.organizationId}
          placeholder={t('user.selectOrganization')}
          options={organizationOptions}
          required={data.role === 'org_admin'}
          disabled={disabled}
        />
      )}

      {/* Primary Shop Selection (Conditional) */}
      {showShop && (
        <FormSelect
          name="primaryShop"
          label={t('user.primaryShop')}
          value={data.primaryShop || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.primaryShop}
          placeholder={t('user.selectShop')}
          options={shopOptions}
          required
          disabled={disabled}
          helpText={t('user.primaryShopHelpText')}
        />
      )}

      {/* Role Permissions Info */}
      {data.role && (
        <div className="rounded-md border border-border-primary bg-bg-secondary p-4">
          <h4 className="mb-2 text-sm font-medium text-text-primary">
            {t('user.rolePermissions')}
          </h4>
          <ul className="space-y-1 text-sm text-text-secondary">
            {data.role === 'super_admin' && (
              <>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {t('user.permissions.fullSystemAccess')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {t('user.permissions.manageAllOrganizations')}
                </li>
              </>
            )}
            {data.role === 'org_admin' && (
              <>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {t('user.permissions.manageOrganization')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {t('user.permissions.createShops')}
                </li>
              </>
            )}
            {data.role === 'shop_admin' && (
              <>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {t('user.permissions.manageShop')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {t('user.permissions.viewReports')}
                </li>
              </>
            )}
            {['manager', 'staff', 'accountant', 'viewer'].includes(
              data.role
            ) && (
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t('user.permissions.limitedAccess')}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
