import { requireRole } from "@/lib/auth"
import { DashboardClient } from "./client"

export default async function DashboardPage() {
    await requireRole('business')

    return <DashboardClient />
}
