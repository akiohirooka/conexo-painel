import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
    title: string
    description: string
    icon: LucideIcon
    action?: {
        label: string
        onClick: () => void
    }
    className?: string
    children?: React.ReactNode
}

export function EmptyState({
    title,
    description,
    icon: Icon,
    action,
    className,
    children
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center animate-in fade-in-50 bg-muted/5",
                className
            )}
            role="region"
            aria-label={title}
        >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
                <Icon className="h-10 w-10 text-muted-foreground/80" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm text-balance">
                {description}
            </p>
            {action && (
                <Button onClick={action.onClick} variant="default" size="sm">
                    {action.label}
                </Button>
            )}
            {children}
        </div>
    )
}
