import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { currentUser } from "@clerk/nextjs/server"
import { requireAuth } from "@/lib/auth"
import type { UserRole } from "@/lib/auth"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Enforce auth for all dashboard routes and fetch Clerk profile for avatar fallback
    const [user, clerkUser] = await Promise.all([requireAuth(), currentUser()])
    const userRole: UserRole = user.role
    const fallbackName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
    const fallbackImageUrl = clerkUser?.imageUrl

    return (
        <SidebarProvider>
            <AppSidebar userRole={userRole} />
            <SidebarInset>
                <Topbar
                    fallbackName={fallbackName || user.email}
                    fallbackEmail={user.email}
                    fallbackImageUrl={fallbackImageUrl}
                />
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
