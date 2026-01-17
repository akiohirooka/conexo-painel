"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns, EventColumn } from "./columns"
import { EmptyState } from "@/components/ui-conexo/empty-state"
import { Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface EventClientPageProps {
    data: EventColumn[]
}

export function EventClientPage({ data }: EventClientPageProps) {
    const router = useRouter()

    if (data.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <EmptyState
                    title="Nenhum evento cadastrado"
                    description="Adicione os eventos que você está organizando."
                    icon={Calendar}
                    action={{
                        label: "Criar Evento",
                        onClick: () => router.push("/listings/new?type=event")
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
