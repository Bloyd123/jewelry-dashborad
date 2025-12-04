
// ============================================================================
// FILE: layouts/MainLayout/MainLayout.tsx
// ============================================================================
import { SidebarProvider } from '@/context/SidebarContext'
import{MainContent} from '../MainContent/MainContent'
export const MainLayout = () => {
  return (
    <SidebarProvider>
      <MainContent />
    </SidebarProvider>
  )
}