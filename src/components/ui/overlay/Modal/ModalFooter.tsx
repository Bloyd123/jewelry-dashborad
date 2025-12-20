// ============================================================================
// FILE: src/components/ui/overlay/Modal/ModalFooter.tsx
// ============================================================================
import { cn } from '@/lib/utils'

export interface ModalFooterProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'between'
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
  align = 'right',
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 border-t border-border-primary px-6 py-4',
        alignmentClasses[align],
        className
      )}
    >
      {children}
    </div>
  )
}

ModalFooter.displayName = 'ModalFooter'
