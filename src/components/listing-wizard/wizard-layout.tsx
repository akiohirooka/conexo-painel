"use client"

import React, { ReactNode } from 'react'
import { useWizard } from './wizard-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Save, Send } from 'lucide-react'
import { toast } from 'sonner'
import { PreviewPanel } from './preview-panel'

interface WizardLayoutProps {
    children: ReactNode
}

export function WizardLayout({ children }: WizardLayoutProps) {
    const {
        currentStep,
        totalSteps,
        prevStep,
        nextStep,
        listingType,
        form
    } = useWizard()

    const isLastStep = currentStep === totalSteps - 1

    const handleNext = async () => {
        if (!form) return
        const isValid = await form.trigger() // Validate current form state
        if (isValid) {
            nextStep()
        } else {
            toast.error('Por favor, preencha os campos obrigatórios.')
        }
    }

    const handleSaveDraft = () => {
        // console.log("Draft saved:", form?.getValues())
        toast.success('Rascunho salvo com sucesso!')
    }

    const handleSubmit = async () => {
        if (!form) return
        const isValid = await form.trigger()
        if (isValid) {
            // console.log("Submitted:", form.getValues())
            toast.success('Anúncio enviado para aprovação!')
        }
    }

    if (!listingType) return <>{children}</> // Render Type Selection if no type

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            {/* LEFT: Form Area */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-background">
                {/* Header / Steps */}
                <div className="px-8 py-6 border-b flex items-center justify-between sticky top-0 bg-background z-10">
                    <div>
                        <h2 className="text-xl font-bold capitalize">Novo Anúncio ({listingType})</h2>
                        <p className="text-sm text-muted-foreground">
                            Passo {currentStep + 1} de {totalSteps}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                            <Save className="w-4 h-4 mr-2" />
                            Rascunho
                        </Button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8 max-w-2xl mx-auto w-full flex-1">
                    {children}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-background sticky bottom-0 flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>

                    {isLastStep ? (
                        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                            Enviar
                            <Send className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleNext}>
                            Próximo
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>

            {/* RIGHT: Preview Area */}
            <div className="w-[400px] border-l bg-muted/30 hidden xl:flex flex-col">
                <div className="p-4 border-b bg-background/50">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Preview</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <PreviewPanel />
                </div>
            </div>
        </div>
    )
}
