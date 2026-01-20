import { requireAnyRole } from "@/lib/auth"
import { DashboardClient } from "./client"

export default async function DashboardPage() {
    await requireAnyRole(['user', 'business'])

    return <DashboardClient />
}
