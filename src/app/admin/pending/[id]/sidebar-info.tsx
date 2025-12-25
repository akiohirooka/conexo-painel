"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PendingItem } from "../data";
import { Mail, Shield, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SidebarInfoProps {
    item: PendingItem;
}

export function SidebarInfo({ item }: SidebarInfoProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Autor</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={item.author.image} />
                            <AvatarFallback>{item.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{item.author.name}</p>
                            <p className="text-xs text-muted-foreground">{item.author.email}</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t space-y-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="mr-2 h-3 w-3" />
                            Email verificado
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Shield className="mr-2 h-3 w-3" />
                            Conta criada há 2 anos
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Metadados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Enviado:</span>
                        <span>{formatDistanceToNow(new Date(item.submittedAt), { addSuffix: true, locale: ptBR })}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipo:</span>
                        <span className="capitalize">{item.type}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status atual:</span>
                        <span className="capitalize">{item.status}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Example: AI Analysis Card (Mock) */}
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-500 flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Análise Automática
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                        O texto parece conter 98% de conteúdo original. Nenhuma palavra ofensiva detectada.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
