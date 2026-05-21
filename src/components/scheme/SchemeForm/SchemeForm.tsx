// FILE: src/components/scheme/SchemeForm/SchemeForm.tsx

import { useMediaQuery }    from '@/hooks/useMediaQuery'
import SchemeFormDesktop    from './SchemeForm.desktop'
import SchemeFormMobile     from './SchemeForm.mobile'
import type { SchemeFormProps } from './SchemeForm.types'

export const SchemeForm = (props: SchemeFormProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  return isDesktop
    ? <SchemeFormDesktop {...props} />
    : <SchemeFormMobile  {...props} />
}