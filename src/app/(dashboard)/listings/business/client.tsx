"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns, BusinessColumn } from "./columns"
import { EmptyState } from "@/components/ui-conexo/empty-state"
import { Store } from "lucide-react"
import { useRouter } from "next/navigation"

interface BusinessClientPageProps {
    data: BusinessColumn[]
}

export function BusinessClientPage({ data }: BusinessClientPageProps) {
    const router = useRouter()

    if (data.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <EmptyState
                    title="Nenhum negócio encontrado"
                    description="Você ainda não cadastrou nenhum negócio. Comece criando um agora mesmo."
                    icon={Store}
                    action={{
                        label: "Criar Negócio",
                        onClick: () => router.push("/listings/new")
                    }}
                />
            </div>
        )
    }

    return (
        <DataTable
            data={data}
            columns={columns}
            searchable={true}
            searchKeys={["name", "category", "city"]}
            searchPlaceholder="Buscar por nome, categoria ou cidade..."
        />
    )
}
