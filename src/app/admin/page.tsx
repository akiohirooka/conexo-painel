
"use client"

import { useEffect, useState } from "react"
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  MoreHorizontal
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// --- Mock Data ---

interface PendingItem {
  id: string
  title: string
  type: "Negócio" | "Event" | "Vaga"
  submitter: string
  submittedAt: string
}

interface TopListing {
  id: string
  title: string
  clicks: number
  growth: string
}

const MOCK_PENDING: PendingItem[] = [
  { id: "101", title: "Restaurante Sabor Latino", type: "Negócio", submitter: "Carlos Silva", submittedAt: "Hoje, 10:30" },
  { id: "102", title: "Vaga de Atendente bilíngue", type: "Vaga", submitter: "RH K.K.", submittedAt: "Hoje, 09:15" },
  { id: "103", title: "Festival de Verão 2025", type: "Event", submitter: "Eventos JP", submittedAt: "Ontem, 18:00" },
  { id: "104", title: "Loja de Produtos Brasileiros", type: "Negócio", submitter: "Maria Oliveira", submittedAt: "Ontem, 14:20" },
]

const MOCK_TOP_LISTINGS: TopListing[] = [
  { id: "201", title: "Churrascaria Brasil", clicks: 1240, growth: "+15%" },
  { id: "202", title: "Empreiteira Nova Esperança", clicks: 890, growth: "+8%" },
  { id: "203", title: "Show Sertanejo Tokyo", clicks: 650, growth: "+22%" },
  { id: "204", title: "Loja Virtual BR", clicks: 420, growth: "+5%" },
  { id: "205", title: "Consultoria Vistos", clicks: 380, growth: "+2%" },
]

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([])
  const [topListings, setTopListings] = useState<TopListing[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPendingItems(MOCK_PENDING)
      setTopListings(MOCK_TOP_LISTINGS)
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <AdminDashboardSkeleton />
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <SectionHeader
        title="Painel Admin"
        description="Gestão de aprovações e métricas da plataforma."
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Pendentes Hoje"
          value={pendingItems.filter(i => i.submittedAt.includes("Hoje")).length}
          icon={AlertCircle}
          description="Aguardando revisão"
          trend={{ value: "+2", isPositive: false }} // Red because more pending is "bad"/workload
        />
        <KpiCard
          title="Aprovados (Semana)"
          value={142}
          icon={CheckCircle2}
          description="Novas publicações"
          trend={{ value: "+18%", isPositive: true }}
        />
        <KpiCard
          title="Rejeitados (Semana)"
          value={12}
          icon={XCircle}
          description="Não conformes"
          trend={{ value: "-5%", isPositive: true }} // Green because less rejected is good? Or bad? Context dependent. Let's say good.
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Pending Queue Section (Larger, 4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <SectionHeader title="Fila de Pendências" />
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Enviado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.submitter}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.submittedAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>Revisar</DropdownMenuItem>
                          <DropdownMenuItem className="text-green-600">Aprovar Rápido</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Rejeitar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Top Listings Section (Smaller, 3 cols) */}
        <div className="md:col-span-3 space-y-4">
          <SectionHeader title="Top Anúncios por Contato" />
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Mais Populares</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {topListings.map((listing, index) => (
                <div key={listing.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      {/* Using fallback for now, in real app listing image */}
                      <AvatarFallback>{index + 1}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{listing.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {listing.clicks} cliques
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center font-medium text-green-500 text-sm">
                    {listing.growth} <TrendingUp className="ml-1 h-3 w-3" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

function AdminDashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4 space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
        <div className="md:col-span-3 space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
