import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type ListingType = "Negócio" | "Event" | "Vaga"

interface TypeBadgeProps {
    type: string // Can be string to accept API data easily
    className?: string
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
    const normalizedType = type.toLowerCase()

    // Map types to colors
    const getStyle = (t: string) => {
        if (t.includes("negócio") || t.includes("business")) {
            return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" // Green
        }
        if (t.includes("event") || t.includes("evento")) {
            return "bg-[#FB923C]/10 text-[#FB923C] border-[#FB923C]/20" // Orange
        }
        if (t.includes("vaga") || t.includes("job") || t.includes("emprego")) {
            return "bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/20" // Indigo
        }
        return "bg-secondary text-muted-foreground border-border" // Default/Gray
    }

    return (
        <Badge
            variant="outline"
            className={cn(
                "font-medium shadow-none border",
                getStyle(normalizedType),
                className
            )}
        >
            {type}
        </Badge>
    )
}
