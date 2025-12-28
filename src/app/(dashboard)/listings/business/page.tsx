import { getBusinesses } from "@/actions/get-businesses"
import { BusinessClientPage } from "./client"
import { PageHeader } from "@/components/ui-conexo/page-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function BusinessListingsPage() {
    const { data, success, error } = await getBusinesses()

    if (!success) {
        // Handle error state gracefully, maybe show a toast or error message component
        // For now, logging and showing empty or specific error UI could be done
        console.error(error)
        return <div>Error loading businesses</div>
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Meus Negócios"
                    description="Gerencie seus negócios cadastrados."
                />
                <Button asChild>
                    <Link href="/listings/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Negócio
                    </Link>
                </Button>
            </div>

            <BusinessClientPage data={data || []} />
        </div>
    )
}
