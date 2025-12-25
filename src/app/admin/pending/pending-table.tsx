"use client";

import { DataTable } from "@/components/ui/data-table";
import { PendingItem } from "./data";
import { StatusBadge } from "@/components/ui-conexo/status-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PendingTableProps {
    data: PendingItem[];
    loading?: boolean;
}

export function PendingTable({ data, loading }: PendingTableProps) {
    const columns = [
        {
            key: "title",
            header: "Título",
            render: (item: PendingItem) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.description.slice(0, 50)}...</span>
                </div>
            ),
        },
        {
            key: "type",
            header: "Tipo",
            render: (item: PendingItem) => {
                const typeLabels: Record<string, string> = {
                    business: "Negócio",
                    event: "Evento",
                    job: "Vaga",
                };
                const typeColors: Record<string, string> = {
                    business: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-900",
                    event: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-900",
                    job: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-900",
                };

                return (
                    <Badge
                        variant="outline"
                        className={`border font-normal ${typeColors[item.type] || ""}`}
                    >
                        {typeLabels[item.type] || item.type}
                    </Badge>
                );
            },
        },
        {
            key: "author",
            header: "Autor",
            render: (item: PendingItem) => (
                <div className="flex flex-col text-sm">
                    <span>{item.author.name}</span>
                    <span className="text-muted-foreground text-xs">{item.author.email}</span>
                </div>
            ),
        },
        {
            key: "submittedAt",
            header: "Enviado em",
            render: (item: PendingItem) => (
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(item.submittedAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (item: PendingItem) => <StatusBadge status={item.status} className="border" />,
        },
        {
            key: "actions",
            header: "Ações",
            className: "text-right",
            render: (item: PendingItem) => (
                <div className="flex justify-end">
                    <Link href={`/admin/pending/${item.id}`}>
                        <Button size="sm" variant="outline">
                            Revisar
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
            searchable
            searchKeys={["title", "type", "description"]}
            searchPlaceholder="Buscar por título, tipo ou descrição..."
            loading={loading}
            emptyMessage="Nenhuma pendência encontrada."
        />
    );
}
