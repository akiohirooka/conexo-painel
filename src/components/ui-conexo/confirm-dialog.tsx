"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    title?: string
    description?: string
    cancelLabel?: string
    confirmLabel?: string
    onConfirm: () => void | Promise<void>
    variant?: "default" | "destructive"
}

export function ConfirmDialog({
    trigger,
    open,
    onOpenChange,
    title = "Você tem certeza?",
    description = "Essa ação não pode ser desfeita.",
    cancelLabel = "Cancelar",
    confirmLabel = "Confirmar",
    onConfirm,
    variant = "default",
}: ConfirmDialogProps) {
    const handleConfirm = async (e: React.MouseEvent) => {
        e.preventDefault()
        await onConfirm()
        onOpenChange?.(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
