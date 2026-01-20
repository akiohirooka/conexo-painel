import { getEvents } from "@/actions/get-events"
import { EventClientPage } from "./client"
import { PageHeader } from "@/components/ui-conexo/page-header"
import { requireAnyRole } from "@/lib/auth"

export default async function EventListingsPage() {
    await requireAnyRole(['user', 'business'])

    const { data, success, error } = await getEvents()

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

            <EventClientPage data={data || []} />
        </div>
    )
}
