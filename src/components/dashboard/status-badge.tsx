
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusType = "approved" | "pending" | "rejected"

interface StatusBadgeProps {
    status: string
    className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase() as StatusType

    const variants = {
        approved: "bg-green-100 text-green-700 hover:bg-green-100/80 dark:bg-green-500/10 dark:text-green-400",
        pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 dark:bg-yellow-500/10 dark:text-yellow-400",
        rejected: "bg-red-100 text-red-700 hover:bg-red-100/80 dark:bg-red-500/10 dark:text-red-400",
    }

    // Fallback for unknown statuses
    const variantClass = variants[normalizedStatus] || "bg-gray-100 text-gray-700 hover:bg-gray-100/80 dark:bg-gray-500/10 dark:text-gray-400"

    const defaultLabels: Record<string, string> = {
        approved: "Aprovado",
        pending: "Pendente",
        rejected: "Rejeitado",
    }

    return (
        <Badge variant="outline" className={cn("capitalize border-0 font-medium", variantClass, className)}>
            {defaultLabels[normalizedStatus] || status}
        </Badge>
    )
}
