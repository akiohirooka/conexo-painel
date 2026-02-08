import { getJobs } from "@/actions/get-jobs"
import { hasUserBusiness } from "@/actions/has-user-business"
import { JobClientPage } from "./client"
import { PageHeader } from "@/components/ui-conexo/page-header"
import { requireRole } from "@/lib/auth"

export default async function JobListingsPage() {
    await requireRole('business')

    const [{ data, success, error }, businessCheck] = await Promise.all([
        getJobs(),
        hasUserBusiness(),
    ])
    const hasBusiness = businessCheck.success ? businessCheck.hasBusiness : true

    if (!success) {
        console.error(error)
        return <div>Error loading jobs</div>
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <PageHeader
                title="Minhas Vagas"
                description="Gerencie suas vagas de emprego cadastradas."
            />

            <JobClientPage data={data || []} hasBusiness={hasBusiness} />
        </div>
    )
}
