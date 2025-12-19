
"use client"

import { useEffect, useState } from "react"
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
import { KpiCard } from "@/components/dashboard/kpi-card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { EmptyState } from "@/components/dashboard/empty-state"
import Link from "next/link"

// --- Mock Data ---

interface Listing {
    id: string
    title: string
    type: "Negócio" | "Event" | "Vaga"
    status: "approved" | "pending" | "rejected"
    date: string
    clicks: number
}

const MOCK_LISTINGS: Listing[] = [
    { id: "1", title: "Padaria do Zé", type: "Negócio", status: "approved", date: "20/12/2025", clicks: 12 },
    { id: "2", title: "Festival Brasileiro", type: "Event", status: "pending", date: "21/12/2025", clicks: 0 },
    { id: "3", title: "Vaga de Cozinheiro", type: "Vaga", status: "approved", date: "19/12/2025", clicks: 5 },
    { id: "4", title: "Consultoria Visa", type: "Negócio", status: "rejected", date: "18/12/2025", clicks: 1 },
    { id: "5", title: "Show de Pagode", type: "Event", status: "approved", date: "15/12/2025", clicks: 45 },
]

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [listings, setListings] = useState<Listing[]>([])

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setListings(MOCK_LISTINGS)
            setIsLoading(false)
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    // KPI Calculations
    const approvedCount = listings.filter(l => l.status === "approved").length
    const pendingCount = listings.filter(l => l.status === "pending").length
    const rejectedCount = listings.filter(l => l.status === "rejected").length
    const totalClicks = listings.reduce((acc, curr) => acc + curr.clicks, 0)

    // Empty state toggle for demo (not part of requirements but good for testing)
    // setListings([]) to test empty state

    if (isLoading) {
        return <DashboardSkeleton />
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <SectionHeader
                title="Visão Geral"
                description="Acompanhe o desempenho dos seus anúncios."
                action={
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/novo-negocio">
                                <Plus className="mr-2 h-4 w-4" /> Novo Anúncio
                            </Link>
                        </Button>
                    </div>
                }
            />

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    title="Aprovados"
                    value={approvedCount}
                    icon={CheckCircle2}
                    description="Anúncios ativos"
                />
                <KpiCard
                    title="Pendentes"
                    value={pendingCount}
                    icon={Clock}
                    description="Aguardando aprovação"
                />
                <KpiCard
                    title="Rejeitados"
                    value={rejectedCount}
                    icon={XCircle}
                    description="Precisam de revisão"
                />
                <KpiCard
                    title="Cliques em Contato"
                    value={totalClicks}
                    icon={MousePointerClick}
                    description="Total de interações"
                    trend={{ value: "+12%", isPositive: true }}
                />
            </div>

            {/* Recent Listings Section */}
            <div className="space-y-4">
                <SectionHeader title="Anúncios Recentes" />

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
                                    <TableRow key={listing.id}>
                                        <TableCell className="font-medium">{listing.title}</TableCell>
                                        <TableCell>{listing.type}</TableCell>
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
                        description="Você ainda não criou nenhum anúncio. Comece agora para alcançar mais clientes."
                        icon={LayoutDashboard}
                    >
                        <Button className="mt-4" asChild>
                            <Link href="/novo-negocio">Criar Anúncio</Link>
                        </Button>
                    </EmptyState>
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
