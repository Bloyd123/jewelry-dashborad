// FILE: src/components/user/UserForm/UserForm.tsx
// Main UserForm Component (Route Handler - Desktop/Mobile Switcher)

import { useMediaQuery } from '@/hooks/useMediaQuery'
import UserFormDesktop from './UserForm.desktop'
import UserFormMobile from './UserForm.mobile'
import type { UserFormProps } from './UserForm.types'

export const UserForm = (props: UserFormProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <UserFormDesktop {...props} />
  ) : (
    <UserFormMobile {...props} />
  )
}