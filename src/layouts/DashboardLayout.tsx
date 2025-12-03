// layouts/DashboardLayout.tsx

import { Sidebar, MobileSidebar } from '@/components/sidebar'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SidebarProvider } from '@/context/SidebarContext'

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {isMobile ? <MobileSidebar /> : <Sidebar />}
        
        <main className="flex-1 overflow-y-auto bg-bg-primary">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}