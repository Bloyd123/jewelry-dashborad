// ============================================================================
// FILE: src/components/ui/overlay/Modal/ModalBody.tsx
// ============================================================================
import { cn } from '@/lib/utils'

export interface ModalBodyProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className,
  noPadding = false,
}) => {
  return (
    <div
      className={cn('overflow-y-auto', !noPadding && 'px-6 py-4', className)}
    >
      {children}
    </div>
  )
}

ModalBody.displayName = 'ModalBody'
