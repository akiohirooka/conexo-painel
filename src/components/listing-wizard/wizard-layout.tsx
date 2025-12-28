"use client"

import { useRouter } from 'next/navigation'
import React, { ReactNode } from 'react'
import { useWizard, ListingType } from './wizard-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Save, Send, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

interface WizardLayoutProps {
    children: ReactNode
}

export function WizardLayout({ children }: WizardLayoutProps) {
    const {
        currentStep,
        setCurrentStep,
        listingType,
        form
    } = useWizard()

    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        if (!form) return

        setIsSubmitting(true)
        const isValid = await form.trigger()

        if (isValid) {
            try {
                const data = form.getValues()

                if (listingType === 'business') {
                    const { createBusiness } = await import('@/actions/create-business')
                    const result = await createBusiness(data)

                    if (result.success) {
                        toast.success('Anúncio criado com sucesso!')
                        router.push('/dashboard/listings')
                    } else {
                        console.error(result.error)
                        toast.error('Erro ao criar anúncio. Tente novamente.')
                    }
                } else {
                    toast.info('Funcionalidade em desenvolvimento para este tipo.')
                }
            } catch (error) {
                console.error(error)
                toast.error('Ocorreu um erro inesperado.')
            }
        } else {
            toast.error('Por favor, corrija os erros nos passos anteriores antes de enviar.')
        }
        setIsSubmitting(false)
    }

    if (!listingType) return <>{children}</> // Render Type Selection

    // Step definitions for tabs
    const stepsMap: Record<ListingType, string[]> = {
        business: ['Básico', 'Localização', 'Contatos', 'Horários', 'Mídia'],
        event: ['Básico', 'Data e Local', 'Contatos', 'Galeria'],
        job: ['Básico', 'Detalhes', 'Descrição', 'Requisitos', 'Finalização']
    }

    const currentStepNames = listingType ? stepsMap[listingType] : []

    const getTitle = () => {
        switch (listingType) {
            case 'business': return 'Novo Negócio'
            case 'event': return 'Novo Evento'
            case 'job': return 'Nova Vaga'
            default: return 'Novo Anúncio'
        }
    }

    const handleTabClick = (index: number) => {
        setCurrentStep(index)
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
            {/* Header with Tabs */}
            <div className="border-b bg-background sticky top-0 z-10">
                <div className="px-8 py-6 flex items-center justify-between">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-foreground">{getTitle()}</h2>
                            <p className="text-sm text-muted-foreground">
                                Preencha as informações abaixo
                            </p>
                        </div>

                        {/* Publish Toggle - Only for Business for now or generic check */}
                        {listingType === 'business' && form && (
                            <div className="flex items-center gap-2 mt-2">
                                <Switch
                                    checked={form.watch('isPublished')}
                                    onCheckedChange={(val) => form.setValue('isPublished', val, { shouldDirty: true })}
                                    className="data-[state=checked]:bg-primary"
                                />
                                <span className="text-sm font-bold text-foreground">
                                    Publicar
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 shadow-sm"
                        >
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                            {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="px-8 flex gap-6 overflow-x-auto scrollbar-hide">
                    {currentStepNames.map((name, index) => {
                        const isActive = currentStep === index

                        return (
                            <button
                                key={index}
                                onClick={() => handleTabClick(index)}
                                className={cn(
                                    "pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap px-1",
                                    isActive
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                                )}
                            >
                                <span className="mr-2 text-xs opacity-70">{index + 1}.</span>
                                {name}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 bg-muted/5">
                <div className="max-w-4xl mx-auto bg-card rounded-xl border shadow-sm p-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
