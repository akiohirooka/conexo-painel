"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Clock,
    DollarSign,
    Building2,
    Phone,
    MessageCircle,
    Calendar,
    Globe,
    Mail,
    Instagram,
    CheckCircle2,
    Ticket
} from "lucide-react";
import { PendingItem } from "../data";

interface ListingPreviewProps {
    item: PendingItem;
}

export function ListingPreview({ item }: ListingPreviewProps) {
    // Use a placeholder image if none exists (mock logic)
    const coverImage = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&h=400";

    const { details } = item;

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
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {item.type === "event" && details?.eventDate && (
                            <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-md">
                                {new Date(details.eventDate).toLocaleDateString()}
                            </Badge>
                        )}
                        {item.type === "job" && details?.workModel && (
                            <Badge variant="secondary" className="backdrop-blur-md bg-background/80 uppercase">
                                {details.workModel}
                            </Badge>
                        )}
                        {item.type === "event" && details?.isOnline && (
                            <Badge variant="secondary" className="backdrop-blur-md bg-background/80">
                                Online
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
                        <div className="flex items-center justify-between">
                            {details?.category && (
                                <Badge variant="outline" className="border-primary/20 text-primary">
                                    {details.category}
                                </Badge>
                            )}
                            {item.type === "job" && details?.company && (
                                <span className="text-sm font-medium text-muted-foreground">
                                    {details.company}
                                </span>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold leading-tight">{item.title}</h2>

                        {/* Job Subtitle */}
                        {item.type === "job" && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Building2 className="w-4 h-4" />
                                <span>{item.author.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Meta Grid */}
                    <div className="grid gap-3 text-sm">
                        {/* Location */}
                        {(item.location || details?.address?.city) && (
                            <div className="flex items-start gap-3 text-muted-foreground">
                                <MapPin className="w-4 h-4 mt-0.5" />
                                <span>
                                    {details?.address ?
                                        `${details.address.street || ''}, ${details.address.city} - ${details.address.state}`
                                        : item.location}
                                </span>
                            </div>
                        )}

                        {/* Date/Time (Event) */}
                        {item.type === "event" && details?.eventDate && (
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {new Date(details.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {details.startTime ? ` às ${details.startTime}` : ''}
                                </span>
                            </div>
                        )}

                        {/* Salary (Job) */}
                        {item.type === "job" && details?.salary && (
                            <div className="flex items-center gap-3 text-green-600 font-medium">
                                <DollarSign className="w-4 h-4" />
                                <span>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(details.salary.amount)}
                                    <span className="text-muted-foreground/80 font-normal lowercase"> /{details.salary.period}</span>
                                    {details.salary.negotiable && <span className="text-xs ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Negociável</span>}
                                </span>
                            </div>
                        )}

                        {/* Ticket Price (Event) */}
                        {item.type === "event" && (
                            <div className="flex items-center gap-3 font-medium">
                                <Ticket className="w-4 h-4 text-primary" />
                                <span>
                                    {details?.ticketPrice
                                        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(details.ticketPrice)
                                        : "Gratuito"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Contact Info (Business) */}
                    {item.type === "business" && details?.contact && (
                        <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                            <h4 className="font-medium text-sm">Contatos</h4>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                                {details.contact.whatsapp && (
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-green-600" />
                                        <span>{details.contact.whatsapp}</span>
                                    </div>
                                )}
                                {details.contact.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <span>{details.contact.phone}</span>
                                    </div>
                                )}
                                {details.contact.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span>{details.contact.email}</span>
                                    </div>
                                )}
                                {details.contact.instagram && (
                                    <div className="flex items-center gap-2">
                                        <Instagram className="w-4 h-4 text-pink-600" />
                                        <span>{details.contact.instagram}</span>
                                    </div>
                                )}
                                {details.contact.website && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-blue-600" />
                                        <a href={details.contact.website} target="_blank" className="hover:underline truncate">
                                            {details.contact.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Job Requirements & Benefits */}
                    {item.type === "job" && (
                        <div className="space-y-4">
                            {details?.requirements && details.requirements.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Requisitos</h4>
                                    <ul className="space-y-1">
                                        {details.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {details?.benefits && details.benefits.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    <h4 className="font-semibold text-sm">Benefícios</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {details.benefits.map((ben, i) => (
                                            <Badge key={i} variant="outline" className="bg-muted/50">
                                                {ben}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


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

                {/* Actions Footer */}
                <div className="p-4 bg-muted/10 border-t space-y-3">
                    {item.type === "event" && (
                        <Button className="w-full font-bold" size="lg" asChild>
                            <a href={details?.ticketUrl || "#"}>Comprar Ingresso</a>
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
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                WhatsApp
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer Disclaimer */}
                <div className="bg-muted/50 p-3 text-center text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                    Visualização do Cliente
                </div>
            </div>
        </div>
    );
}
