"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface RefusalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    title: string;
}

export function RefusalModal({ isOpen, onClose, onConfirm, title }: RefusalModalProps) {
    const [reason, setReason] = useState("");

    const handleConfirm = () => {
        if (!reason.trim()) return;
        onConfirm(reason);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        Recusar Anúncio
                    </DialogTitle>
                    <DialogDescription>
                        Você está prestes a recusar o anúncio <span className="font-semibold text-foreground">"{title}"</span>.
                        Por favor, informe o motivo da recusa para notificar o autor.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea
                        placeholder="Descreva o motivo da recusa... (Ex: Imagens de baixa qualidade, informações incompletas)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="h-32 resize-none"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={!reason.trim()}
                    >
                        Confirmar Recusa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
