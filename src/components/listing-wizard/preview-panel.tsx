"use client"

import React from 'react'
import { useWizard } from './wizard-context'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Clock, DollarSign, Building2, Briefcase, Mail, Phone, Globe, ExternalLink, MessageCircle } from 'lucide-react'

export function PreviewPanel() {
    const { listingType, form } = useWizard()
    const values = form?.watch() || {}

    if (!listingType) return (
        <div className="flex h-full items-center justify-center text-muted-foreground">
            Selecione um tipo para ver o preview.
        </div>
    )

    const coverImage = values.coverImage || values.gallery?.images?.[0]

    return (
        <div className="space-y-6">
            {/* Mobile Mockup Frame Style */}
            <div className="border bg-background rounded-3xl overflow-hidden shadow-2xl">
                {/* Header Image */}
                <div className="bg-muted h-48 relative overflow-hidden group">
                    {coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground/30 font-bold bg-muted-foreground/10">
                            SEM IMAGEM
                        </div>
                    )}
                    {/* Overlay Tags */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        {listingType === 'event' && <Badge className="bg-primary/90 hover:bg-primary">{values.date || 'Data'}</Badge>}
                        {listingType === 'job' && <Badge variant="secondary" className="backdrop-blur-md bg-background/80">{values.workModel || 'Modelo'}</Badge>}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Header Info */}
                    <div className="space-y-2">
                        {listingType === 'business' && (
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className="border-primary/20 text-primary">{values.category || 'Categoria'}</Badge>
                            </div>
                        )}

                        <h2 className="text-2xl font-bold leading-tight">{values.title || 'Título do Anúncio'}</h2>

                        {/* Subtitles */}
                        {listingType === 'job' && values.company && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Building2 className="w-4 h-4" />
                                <span>{values.company}</span>
                            </div>
                        )}

                        {listingType === 'event' && values.organizer && (
                            <div className="text-sm text-muted-foreground">
                                por <span className="font-medium text-foreground">{values.organizer}</span>
                            </div>
                        )}
                    </div>

                    {/* Meta Grid */}
                    <div className="grid gap-3 text-sm">
                        {/* Location */}
                        {(values.location?.city || values.location?.address) && (
                            <div className="flex items-start gap-3 text-muted-foreground">
                                <MapPin className="w-4 h-4 mt-0.5" />
                                <span>
                                    {values.location.address && <span className="block">{values.location.address}</span>}
                                    {values.location.city && <span>{values.location.city}, {values.location.state}</span>}
                                </span>
                            </div>
                        )}

                        {/* Date/Time (Event) */}
                        {listingType === 'event' && values.startTime && (
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{values.startTime}</span>
                            </div>
                        )}

                        {/* Salary (Job) */}
                        {listingType === 'job' && values.salary?.amount && (
                            <div className="flex items-center gap-3 text-green-600 font-medium">
                                <DollarSign className="w-4 h-4" />
                                <span>
                                    {Number(values.salary.amount).toLocaleString('pt-BR', { style: 'currency', currency: values.salary.currency || 'BRL' })}
                                    <span className="text-muted-foreground text-xs font-normal ml-1">/{values.salary.period}</span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-2">
                        {listingType === 'event' && (
                            <Button className="w-full font-bold" size="lg">
                                Comprar Ingresso
                            </Button>
                        )}
                        {listingType === 'job' && (
                            <Button className="w-full font-bold" size="lg">
                                Aplicar para a Vaga
                            </Button>
                        )}
                        {listingType === 'business' && (
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
                    {values.description && (
                        <div className="space-y-2 pt-4 border-t">
                            <h3 className="font-semibold text-sm">Sobre</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {values.description.length > 200 ? values.description.slice(0, 200) + '...' : values.description}
                            </p>
                        </div>
                    )}

                    {/* Extras Lists */}
                    {listingType === 'business' && values.amenities?.length > 0 && (
                        <div className="pt-4 border-t">
                            <h3 className="font-semibold text-sm mb-2">Comodidades</h3>
                            <div className="flex flex-wrap gap-2">
                                {values.amenities.map((item: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="text-xs font-normal">
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {listingType === 'job' && values.requirements?.length > 0 && (
                        <div className="pt-4 border-t">
                            <h3 className="font-semibold text-sm mb-2">Requisitos</h3>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {values.requirements.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-muted/50 p-4 text-center text-xs text-muted-foreground">
                    Visualização prévia do anúncio
                </div>
            </div>
        </div>
    )
}
