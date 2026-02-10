import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/admin-utils"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminChrome } from "@/components/admin/admin-chrome"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminDevModeProvider } from "@/contexts/admin-dev-mode"
import { getAccountStatusByClerkUserId } from "@/lib/auth/account-status"
import { buildAccountDeletedDecisionPath } from "@/lib/auth/deleted-account"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (process.env.E2E_AUTH_BYPASS !== '1') {
    const { userId } = await auth()
    if (!userId) {
      redirect("/dashboard")
    }

    const accountStatus = await getAccountStatusByClerkUserId(userId)
    if (accountStatus.status === 'deleted') {
      redirect(buildAccountDeletedDecisionPath({
        clerkUserId: accountStatus.clerkUserId,
        email: accountStatus.email,
      }))
    }

    if (!(await isAdmin(userId))) {
      redirect("/dashboard")
    }
  }

  return (
    <AdminDevModeProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminChrome>{children}</AdminChrome>
        </SidebarInset>
      </SidebarProvider>
    </AdminDevModeProvider>
  )
}
