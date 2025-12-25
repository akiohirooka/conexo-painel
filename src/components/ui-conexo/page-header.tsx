import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
    title: string
    description?: string
    align?: "left" | "center" | "right"
    action?: {
        label: string
        onClick?: () => void
        icon?: React.ReactNode
        variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
        href?: string // if provided, could render as Link
    } | React.ReactNode // Allow custom node for complex actions
    className?: string
}

export function PageHeader({
    title,
    description,
    align = "left",
    action,
    className
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between",
                align === "center" ? "text-center md:text-left" : align === "right" ? "text-right" : "text-left",
                className
            )}
        >
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>

            {action && (
                <div className={cn("flex md:mt-0", align === "center" && "justify-center md:justify-end")}>
                    {isValidActionObject(action) ? (
                        <Button
                            variant={action.variant || "default"}
                            onClick={action.onClick}
                        >
                            {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
                            {action.label}
                        </Button>
                    ) : (
                        action
                    )}
                </div>
            )}
        </div>
    )
}

function isValidActionObject(action: any): action is { label: string; onClick?: () => void; icon?: React.ReactNode; variant?: any } {
    return action && typeof action === 'object' && 'label' in action && !React.isValidElement(action);
}

import React from "react"
