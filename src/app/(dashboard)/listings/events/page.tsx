import { getEvents } from "@/actions/get-events"
import { hasUserBusiness } from "@/actions/has-user-business"
import { EventClientPage } from "./client"
import { PageHeader } from "@/components/ui-conexo/page-header"
import { requireRole } from "@/lib/auth"

export default async function EventListingsPage() {
    await requireRole('business')

    const [{ data, success, error }, businessCheck] = await Promise.all([
        getEvents(),
        hasUserBusiness(),
    ])
    const hasBusiness = businessCheck.success ? businessCheck.hasBusiness : true

    if (!success) {
        console.error(error)
        return <div>Error loading events</div>
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <PageHeader
                title="Meus Eventos"
                description="Gerencie seus eventos cadastrados."
            />

            <EventClientPage data={data || []} hasBusiness={hasBusiness} />
        </div>
    )
}
