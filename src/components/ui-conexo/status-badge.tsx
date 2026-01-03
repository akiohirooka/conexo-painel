import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusType = "approved" | "pending" | "rejected" | "archived" | "draft" | "published"

interface StatusBadgeProps {
    status: string
    className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase()

    // Map arbitrary statuses to our design system intents
    const getIntent = (s: string) => {
        switch (s) {
            case "approved":
            case "published":
            case "active":
                return "success"
            case "pending":
            case "draft":
            case "review":
                return "warning"
            case "rejected":
            case "error":
            case "banned":
                return "error"
            case "archived":
            case "inactive":
                return "muted"
            default:
                return "info"
        }
    }

    const intent = getIntent(normalizedStatus)

    // Token-based styles
    const variants = {
        success: "bg-emerald-100 text-emerald-800 border-emerald-200",
        warning: "bg-amber-100 text-amber-800 border-amber-200",
        error: "bg-rose-100 text-rose-800 border-rose-200",
        info: "bg-blue-100 text-blue-800 border-blue-200",
        muted: "bg-secondary text-muted-foreground border-border",
    }

    const defaultLabels: Record<string, string> = {
        approved: "Aprovado",
        pending: "Pendente",
        rejected: "Rejeitado",
        archived: "Arquivado",
        draft: "Rascunho",
        published: "Publicado",
    }

    return (
        <Badge
            variant="outline"
            className={cn(
                "capitalize font-medium shadow-none", // shadow-none for flat look
                variants[intent],
                className
            )}
        >
            {defaultLabels[normalizedStatus] || status}
        </Badge>
    )
}
