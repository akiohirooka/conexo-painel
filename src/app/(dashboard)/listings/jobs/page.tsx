import { getJobs } from "@/actions/get-jobs"
import { JobClientPage } from "./client"
import { PageHeader } from "@/components/ui-conexo/page-header"

export default async function JobListingsPage() {
    const { data, success, error } = await getJobs()

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

            <JobClientPage data={data || []} />
        </div>
    )
}
