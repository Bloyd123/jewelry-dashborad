// FILE: src/pages/user/AddUser/index.tsx

import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserForm } from '@/components/user/UserForm'
import type { User } from '@/types/user.types'
import type { CreateUserInput } from '@/validators/userValidator'
import { useCurrentUser, useShopAccesses } from '@/hooks/auth'
import { useGetUserByIdQuery } from '@/store/api/userApi'

const convertUserToFormData = (user: User): Partial<CreateUserInput> => {
  const allowedRoles = ['org_admin', 'shop_admin', 'manager', 'staff', 'accountant', 'viewer'] as const
  type AllowedRole = typeof allowedRoles[number]

  return {
    username: user.username,
    email: user.email,
    password: '',
    confirmPassword: '',
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: allowedRoles.includes(user.role as AllowedRole)
      ? (user.role as AllowedRole)
      : undefined,
    organizationId: user.organizationId || undefined,
    primaryShop: user.primaryShop || undefined,
    designation: user.designation,
    department: user.department,
    employeeId: user.employeeId,
    joiningDate: user.joiningDate?.toString().split('T')[0],
    salesTarget: user.salesTarget,
    commissionRate: user.commissionRate,
    preferences: user.preferences,
  }
}

export default function AddUserPage() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const isEditMode = Boolean(userId)

  const currentUser = useCurrentUser()
  const shopAccesses = useShopAccesses()
  const organizationId = currentUser?.organizationId || undefined
  const defaultPrimaryShop =
    currentUser?.primaryShop ||
    (shopAccesses.length > 0 ? shopAccesses[0].shopId : undefined)

  // Fetch user data when in edit mode
  const { data: fetchedUser, isLoading } = useGetUserByIdQuery(userId!, {
    skip: !isEditMode,
  })

  const initialData = useMemo(() => {
    if (isEditMode && fetchedUser) {
      return convertUserToFormData(fetchedUser)
    }
    return { primaryShop: defaultPrimaryShop }
  }, [fetchedUser, isEditMode, defaultPrimaryShop])

  if (isEditMode && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  return (
    <UserForm
      organizationId={organizationId}
      userId={userId}
      initialData={initialData}
      onSuccess={() => navigate('/users')}
      onCancel={() => navigate('/users')}
      mode={isEditMode ? 'edit' : 'create'}
    />
  )
}