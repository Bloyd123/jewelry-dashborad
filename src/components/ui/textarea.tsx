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
          'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background transition-colors',
          'bg-bg-secondary border-border-primary text-text-primary placeholder:text-text-tertiary',
          'focus-visible:outline-none focus-visible:ring-accent focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-tertiary',
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