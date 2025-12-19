
interface SectionHeaderProps {
    title: string
    description?: string
    align?: "left" | "center" | "right"
    action?: React.ReactNode
}

export function SectionHeader({ title, description, align = "left", action }: SectionHeaderProps) {
    return (
        <div className={`flex flex-col gap-1 pb-4 ${align === "center" ? "text-center items-center" : align === "right" ? "text-right items-end" : "text-left"} md:flex-row md:items-center md:justify-between`}>
            <div>
                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            {action && <div className="mt-4 md:mt-0">{action}</div>}
        </div>
    )
}
