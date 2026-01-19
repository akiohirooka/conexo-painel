"use client"

import { EmptyState } from "@/components/ui-conexo/empty-state"
import { Briefcase, Plus, MoreVertical, Edit, Eye, MapPin, Globe, Users, Building2, Banknote } from "lucide-react"
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

export type JobColumn = {
    id: string
    title: string
    slug: string
    company_name: string | null
    employment_type: string | null // e.g., Full-time, Part-time
    work_model: string | null // onsite, remote, hybrid
    salary_amount: number | null
    salary_currency: string
    salary_unit: string | null // month, hour, year
    cover_image_url: string | null
    status: string
    is_active: boolean
    created_at: Date
    updated_at: Date
}

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
                    description="Adicione as vagas de emprego que você está divulgando."
                    icon={Briefcase}
                    action={{
                        label: "Criar Vaga",
                        onClick: () => router.push("/listings/new?type=job")
                    }}
                />
            </div>
        )
    }

    const limitReached = data.length >= 3

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((job) => (
                <JobCard key={job.id} job={job} />
            ))}

            {!limitReached && (
                <div
                    onClick={() => router.push("/listings/new?type=job")}
                    className="group relative flex flex-col items-center justify-center aspect-square overflow-hidden rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 transition-all hover:bg-muted/10 hover:border-primary/50 cursor-pointer"
                >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                        <div className="p-3 rounded-full bg-background shadow-sm border group-hover:border-primary/50 transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-sm">Adicionar Vaga</span>
                    </div>
                </div>
            )}
        </div>
    )
}

function JobCard({ job }: { job: JobColumn }) {
    const router = useRouter()

    const getCoverUrl = (coverUrl: string | null, updatedAt?: Date) => {
        if (!coverUrl) return null
        let url = coverUrl
        if (!coverUrl.startsWith('http')) {
            const baseUrl = process.env.NEXT_PUBLIC_R2_BASE_URL
            if (baseUrl) url = `${baseUrl.replace(/\/+$/, '')}/${coverUrl}`
            else return null
        }

        if (updatedAt) {
            const separator = url.includes('?') ? '&' : '?'
            return `${url}${separator}t=${new Date(updatedAt).getTime()}`
        }

        return url
    }

    const coverUrl = getCoverUrl(job.cover_image_url, job.updated_at)

    const statusMap: Record<string, "published" | "draft" | "pending" | "rejected"> = {
        "APPROVED": "published",
        "DRAFT": "draft",
        "PENDING": "pending",
        "REJECTED": "rejected"
    }

    const formatSalary = (amount: number | null, currency: string, unit: string | null) => {
        if (!amount || amount === 0) return "A combinar"
        const formatted = new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: currency || 'JPY',
            maximumFractionDigits: 0
        }).format(amount)

        const unitLabel = unit === 'hour' ? '/h' : unit === 'year' ? '/ano' : '/mês'
        return `${formatted}${unitLabel}`
    }

    const getModeTag = (mode: string | null) => {
        const modeConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
            onsite: { label: 'Presencial', icon: <MapPin className="w-3 h-3" />, className: 'bg-blue-100 text-blue-700' },
            remote: { label: 'Remoto', icon: <Globe className="w-3 h-3" />, className: 'bg-green-100 text-green-700' },
            hybrid: { label: 'Híbrido', icon: <Users className="w-3 h-3" />, className: 'bg-purple-100 text-purple-700' },
        }
        // Normalizing db values if needed
        const normalizedMode = mode === 'presencial' ? 'onsite' : mode === 'online' ? 'remote' : mode
        return modeConfig[normalizedMode || 'onsite'] || modeConfig.onsite
    }

    const modeTag = getModeTag(job.work_model)

    return (
        <div
            onClick={() => router.push(`/listings/${job.id}/edit?type=job`)}
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
                            <Link href={`/listings/${job.id}/edit?type=job`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`https://conexo.jp/empregos/${job.slug}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver no site
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="aspect-square w-full bg-muted relative overflow-hidden">
                {coverUrl ? (
                    <img
                        src={coverUrl}
                        alt={job.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
                        <Briefcase className="h-10 w-10 opacity-20" />
                    </div>
                )}
                <div className="absolute bottom-2 left-2">
                    <StatusBadge status={statusMap[job.status] || "draft"} className="shadow-sm text-[10px] px-2 py-0.5 h-auto capitalize" />
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4 gap-2">
                <div>
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                        {job.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Building2 className="w-3 h-3" />
                        <span className="line-clamp-1">{job.company_name || "Empresa não informada"}</span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${modeTag.className}`}>
                            {modeTag.icon}
                            {modeTag.label}
                        </span>
                        {job.employment_type && (
                            <span className="flex items-center px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]">
                                {job.employment_type}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5" />
                        {formatSalary(job.salary_amount, job.salary_currency, job.salary_unit)}
                    </span>
                </div>
            </div>
        </div>
    )
}
