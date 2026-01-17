"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns, BusinessColumn } from "./columns"
import { EmptyState } from "@/components/ui-conexo/empty-state"
import { Store, Plus, MoreVertical, Edit, Eye, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui-conexo/status-badge"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BusinessClientPageProps {
    data: BusinessColumn[]
}

export function BusinessClientPage({ data }: BusinessClientPageProps) {
    const router = useRouter()

    if (data.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <EmptyState
                    title="Nenhum negócio cadastrado"
                    description="Adicione os negócios que você gerencia."
                    icon={Store}
                    action={{
                        label: "Criar Negócio",
                        onClick: () => router.push("/listings/new")
                    }}
                />
            </div>
        )
    }

    const limitReached = data.length >= 3

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((business) => (
                <BusinessCard key={business.id} business={business} />
            ))}

            {!limitReached && (
                <div
                    onClick={() => router.push("/listings/new")}
                    className="group relative flex flex-col items-center justify-center aspect-square overflow-hidden rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 transition-all hover:bg-muted/10 hover:border-primary/50 cursor-pointer"
                >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                        <div className="p-3 rounded-full bg-background shadow-sm border group-hover:border-primary/50 transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-sm">Adicionar Negócio</span>
                    </div>
                </div>
            )}
        </div>
    )
}

function BusinessCard({ business }: { business: BusinessColumn }) {
    const router = useRouter()

    // Helper for logo (same as in columns)
    const getLogoUrl = (logoUrl: string | null, updatedAt?: Date) => {
        if (!logoUrl) return null
        let url = logoUrl
        if (!logoUrl.startsWith('http')) {
            const baseUrl = process.env.NEXT_PUBLIC_R2_BASE_URL
            if (baseUrl) url = `${baseUrl.replace(/\/+$/, '')}/${logoUrl}`
            else return null
        }

        // Append updated_at timestamp to bust cache
        if (updatedAt) {
            const separator = url.includes('?') ? '&' : '?'
            return `${url}${separator}t=${new Date(updatedAt).getTime()}`
        }

        return url
    }

    const logoUrl = getLogoUrl(business.logo_url, business.updated_at)

    const statusMap: Record<string, "published" | "draft"> = {
        "true": "published",
        "false": "draft"
    }

    return (
        <div
            onClick={() => router.push(`/listings/${business.id}/edit`)}
            className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 cursor-pointer"
        >
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-white/70 backdrop-blur-sm hover:bg-white rounded-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreVertical className="h-4 w-4 text-foreground/70" />
                            <span className="sr-only">Ações</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/listings/${business.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/negocio/${business.slug}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver no site
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="aspect-square w-full bg-muted relative overflow-hidden">
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt={business.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
                        <Store className="h-10 w-10 opacity-20" />
                    </div>
                )}
                <div className="absolute bottom-2 left-2">
                    <StatusBadge status={statusMap[String(business.is_published)]} className="shadow-sm text-[10px] px-2 py-0.5 h-auto capitalize" />
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4 gap-2">
                <div>
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                        {business.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                            {business.category || "Sem categoria"}
                        </span>
                    </div>
                </div>

                <div className="mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">{business.rating.toFixed(1)}</span>
                        <span>({business.review_count})</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
