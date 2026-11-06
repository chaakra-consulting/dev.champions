
import { Header } from "@/components/student/layout/header"
import { AppSidebar } from "@/components/student/layout/sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
         <TooltipProvider>
            <AppSidebar />
         </TooltipProvider>
      <div className="flex min-h-screen w-full flex-col">
        {/* Top Header */}
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 bg-muted/20 p-6">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}