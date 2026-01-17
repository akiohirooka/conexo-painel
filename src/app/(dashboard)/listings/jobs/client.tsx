"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns, JobColumn } from "./columns"
import { EmptyState } from "@/components/ui-conexo/empty-state"
import { Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

interface JobClientPageProps {
    data: JobColumn[]
}

export function JobClientPage({ data }: JobClientPageProps) {
    const router = useRouter()

    if (data.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <EmptyState
                    title="Nenhuma vaga cadastrada"
                    description="Adicione as vagas de emprego disponíveis."
                    icon={Briefcase}
                    action={{
                        label: "Criar Vaga",
                        onClick: () => router.push("/listings/new?type=job")
                    }}
                />
            </div>
        )
    }

    return (
        <DataTable
            data={data}
            columns={columns}
            searchable={false}
            showCount={false}
            onRowClick={(item) => router.push(`/listings/${item.id}/edit`)}
        />
    )
}
