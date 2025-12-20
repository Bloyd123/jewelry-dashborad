// ============================================================================
// FILE: src/components/ui/textarea.tsx
// Theme-based Textarea Component
// ============================================================================

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'ring-offset-background flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm transition-colors',
          'border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-tertiary',
          'focus-visible:outline-none focus-visible:ring-accent focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:bg-bg-tertiary disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
