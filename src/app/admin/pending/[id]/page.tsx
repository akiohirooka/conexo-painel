"use client";

import React, { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { ReviewHeader } from "./review-header";
import { ListingPreview } from "./listing-preview";
import { SidebarInfo } from "./sidebar-info";
import { getPendingItemById, PendingItem } from "../data";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function ReviewPage() {
    const params = useParams();
    const id = params?.id as string;
    const [item, setItem] = useState<PendingItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchItem = async () => {
            const data = await getPendingItemById(id);
            if (data) {
                setItem(data);
            }
            setLoading(false);
        };

        fetchItem();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!item) {
        return (
            <AdminGuard>
                <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold">Item não encontrado</h1>
                    <p className="text-muted-foreground">O item que você procura não existe ou foi removido.</p>
                </div>
            </AdminGuard>
        );
    }

    return (
        <AdminGuard>
            <div className="space-y-6 pb-20">
                <ReviewHeader item={item} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ListingPreview item={item} />
                    </div>
                    <div>
                        <SidebarInfo item={item} />
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
