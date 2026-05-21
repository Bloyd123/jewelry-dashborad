// FILE: src/components/ui/ToggleSwitch.tsx

import { Button } from '@/components/ui/button'
import { cn }     from '@/lib/utils'

interface ToggleSwitchProps {
  checked:    boolean
  onChange:   () => void
  disabled?:  boolean
  className?: string
}

export const ToggleSwitch = ({
  checked,
  onChange,
  disabled,
  className,
}: ToggleSwitchProps) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    onClick={onChange}
    disabled={disabled}
    className={cn(
      'relative h-6 w-11 rounded-full transition-colors p-0',
      checked
        ? 'bg-accent hover:bg-accent/90'
        : 'bg-bg-tertiary border border-border-primary hover:bg-bg-tertiary',
      className
    )}
  >
    <span
      className={cn(
        'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
        checked ? 'translate-x-5' : 'translate-x-0.5'
      )}
    />
  </Button>
)