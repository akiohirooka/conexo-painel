"use client"

import { Column } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui-conexo/status-badge"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"

export type EventColumn = {
    id: string
    title: string
    slug: string
    cover_image_url: string | null
    starts_at: Date
    ends_at: Date | null
    status: string // DRAFT, PENDING, APPROVED, REJECTED
    is_active: boolean
    created_at: Date
}

export const columns: Column<EventColumn>[] = [
    {
        key: "title",
        header: "Evento",
        className: "w-[300px]",
        render: (item) => (
            <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.cover_image_url ? (
                        <Image
                            src={item.cover_image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-xs">
                            {item.title.slice(0, 2).toUpperCase()}
                        </div>
                    )}
                </div>
                <span className="font-semibold text-foreground text-sm truncate max-w-[200px]">{item.title}</span>
            </div>
        )
    },
    {
        key: "starts_at",
        header: "Data",
        render: (item) => (
            <span className="text-sm">
                {new Date(item.starts_at).toLocaleDateString('pt-BR')}
            </span>
        )
    },
    {
        key: "status",
        header: "Status",
        render: (item) => {
            // Map DB status to badge status
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
