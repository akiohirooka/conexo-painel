"use client"

import React from 'react'
import { ListingType, useWizard } from './wizard-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Calendar, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const types: { id: ListingType; title: string; description: string; icon: React.ElementType }[] = [
    {
        id: 'business',
        title: 'Negócio',
        description: 'Cadastre uma empresa, restaurante, loja ou serviço local.',
        icon: Building2,
    },
    {
        id: 'event',
        title: 'Evento',
        description: 'Divulgue shows, workshops, feiras e encontros.',
        icon: Calendar,
    },
    {
        id: 'job',
        title: 'Vaga de Emprego',
        description: 'Publique oportunidades de trabalho e encontre talentos.',
        icon: Briefcase,
    },
]

export function TypeSelection() {
    const { setListingType, setTotalSteps } = useWizard()

    const handleSelect = (type: ListingType) => {
        setListingType(type)
        // Set total steps based on type (adjust numbers based on actual implementation)
        if (type === 'business') setTotalSteps(4) // Basic, Location, Contact, Extras/Gallery
        if (type === 'event') setTotalSteps(4)    // Basic, Date/Loc/Price, Contact, Gallery
        if (type === 'job') setTotalSteps(5)      // Basic, Loc/Sal, Desc, Reqs, Contact/Cover
    }

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">O que você deseja anunciar?</h1>
                <p className="text-muted-foreground text-lg">Escolha a categoria que melhor se adapta ao seu anúncio.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                {types.map((type) => (
                    <Card
                        key={type.id}
                        className={cn(
                            "cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all duration-300 group relative overflow-hidden",
                            "border-2 hover:scale-[1.02]"
                        )}
                        onClick={() => handleSelect(type.id)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <type.icon className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <CardTitle className="text-xl">{type.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <CardDescription>{type.description}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
