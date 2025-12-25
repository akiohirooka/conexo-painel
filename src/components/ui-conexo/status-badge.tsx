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
        success: "bg-green-100 text-green-700 hover:bg-green-100/80 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-900",
        warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
        error: "bg-red-100 text-red-700 hover:bg-red-100/80 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-900",
        info: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-900",
        muted: "bg-gray-100 text-gray-700 hover:bg-gray-100/80 dark:bg-gray-500/10 dark:text-gray-400 border-gray-200 dark:border-gray-800",
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
