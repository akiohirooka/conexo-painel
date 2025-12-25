"use client";

import React, { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { PendingTable } from "./pending-table";
import { getPendingItems, PendingItem } from "./data";

export default function PendingListPage() {
    const [items, setItems] = useState<PendingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            const data = await getPendingItems();
            setItems(data);
            setLoading(false);
        };

        fetchItems();
    }, []);

    return (
        <AdminGuard>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Moderação</h1>
                    <p className="text-muted-foreground">
                        Gerencie os anúncios pendentes de aprovação.
                    </p>
                </div>

                <PendingTable data={items} loading={loading} />
            </div>
        </AdminGuard>
    );
}
