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

export type BusinessColumn = {
    id: string
    name: string
    slug: string
    category: string | null
    logo_url: string | null
    is_published: boolean
    is_verified: boolean
    created_at: Date
    rating: number
    review_count: number
    city: string | null
    state: string | null
    updated_at: Date
}

// Helper to get valid logo URL (handles both old relative paths and new full URLs)
const getLogoUrl = (logoUrl: string | null): string | null => {
    if (!logoUrl) return null
    // If it's already a full URL, return as-is
    if (logoUrl.startsWith('http')) return logoUrl
    // For old relative paths, try to construct URL with env var
    const baseUrl = process.env.NEXT_PUBLIC_R2_BASE_URL
    if (baseUrl) {
        return `${baseUrl.replace(/\/+$/, '')}/${logoUrl}`
    }
    return null // Can't display without base URL
}

export const columns: Column<BusinessColumn>[] = [
    {
        key: "name",
        header: "Negócio",
        className: "w-[300px]",
        render: (item) => {
            const logoUrl = getLogoUrl(item.logo_url)
            return (
                <div className="flex items-center gap-3">
                    <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-xs">
                                {item.name.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <span className="font-semibold text-foreground text-base leading-tight truncate max-w-[200px]">{item.name}</span>
                </div>
            )
        }
    },
    {
        key: "category",
        header: "Categoria",
        render: (item) => (
            <span className="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {item.category || "Sem categoria"}
            </span>
        )
    },
    {
        key: "is_published", // specialized render ignores this key usage but good for sorting if enabled
        header: "Status",
        render: (item) => {
            const status = item.is_published ? "published" : "draft"
            return <StatusBadge status={status} className="px-3 py-1 text-sm font-semibold" />
        }
    },
    {
        key: "rating",
        header: "Avaliação",
        render: (item) => (
            <div className="flex items-center gap-1 text-sm">
                <span className="font-medium">{item.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-xs">({item.review_count})</span>
            </div>
        )
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
                    <DropdownMenuItem asChild>
                        <Link href={`https://conexo.jp/negocios/${item.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver no site
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
]
