"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    MapPin,
    Clock,
    DollarSign,
    Building2,
    Phone,
    MessageCircle,
    Calendar
} from "lucide-react";
import { PendingItem } from "../data";

interface ListingPreviewProps {
    item: PendingItem;
}

export function ListingPreview({ item }: ListingPreviewProps) {
    // Use a placeholder image if none exists (mock logic)
    const coverImage = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&h=400";

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Pré-visualização</h2>
            {/* Mobile Mockup Frame Style similar to PreviewPanel */}
            <div className="border bg-background rounded-3xl overflow-hidden shadow-sm max-w-2xl mx-auto">
                {/* Header Image */}
                <div className="bg-muted h-48 relative overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay Tags */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        {item.type === "event" && item.details?.eventDate && (
                            <Badge className="bg-primary/90 hover:bg-primary">
                                {new Date(item.details.eventDate).toLocaleDateString()}
                            </Badge>
                        )}
                        {item.type === "job" && (
                            <Badge variant="secondary" className="backdrop-blur-md bg-background/80">
                                Remoto
                            </Badge>
                        )}
                        {/* Show Pending Status on Preview */}
                        <Badge variant="destructive" className="animate-pulse">
                            Modo Preview (Pendente)
                        </Badge>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Header Info */}
                    <div className="space-y-2">
                        {item.type === "business" && item.details?.category && (
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className="border-primary/20 text-primary">
                                    {item.details.category}
                                </Badge>
                            </div>
                        )}

                        <h2 className="text-2xl font-bold leading-tight">{item.title}</h2>

                        {/* Subtitles */}
                        {item.type === "job" && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Building2 className="w-4 h-4" />
                                <span>{item.author.name} (Empresa)</span>
                            </div>
                        )}
                    </div>

                    {/* Meta Grid */}
                    <div className="grid gap-3 text-sm">
                        {/* Location */}
                        {item.location && (
                            <div className="flex items-start gap-3 text-muted-foreground">
                                <MapPin className="w-4 h-4 mt-0.5" />
                                <span>{item.location}</span>
                            </div>
                        )}

                        {/* Date/Time (Event) */}
                        {item.type === "event" && item.details?.eventDate && (
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(item.details.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        )}

                        {/* Salary (Job) */}
                        {item.type === "job" && item.details?.salaryRange && (
                            <div className="flex items-center gap-3 text-green-600 font-medium">
                                <DollarSign className="w-4 h-4" />
                                <span>{item.details.salaryRange}</span>
                            </div>
                        )}
                    </div>

                    {/* Actions (Mock) */}
                    <div className="pt-2 opacity-50 pointer-events-none grayscale">
                        {item.type === "event" && (
                            <Button className="w-full font-bold" size="lg">
                                Comprar Ingresso
                            </Button>
                        )}
                        {item.type === "job" && (
                            <Button className="w-full font-bold" size="lg">
                                Aplicar para a Vaga
                            </Button>
                        )}
                        {item.type === "business" && (
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="w-full">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Ligar
                                </Button>
                                <Button className="w-full">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    WhatsApp
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="space-y-2 pt-4 border-t">
                            <h3 className="font-semibold text-sm">Sobre</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {item.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-muted/50 p-4 text-center text-xs text-muted-foreground">
                    Visualização como aparecerá para o usuário final
                </div>
            </div>
        </div>
    );
}
