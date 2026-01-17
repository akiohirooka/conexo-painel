"use client"

import { Column } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui-conexo/status-badge"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export type JobColumn = {
    id: string
    title: string
    slug: string
    company_name: string | null
    employment_type: string | null
    status: string
    is_active: boolean
    created_at: Date
}

export const columns: Column<JobColumn>[] = [
    {
        key: "title",
        header: "Vaga",
        className: "w-[300px]",
        render: (item) => (
            <div className="flex flex-col">
                <span className="font-semibold text-foreground text-sm">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.company_name}</span>
            </div>
        )
    },
    {
        key: "employment_type",
        header: "Tipo",
        render: (item) => (
            <span className="text-sm capitalize">
                {item.employment_type || "-"}
            </span>
        )
    },
    {
        key: "status",
        header: "Status",
        render: (item) => {
            const statusMap: Record<string, "published" | "draft" | "pending" | "rejected"> = {
                "APPROVED": "published",
                "DRAFT": "draft",
                "PENDING": "pending",
                "REJECTED": "rejected"
            }
            return <StatusBadge status={statusMap[item.status] || "draft"} className="px-3 py-1 text-xs font-semibold" />
        }
    },
    {
        key: "created_at",
        header: "Criado em",
        render: (item) => (
            <span className="text-sm text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString('pt-BR')}
            </span>
        )
    },
    {
        key: "actions",
        header: "",
        className: "w-[50px]",
        render: (item) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Ações</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-lg border">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/listings/${item.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
]
