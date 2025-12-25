"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Check, X, Archive, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { RefusalModal } from "./refusal-modal";
import { PendingItem } from "../data";

interface ReviewHeaderProps {
    item: PendingItem;
}

export function ReviewHeader({ item }: ReviewHeaderProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [isRefusalOpen, setIsRefusalOpen] = useState(false);

    const handleApprove = async () => {
        setLoading("approve");
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({
            title: "Anúncio Aprovado",
            description: `O anúncio "${item.title}" foi aprovado com sucesso.`,
        });
        setLoading(null);
        router.push("/admin/pending");
    };

    const handleArchive = async () => {
        setLoading("archive");
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({
            title: "Anúncio Arquivado",
            description: `O anúncio "${item.title}" foi arquivado.`,
        });
        setLoading(null);
        router.push("/admin/pending");
    };

    const handleRefusal = async (reason: string) => {
        setLoading("refuse");
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Refusal reason:", reason);
        toast({
            title: "Anúncio Recusado",
            description: `O anúncio foi recusado.`,
            variant: "destructive",
        });
        setLoading(null);
        setIsRefusalOpen(false);
        router.push("/admin/pending");
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
            <div className="space-y-1">
                <Link
                    href="/admin/pending"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Voltar para pendentes
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Revisar Anúncio</h1>
                <p className="text-muted-foreground">
                    ID: <span className="font-mono text-xs">{item.id}</span> • Enviado por {item.author.name}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    onClick={handleArchive}
                    disabled={!!loading}
                >
                    {loading === "archive" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Archive className="mr-2 h-4 w-4" />}
                    Arquivar
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => setIsRefusalOpen(true)}
                    disabled={!!loading}
                >
                    {loading === "refuse" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                    Recusar
                </Button>
                <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleApprove}
                    disabled={!!loading}
                >
                    {loading === "approve" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                    Aprovar
                </Button>
            </div>

            <RefusalModal
                isOpen={isRefusalOpen}
                onClose={() => setIsRefusalOpen(false)}
                onConfirm={handleRefusal}
                title={item.title}
            />
        </div>
    );
}
