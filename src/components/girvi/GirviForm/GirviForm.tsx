// FILE: src/components/girvi/GirviForm/GirviForm.tsx

import { useMediaQuery }   from '@/hooks/useMediaQuery'
import GirviFormDesktop    from './GirviForm.desktop'
import GirviFormMobile     from './GirviForm.mobile'
import type { GirviFormProps } from './GirviForm.types'

export const GirviForm = (props: GirviFormProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  return isDesktop
    ? <GirviFormDesktop {...props} />
    : <GirviFormMobile  {...props} />
}