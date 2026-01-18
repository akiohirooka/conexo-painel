import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/auth"
import type { UserRole } from "@/lib/auth"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Fetch user role on server to pass to client sidebar
    const user = await getCurrentUser()
    const userRole: UserRole = user?.role ?? 'user'

    return (
        <SidebarProvider>
            <AppSidebar userRole={userRole} />
            <SidebarInset>
                <Topbar />
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
