
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    CheckCircle2,
    Clock,
    XCircle,
    MousePointerClick,
    Plus,
    LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { KpiCard } from "@/components/ui-conexo/kpi-card"
import { PageHeader } from "@/components/ui-conexo/page-header"
import { StatusBadge } from "@/components/ui-conexo/status-badge"
import { EmptyState } from "@/components/ui-conexo/empty-state"
import Link from "next/link"

import { getDashboardData, DashboardListing as Listing } from "@/actions/dashboard/get-dashboard-data"
import { TypeBadge } from "@/components/ui-conexo/type-badge"

// Helper to get edit URL based on listing type/id
function getEditUrl(listing: Listing): string {
    const prefix = listing.id.split('-')[0]
    const actualId = listing.id.split('-').slice(1).join('-')

    switch (prefix) {
        case 'biz':
            return `/listings/${actualId}/edit?type=business`
        case 'evt':
            return `/listings/${actualId}/edit?type=event`
        case 'job':
            return `/listings/${actualId}/edit?type=job`
        default:
            return '/dashboard'
    }
}

export function DashboardClient() {
    const [isLoading, setIsLoading] = useState(true)
    const [listings, setListings] = useState<Listing[]>([])
    const [stats, setStats] = useState({
        approved: 0,
        pending: 0,
        rejected: 0,
        totalClicks: 0
    })

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getDashboardData()
                setListings(data.listings)
                setStats(data.stats)
            } catch (error) {
                console.error("Failed to load dashboard data", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    if (isLoading) {
        return <DashboardSkeleton />
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <PageHeader
                title="Visão Geral"
                description="Acompanhe o desempenho dos seus anúncios."
            />

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    title="Aprovados"
                    value={stats.approved}
                    icon={CheckCircle2}
                    description="Anúncios ativos"
                />
                <KpiCard
                    title="Pendentes"
                    value={stats.pending}
                    icon={Clock}
                    description="Aguardando aprovação"
                />
                <KpiCard
                    title="Rejeitados"
                    value={stats.rejected}
                    icon={XCircle}
                    description="Precisam de revisão"
                />
                <KpiCard
                    title="Cliques em Contato"
                    value={stats.totalClicks}
                    icon={MousePointerClick}
                    description="Total de interações"
                    trend={{ value: "+12%", isPositive: true }}
                />
            </div>

            {/* Recent Listings Section */}
            <div className="space-y-4">
                <PageHeader title="Anúncios" />

                {listings.length > 0 ? (
                    <div className="rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Título</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead className="text-right">Cliques</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listings.map((listing) => (
                                    <TableRow
                                        key={listing.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => window.location.href = getEditUrl(listing)}
                                    >
                                        <TableCell className="font-medium">{listing.title}</TableCell>
                                        <TableCell>
                                            <TypeBadge type={listing.type} />
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={listing.status} />
                                        </TableCell>
                                        <TableCell>{listing.date}</TableCell>
                                        <TableCell className="text-right">{listing.clicks}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <EmptyState
                        title="Nenhum anúncio encontrado"
                        description="Você ainda não criou nenhum anúncio. Navegue pelas seções de Negócios, Eventos ou Vagas para criar um novo."
                        icon={LayoutDashboard}
                    />
                )}
            </div>
        </div>
    )
}

function DashboardSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
            </div>

            <div className="space-y-4">
                <Skeleton className="h-8 w-40" />
                <div className="rounded-md border bg-card">
                    <div className="p-4 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between gap-4">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
