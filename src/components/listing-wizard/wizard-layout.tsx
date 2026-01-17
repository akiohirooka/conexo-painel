"use client"

import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect, useState } from 'react'
import { useWizard, ListingType } from './wizard-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Send, Plus, Building2, AlertTriangle, Check, ChevronRight } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Switch } from '@/components/ui/switch'
import { Controller } from 'react-hook-form'
import { getUserBusinesses } from '@/actions/get-user-businesses'
import { updateEventOrganizer } from '@/actions/update-event-organizer'
import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface WizardLayoutProps {
    children: ReactNode
}

interface BusinessOption {
    id: string
    name: string
    logoUrl: string | null
}

export function WizardLayout({ children }: WizardLayoutProps) {
    const {
        currentStep,
        setCurrentStep,
        listingType,
        form,
        isEditMode,
        editId
    } = useWizard()

    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [userBusinesses, setUserBusinesses] = useState<BusinessOption[]>([])
    const [loadingBusinesses, setLoadingBusinesses] = useState(false)
    const router = useRouter()

    // Modal state
    const [isOrganizerModalOpen, setIsOrganizerModalOpen] = useState(false)
    const [selectedOrganizerId, setSelectedOrganizerId] = useState('')
    const [confirmedOrganizer, setConfirmedOrganizer] = useState<BusinessOption | null>(null)
    const [isPublished, setIsPublished] = useState(false)

    // Load user businesses when event type is selected
    useEffect(() => {
        if (listingType === 'event') {
            setLoadingBusinesses(true)
            getUserBusinesses().then(result => {
                if (result.success) {
                    setUserBusinesses(result.data)
                }
                setLoadingBusinesses(false)
            })
        }
    }, [listingType])

    // Initialize from form value when editing
    useEffect(() => {
        if (!form || listingType !== 'event') return

        const formOrganizerId = form.getValues('organizerId')
        if (formOrganizerId && userBusinesses.length > 0) {
            const found = userBusinesses.find(b => b.id === formOrganizerId)
            if (found) {
                setConfirmedOrganizer(found)
                setSelectedOrganizerId(formOrganizerId)
            }
        }

        // Initialize publish state from form
        setIsPublished(Boolean(form.getValues('isPublished')))
    }, [form, listingType, userBusinesses])

    const hasOrganizer = !!confirmedOrganizer

    const handleConfirmOrganizer = async () => {
        const selected = userBusinesses.find(b => b.id === selectedOrganizerId)
        if (selected && form) {
            setConfirmedOrganizer(selected)
            // Set form value with proper options to trigger validation
            form.setValue('organizerId', selected.id, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            })
            setIsOrganizerModalOpen(false)

            // Auto-save to database if editing existing event
            if (editId) {
                const result = await updateEventOrganizer(editId, selected.id)
                if (result.success) {
                    toast({
                        title: 'Organizador salvo!',
                        description: `${selected.name} foi definido como organizador.`,
                        variant: 'success',
                    })
                } else {
                    toast({
                        title: 'Erro ao salvar',
                        description: result.error || 'Não foi possível salvar o organizador.',
                        variant: 'destructive',
                    })
                }
            } else {
                toast({
                    title: 'Organizador selecionado!',
                    description: `${selected.name} será o organizador deste evento.`,
                    variant: 'success',
                })
            }
        }
    }

    const handleSubmit = async () => {
        if (!form) return

        setIsSubmitting(true)

        // Ensure organizerId is set before validation for events
        if (listingType === 'event' && confirmedOrganizer) {
            form.setValue('organizerId', confirmedOrganizer.id, { shouldValidate: false })
        }

        const isValid = await form.trigger()

        if (isValid) {
            try {
                const data = form.getValues()

                if (listingType === 'business') {
                    if (isEditMode && editId) {
                        const { updateBusiness } = await import('@/actions/update-business')
                        const result = await updateBusiness({ ...data, id: editId })

                        if (result.success) {
                            toast({
                                title: 'Negócio atualizado com sucesso!',
                                variant: 'success',
                            })
                            router.push('/listings/business')
                        } else {
                            console.error(result.error)
                            toast({
                                title: typeof result.error === 'string' ? result.error : 'Erro ao atualizar. Tente novamente.',
                                variant: 'danger',
                            })
                            return
                        }
                    } else {
                        const { createBusiness } = await import('@/actions/create-business')
                        const result = await createBusiness(data)

                        if (result.success) {
                            toast({
                                title: 'Anúncio criado com sucesso!',
                                variant: 'success',
                            })
                            router.push('/listings/business')
                        } else {
                            console.error(result.error)
                            toast({
                                title: typeof result.error === 'string' ? result.error : 'Erro ao criar anúncio. Tente novamente.',
                                variant: 'danger',
                            })
                            return
                        }
                    }
                } else if (listingType === 'event') {
                    if (isEditMode && editId) {
                        const { updateEvent } = await import('@/actions/update-event')
                        const result = await updateEvent({ ...data, id: editId })

                        if (result.success) {
                            toast({
                                title: 'Evento atualizado com sucesso!',
                                variant: 'success',
                            })
                            router.push('/listings/events')
                        } else {
                            console.error(result.error)
                            toast({
                                title: typeof result.error === 'string' ? result.error : 'Erro ao atualizar. Tente novamente.',
                                variant: 'danger',
                            })
                            return
                        }
                    } else {
                        const { createEvent } = await import('@/actions/create-event')
                        const result = await createEvent(data)

                        if (result.success) {
                            toast({
                                title: 'Evento criado com sucesso!',
                                variant: 'success',
                            })
                            router.push('/listings/events')
                        } else {
                            console.error(result.error)
                            toast({
                                title: typeof result.error === 'string' ? result.error : 'Erro ao criar evento. Tente novamente.',
                                variant: 'danger',
                            })
                            return
                        }
                    }
                }
            } catch (error) {
                console.error(error)
                toast({
                    title: 'Ocorreu um erro inesperado.',
                    variant: 'danger',
                })
            }
        } else {
            const collectErrors = (errObj: any, path: string[] = []): string[] => {
                if (!errObj) return []
                const entries = Object.entries(errObj) as [string, any][]
                const messages: string[] = []
                for (const [key, val] of entries) {
                    if (val?.message) {
                        messages.push(`${[...path, key].join('.')}: ${val.message}`)
                    }
                    if (val?.types) {
                        messages.push(...Object.values(val.types) as string[])
                    }
                    if (val && typeof val === 'object') {
                        messages.push(...collectErrors(val, [...path, key]))
                    }
                }
                return messages
            }
            const errors = collectErrors(form.formState.errors)
            console.warn('Form validation errors:', errors)

            toast({
                title: errors[0] || 'Por favor, corrija os erros nos passos anteriores antes de enviar.',
                variant: 'danger',
            })
        }
        setIsSubmitting(false)
    }

    if (!listingType) return <>{children}</> // Render Type Selection

    // Step definitions for tabs
    const stepsMap: Record<ListingType, string[]> = {
        business: ['Principal', 'Localização', 'Contatos', 'Horários', 'Mídia'],
        event: ['Básico', 'Data e Local', 'Contatos', 'Galeria'],
        job: ['Básico', 'Detalhes', 'Descrição', 'Requisitos', 'Finalização']
    }

    const currentStepNames = listingType ? stepsMap[listingType] : []

    const getTitle = () => {
        if (isEditMode) {
            switch (listingType) {
                case 'business': return 'Editar Negócio'
                case 'event': return 'Editar Evento'
                case 'job': return 'Editar Vaga'
                default: return 'Editar Anúncio'
            }
        }
        switch (listingType) {
            case 'business': return 'Novo Negócio'
            case 'event': return 'Novo Evento'
            case 'job': return 'Nova Vaga'
            default: return 'Novo Anúncio'
        }
    }

    const handleTabClick = (index: number) => {
        // For events, block tab navigation if no organizer selected
        if (listingType === 'event' && !hasOrganizer) {
            toast({
                title: 'Selecione o organizador primeiro',
                description: 'Clique no botão de organizador para continuar.',
                variant: 'danger',
            })
            return
        }
        setCurrentStep(index)
    }

    const headerSubtitle = isEditMode
        ? 'Atualize as informações do anúncio.'
        : 'Preencha as informações abaixo'

    // Check if tabs should be disabled (for events without organizer)
    const tabsDisabled = listingType === 'event' && !hasOrganizer && userBusinesses.length > 0

    // No businesses: show create prompt
    const noBusinesses = listingType === 'event' && userBusinesses.length === 0 && !loadingBusinesses

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
            {/* Organizer Selection Modal */}
            <Dialog open={isOrganizerModalOpen} onOpenChange={setIsOrganizerModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Selecionar Organizador
                        </DialogTitle>
                        <DialogDescription>
                            Escolha qual negócio será o organizador deste evento.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2 max-h-[300px] overflow-y-auto">
                        {userBusinesses.map((biz) => (
                            <button
                                key={biz.id}
                                onClick={() => setSelectedOrganizerId(biz.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                                    selectedOrganizerId === biz.id
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                                )}
                            >
                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                    {biz.logoUrl ? (
                                        <img src={biz.logoUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
                                    ) : (
                                        <Building2 className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                                <span className="font-medium flex-1">{biz.name}</span>
                                {selectedOrganizerId === biz.id && (
                                    <Check className="h-5 w-5 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOrganizerModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirmOrganizer}
                            disabled={!selectedOrganizerId}
                        >
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Header with Tabs */}
            <div className="border-b bg-background sticky top-0 z-10">
                <div className="px-4 py-4 md:px-8 md:py-6 flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">{getTitle()}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {headerSubtitle}
                                </p>
                            </div>
                        </div>

                        {/* Event Organizer Display/Selector */}
                        {listingType === 'event' && form && (
                            <>
                                {loadingBusinesses ? (
                                    <div className="text-sm text-muted-foreground">Carregando...</div>
                                ) : noBusinesses ? (
                                    <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                                        <span className="text-sm text-amber-800">
                                            Crie um negócio primeiro para ser o organizador.
                                        </span>
                                        <Link href="/listings/new?type=business">
                                            <Button size="sm" variant="outline" className="gap-1 shrink-0">
                                                <Plus className="h-4 w-4" />
                                                Criar Negócio
                                            </Button>
                                        </Link>
                                    </div>
                                ) : hasOrganizer ? (
                                    // Organizer confirmed - show name with edit option
                                    <button
                                        onClick={() => setIsOrganizerModalOpen(true)}
                                        className="flex items-center gap-3 p-2 pl-3 pr-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        <Check className="h-5 w-5 text-green-600 shrink-0" />
                                        <span className="text-sm font-medium text-green-800">
                                            Organizador: {confirmedOrganizer?.name}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-green-600 ml-auto" />
                                    </button>
                                ) : (
                                    // No organizer - prompt to select
                                    <button
                                        onClick={() => setIsOrganizerModalOpen(true)}
                                        className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <Building2 className="h-5 w-5 text-blue-600 shrink-0" />
                                        <span className="text-sm font-medium text-blue-800">
                                            Clique para selecionar o organizador do evento
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-blue-600 ml-auto" />
                                    </button>
                                )}
                            </>
                        )}

                        {/* Publish Toggle - For Business and Events (only show when organizer selected for events) */}
                        {(listingType === 'business' || (listingType === 'event' && hasOrganizer)) && form && (
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={isPublished}
                                    onCheckedChange={(val) => {
                                        setIsPublished(val)
                                        form.setValue('isPublished', val, { shouldDirty: true })
                                    }}
                                />
                                <span className="text-sm font-bold text-foreground">
                                    Publicar
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || (listingType === 'event' && !hasOrganizer)}
                            className="font-medium px-6 shadow-sm"
                        >
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                            {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="px-4 md:px-8 flex gap-6 overflow-x-auto scrollbar-hide">
                    {currentStepNames.map((name, index) => {
                        const isActive = currentStep === index

                        return (
                            <button
                                key={index}
                                onClick={() => handleTabClick(index)}
                                disabled={tabsDisabled}
                                className={cn(
                                    "pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap px-1",
                                    tabsDisabled && "opacity-50 cursor-not-allowed",
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
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/5">
                {/* Hidden field to register organizerId in form */}
                {listingType === 'event' && form && (
                    <Controller
                        control={form.control}
                        name="organizerId"
                        defaultValue=""
                        render={({ field }) => (
                            <input
                                type="hidden"
                                {...field}
                                value={field.value || confirmedOrganizer?.id || ''}
                            />
                        )}
                    />
                )}
                <div className="max-w-4xl mx-auto bg-card rounded-xl border shadow-sm p-4 md:p-8">
                    {listingType === 'event' && !hasOrganizer && userBusinesses.length > 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">Selecione o Organizador</h3>
                            <p className="text-sm text-muted-foreground max-w-md mb-6">
                                Clique no botão azul acima para escolher qual negócio será o organizador deste evento.
                            </p>
                            <Button onClick={() => setIsOrganizerModalOpen(true)} className="gap-2">
                                <Building2 className="h-4 w-4" />
                                Selecionar Organizador
                            </Button>
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    )
}
