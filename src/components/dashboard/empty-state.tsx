
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
    title: string
    description: string
    icon: LucideIcon
    className?: string
    children?: React.ReactNode
}

export function EmptyState({ title, description, icon: Icon, className, children }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50", className)}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Icon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                {description}
            </p>
            {children}
        </div>
    )
}
