// FILE: types/menu.ts
// Menu Item Types

import { LucideIcon } from 'lucide-react'

export interface MenuItem {
  title: string
  url?: string
  icon: LucideIcon
  items?: SubMenuItem[] // For collapsible menus
}

export interface SubMenuItem {
  title: string
  url: string
  icon?: LucideIcon
}
