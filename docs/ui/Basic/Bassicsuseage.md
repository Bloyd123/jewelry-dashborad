# Form & Input Components Developer Guide

## Overview

Comprehensive guide for form, input, and interactive components built with Radix UI primitives and theme-aware styling. All components support dark mode and are fully accessible.

## Table of Contents
1. [Button Component](#button-component)
2. [Input Component](#input-component)
3. [Textarea Component](#textarea-component)
4. [Label Component](#label-component)
5. [Select Component](#select-component)
6. [Dropdown Menu Component](#dropdown-menu-component)
7. [Calendar Component](#calendar-component)
9. [Card Component](#card-component)
8. [Popover Component](#popover-component)
9. [Form Patterns](#form-patterns)
10. [Best Practices](#best-practices)
11. [Accessibility](#accessibility)
12. [Testing](#testing)

---

## Button Component

### Import

```typescript
import { Button } from '@/components/ui/button'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Visual style |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `asChild` | `boolean` | `false` | Render as child element (Slot) |
| `disabled` | `boolean` | `false` | Disable button |
| ...rest | `ButtonHTMLAttributes` | - | All standard button props |

### Variants

#### default
Primary accent color button for main actions.
```tsx
<Button>Save Changes</Button>
<Button variant="default">Submit</Button>
```

#### destructive
Red button for dangerous/destructive actions.
```tsx
<Button variant="destructive">Delete Account</Button>
<Button variant="destructive">Remove Item</Button>
```

#### outline
Bordered button with transparent background.
```tsx
<Button variant="outline">Cancel</Button>
<Button variant="outline">View Details</Button>
```

#### secondary
Subtle button with secondary background.
```tsx
<Button variant="secondary">Draft</Button>
<Button variant="secondary">Secondary Action</Button>
```

#### ghost
Minimal button with hover effect only.
```tsx
<Button variant="ghost">Learn More</Button>
<Button variant="ghost">Skip</Button>
```

#### link
Text button with underline on hover.
```tsx
<Button variant="link">Terms of Service</Button>
<Button variant="link">Read More</Button>
```

### Sizes

```tsx
<Button size="sm">Small Button</Button>
<Button size="default">Default Button</Button>
<Button size="lg">Large Button</Button>
<Button size="icon">
  <Plus className="h-4 w-4" />
</Button>
```

### Usage Examples

#### Basic Button

```tsx
<Button onClick={handleSubmit}>
  Submit
</Button>
```

#### Button with Icon

```tsx
import { Plus, Download, Trash2 } from 'lucide-react'

<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>

<Button variant="outline">
  <Download className="mr-2 h-4 w-4" />
  Download
</Button>

<Button variant="destructive">
  <Trash2 className="mr-2 h-4 w-4" />
  Delete
</Button>
```

#### Icon-only Button

```tsx
<Button size="icon" variant="ghost">
  <Settings className="h-4 w-4" />
</Button>

<Button size="icon" variant="outline">
  <MoreVertical className="h-4 w-4" />
</Button>
```

#### Loading State

```tsx
import { Loader2 } from 'lucide-react'

<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Processing...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

#### As Link (using asChild)

```tsx
import { Link } from 'react-router-dom'

<Button asChild>
  <Link to="/dashboard">Go to Dashboard</Link>
</Button>

<Button asChild variant="outline">
  <a href="https://example.com" target="_blank">
    External Link
  </a>
</Button>
```

#### Button Group

```tsx
<div className="flex gap-2">
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</div>

<div className="inline-flex rounded-md shadow-sm">
  <Button variant="outline" className="rounded-r-none">
    Previous
  </Button>
  <Button variant="outline" className="rounded-l-none">
    Next
  </Button>
</div>
```

---

## Input Component

### Import

```typescript
import { Input } from '@/components/ui/input'
```

### Props

Extends all standard HTML input attributes.

### Usage Examples

#### Basic Input

```tsx
<Input 
  type="text" 
  placeholder="Enter your name"
/>
```

#### Controlled Input

```tsx
const [value, setValue] = useState('')

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Search..."
/>
```

#### Input with Label

```tsx
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="you@example.com"
  />
</div>
```

#### Different Input Types

```tsx
// Text
<Input type="text" placeholder="Enter text" />

// Email
<Input type="email" placeholder="your@email.com" />

// Password
<Input type="password" placeholder="••••••••" />

// Number
<Input type="number" placeholder="0" min={0} max={100} />

// Date
<Input type="date" />

// File
<Input type="file" />
```

#### Input with Icon

```tsx
import { Search, Mail, Lock } from 'lucide-react'

<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
  <Input className="pl-10" placeholder="Search..." />
</div>

<div className="relative">
  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
  <Input type="email" className="pl-10" placeholder="Email" />
</div>
```

#### Input with Button

```tsx
<div className="flex gap-2">
  <Input placeholder="Enter code" />
  <Button>Apply</Button>
</div>

<div className="flex">
  <Input 
    className="rounded-r-none" 
    placeholder="Email address" 
  />
  <Button className="rounded-l-none">
    Subscribe
  </Button>
</div>
```

#### Disabled Input

```tsx
<Input disabled placeholder="Disabled input" />
<Input disabled value="Read-only value" />
```

#### Input with Error State

```tsx
<div className="space-y-2">
  <Label htmlFor="username">Username</Label>
  <Input 
    id="username"
    className={errors.username ? 'border-status-error' : ''}
    placeholder="Enter username"
  />
  {errors.username && (
    <p className="text-xs text-status-error">
      {errors.username.message}
    </p>
  )}
</div>
```

---

## Textarea Component

### Import

```typescript
import { Textarea } from '@/components/ui/textarea'
```

### Props

Extends all standard HTML textarea attributes.

### Usage Examples

#### Basic Textarea

```tsx
<Textarea placeholder="Enter your message..." />
```

#### With Label

```tsx
<div className="space-y-2">
  <Label htmlFor="description">Description</Label>
  <Textarea 
    id="description"
    placeholder="Enter description..."
    rows={4}
  />
</div>
```

#### Controlled Textarea

```tsx
const [message, setMessage] = useState('')

<Textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Type your message..."
  rows={6}
/>
```

#### Character Counter

```tsx
const [text, setText] = useState('')
const maxLength = 500

<div className="space-y-2">
  <Textarea
    value={text}
    onChange={(e) => setText(e.target.value)}
    maxLength={maxLength}
    placeholder="Write something..."
  />
  <p className="text-xs text-text-tertiary text-right">
    {text.length}/{maxLength}
  </p>
</div>
```

#### Resizable Textarea

```tsx
<Textarea 
  className="resize-y min-h-[100px]"
  placeholder="Resizable textarea"
/>

<Textarea 
  className="resize-none"
  placeholder="Non-resizable textarea"
/>
```

---

## Label Component

### Import

```typescript
import { Label } from '@/components/ui/label'
```

### Usage Examples

#### Basic Label

```tsx
<Label htmlFor="email">Email Address</Label>
```

#### Required Label

```tsx
<Label htmlFor="name">
  Name <span className="text-status-error">*</span>
</Label>
```

#### Label with Description

```tsx
<div className="space-y-2">
  <Label htmlFor="bio">Bio</Label>
  <p className="text-xs text-text-tertiary">
    Tell us about yourself in a few words
  </p>
  <Textarea id="bio" />
</div>
```

---

## Select Component

### Import

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select'
```

### Usage Examples

#### Basic Select

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

#### Controlled Select

```tsx
const [value, setValue] = useState('')

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Choose an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="red">Red</SelectItem>
    <SelectItem value="blue">Blue</SelectItem>
    <SelectItem value="green">Green</SelectItem>
  </SelectContent>
</Select>
```

#### Select with Groups

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Vegetables</SelectLabel>
      <SelectItem value="carrot">Carrot</SelectItem>
      <SelectItem value="broccoli">Broccoli</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

#### Select with Disabled Option

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="pending">Pending</SelectItem>
    <SelectItem value="disabled" disabled>
      Disabled Option
    </SelectItem>
  </SelectContent>
</Select>
```

#### Form Select

```tsx
<div className="space-y-2">
  <Label htmlFor="country">Country</Label>
  <Select>
    <SelectTrigger id="country">
      <SelectValue placeholder="Select your country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="uk">United Kingdom</SelectItem>
      <SelectItem value="ca">Canada</SelectItem>
      <SelectItem value="au">Australia</SelectItem>
    </SelectContent>
  </Select>
</div>
```

---

## Dropdown Menu Component

### Import

```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
```

### Usage Examples

#### Basic Dropdown

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### With Labels and Shortcuts

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      Profile
      <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      Settings
      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      Logout
      <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### With Icons

```tsx
import { User, Settings, LogOut, CreditCard } from 'lucide-react'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Account</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      Profile
    </DropdownMenuItem>
    <DropdownMenuItem>
      <CreditCard className="mr-2 h-4 w-4" />
      Billing
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Settings className="mr-2 h-4 w-4" />
      Settings
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-status-error">
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Checkbox Items

```tsx
const [showPanel, setShowPanel] = useState(true)
const [showToolbar, setShowToolbar] = useState(false)

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">View</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Toggle</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuCheckboxItem
      checked={showPanel}
      onCheckedChange={setShowPanel}
    >
      Side Panel
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem
      checked={showToolbar}
      onCheckedChange={setShowToolbar}
    >
      Toolbar
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Radio Group

```tsx
const [position, setPosition] = useState('bottom')

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Position</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
      <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Submenu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>New Tab</DropdownMenuItem>
    <DropdownMenuItem>New Window</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>More Tools</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>Developer Tools</DropdownMenuItem>
        <DropdownMenuItem>Task Manager</DropdownMenuItem>
        <DropdownMenuItem>Extensions</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>
```

---
---

## Card Component

### Import
````typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
````

### Props

All card components extend standard HTML div attributes and support `className` for custom styling.

### Component Structure
````tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Footer actions */}
  </CardFooter>
</Card>
````

### Usage Examples

#### Basic Card
#### Card with Footer Actions
#### Card with Form
#### Stats Card
#### Card Grid Layout
#### Interactive Card (Clickable)
#### Card with Image
#### Notification Card
#### Compact Card (No Padding)

### Styling Tips

---

## SearchBar Component

### Import
### Props
### Features
### Usage Examples
### How Debouncing Works

---


## Calendar Component

### Import

```typescript
import { Calendar } from '@/components/ui/calendar'
```

### Usage Examples

#### Basic Calendar

```tsx
const [date, setDate] = useState<Date | undefined>(new Date())

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>
```

#### Date Range Selection

```tsx
import { DateRange } from 'react-day-picker'

const [dateRange, setDateRange] = useState<DateRange | undefined>()

<Calendar
  mode="range"
  selected={dateRange}
  onSelect={setDateRange}
  numberOfMonths={2}
/>
```

#### Multiple Dates

```tsx
const [dates, setDates] = useState<Date[]>([])

<Calendar
  mode="multiple"
  selected={dates}
  onSelect={setDates}
/>
```

#### With Popover (Date Picker)

```tsx
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

const [date, setDate] = useState<Date>()

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="w-[240px] justify-start text-left">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, 'PPP') : <span>Pick a date</span>}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      initialFocus
    />
  </PopoverContent>
</Popover>
```

#### Disabled Dates

```tsx
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  disabled={(date) => 
    date < new Date() || date < new Date('1900-01-01')
  }
/>
```

---

## Popover Component

### Import

```typescript
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
```

### Usage Examples

#### Basic Popover

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="space-y-2">
      <h4 className="font-medium">Popover Title</h4>
      <p className="text-sm text-text-secondary">
        This is popover content
      </p>
    </div>
  </PopoverContent>
</Popover>
```

#### Form in Popover

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button>Add Note</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="note">Note</Label>
        <Textarea id="note" placeholder="Enter your note" />
      </div>
      <Button className="w-full">Save</Button>
    </div>
  </PopoverContent>
</Popover>
```

---

## Form Patterns

### Basic Form

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  // Handle form submission
}

<form onSubmit={handleSubmit} className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input id="name" placeholder="Enter your name" required />
  </div>
  
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="you@example.com" required />
  </div>
  
  <div className="space-y-2">
    <Label htmlFor="message">Message</Label>
    <Textarea id="message" placeholder="Your message" required />
  </div>
  
  <div className="flex gap-2">
    <Button type="button" variant="outline">Cancel</Button>
    <Button type="submit">Submit</Button>
  </div>
</form>
```

### Form with React Hook Form

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof formSchema>

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    // Handle submission
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'border-status-error' : ''}
        />
        {errors.email && (
          <p className="text-xs text-status-error">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          className={errors.password ? 'border-status-error' : ''}
        />
        {errors.password && (
          <p className="text-xs text-status-error">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  )
}
```

### Multi-step Form

```tsx
const [step, setStep] = useState(1)

<div className="space-y-6">
  {/* Progress Indicator */}
  <div className="flex gap-2">
    {[1, 2, 3].map((s) => (
      <div
        key={s}
        className={cn(
          'h-2 flex-1 rounded-full',
          s <= step ? 'bg-accent' : 'bg-bg-tertiary'
        )}
      />
    ))}
  </div>

  {/* Step Content */}
  {step === 1 && (
    <div className="space-y-4">
      <h3 className="font-semibold">Step 1: Personal Info</h3>
      <Input placeholder="Name" />
      <Input type="email" placeholder="Email" />
    </div>
  )}

  {step === 2 && (
    <div className="space-y-4">
      <h3 className="font-semibold">Step 2: Address</h3>
      <Input placeholder="Street Address" />
      <Input placeholder="City" />
    </div>
  )}

  {step === 3 && (
    <div className="space-y-4">
      <h3 className="font-semibold">Step 3: Confirm</h3>
      <p className="text-sm text-text-secondary">Review your information</p>
    </div>
  )}

  {/* Navigation */}
  <div className="flex justify-between">
    <Button
      variant="outline"
      onClick={() => setStep(step - 1)}
      disabled={step === 1}
    >
      Previous
    </Button>
    <Button
      onClick={() => setStep(step + 1)}
      disabled={step === 3}
    >
      {step === 3 ? 'Submit' : 'Next'}
    </Button>
  </div>
</div>
```

---

## Best Practices

### Form Design

1. **Always use labels**: Every input should have an associated label
```tsx
// ✅ Good
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>

// ❌ Avoid
<Input type="email" placeholder="Email" />
```

2. **Show validation errors clearly**
```tsx
<div className="space-y-2">
  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    type="password"
    className={error ? 'border-status-error' : ''}
  />
  {error && (
    <p className="text-xs text-status-error flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      {error.message}
    </p>
  )}
</div>
```

3. **Provide helpful placeholder text**
```tsx
// ✅ Good - specific guidance
<Input placeholder="e.g., john@company.com" />

// ❌ Avoid - vague
<Input placeholder="Enter value" />
```

### Button Usage

1. **Use appropriate variants**
```tsx
// Primary action
<Button>Save Changes</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Dangerous action
<Button variant="destructive">Delete</Button>
```

2. **Show loading states**
```tsx
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

3. **Group related buttons**
```tsx
<div className="flex justify-end gap-2">
  <Button variant="ghost">Cancel</Button>
  <Button variant="outline">Save Draft</Button>
  <Button>Publish</Button>
</div>
### Card Usage

1. **Use consistent padding**
````tsx
// ✅ Good - uses CardContent for consistent padding
<Card>
  <CardContent className="space-y-4">
    {/* Content with proper spacing */}
  </CardContent>
</Card>
````

2. **Group related content**
````tsx
// ✅ Good - logically grouped
<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
  </CardHeader>
  <CardContent>
    {/* All profile-related content */}
  </CardContent>
  <CardFooter>
    {/* Profile actions */}
  </CardFooter>
</Card>
````

### SearchBar Usage

1. **Adjust debounce based on operation cost**
2. **Provide clear placeholders**

### Select & Dropdown

1. **Provide placeholder text**
2. **Group related options**

---

## Accessibility
```

### Select & Dropdown

1. **Provide placeholder text**
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Choose an option" />
  </SelectTrigger>
  <SelectContent>
    {/* options */}
  </SelectContent>
</Select>
```

2. **Group related options**
```tsx
<SelectContent>
  <SelectGroup>
    <SelectLabel>Recent</SelectLabel>
    {/* recent items */}
  </SelectGroup>
  <SelectSeparator />
  <SelectGroup>
    <SelectLabel>All Items</SelectLabel>
    {/* all items */}
  </SelectGroup>
</SelectContent>
```

---

## Accessibility

### Keyboard Navigation

All components support keyboard navigation:
- **Tab**: Navigate between focusable elements
- **Enter/Space**: Activate buttons and select items
- **Arrow keys**: Navigate dropdowns and selects
- **Escape**: Close popovers and dropdowns

### ARIA Labels

```tsx
// Input with aria-label
<Input aria-label="Search products" />

// Button with aria-label for icon-only
<Button size="icon" aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// Select with aria-label
<Select aria-label="Choose category">
  {/* options */}
</Select>
```

### Focus Management

```tsx
// Auto-focus first input
<Input autoFocus />

// Focus trap in modal forms
import { useFocusTrap } from '@/hooks/useFocusTrap'

const ref = useFocusTrap()
<div ref={ref}>
  <form>{/* form content */}</form>
</div>
```

---

## Testing

### Button Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  test('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('applies variant classes', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)
    expect(container.firstChild).toHaveClass('bg-status-error')
  })
})