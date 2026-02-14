"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function TutorialModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [dontShowAgain, setDontShowAgain] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const hasSeenTutorial = localStorage.getItem("conexo_tutorial_seen")
        if (!hasSeenTutorial) {
            setIsOpen(true)
        }
    }, [])

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            if (dontShowAgain) {
                localStorage.setItem("conexo_tutorial_seen", "true")
            }
            setIsOpen(false)
        }
    }

    if (!isMounted) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Bem-vindo ao Painel Conexo</DialogTitle>
                </DialogHeader>
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/UlbDy9Tvm-8"
                        title="Tutorial Conexo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="h-full w-full"
                    ></iframe>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="dont-show"
                        checked={dontShowAgain}
                        onCheckedChange={(checked: boolean) => setDontShowAgain(!!checked)}
                    />
                    <Label
                        htmlFor="dont-show"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                        Não mostrar este tutorial novamente
                    </Label>
                </div>
            </DialogContent>
        </Dialog>
    )
}
