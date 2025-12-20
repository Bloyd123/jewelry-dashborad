// ============================================================================
// FILE: components/ui/index.ts
// Main UI Components Barrel Export
// ============================================================================

// Loader components
export { Loader, Skeleton, Spinner } from './loader'
export type { LoaderProps, SkeletonProps, SpinnerProps } from './loader'

// Add other UI components here as you create them
export { Button } from './button'
export { Input } from './input'
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card'
export { Label } from './label'
export { Popover, PopoverTrigger, PopoverContent } from './popover'
export { Calendar } from './calendar'
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './select'
export { Textarea } from './textarea'
