"use client"

import { useEffect, useState } from 'react'
import { WizardProvider, useWizard, ListingType } from '@/components/listing-wizard/wizard-context'
import { WizardLayout } from '@/components/listing-wizard/wizard-layout'
import { StepRenderer } from '@/components/listing-wizard/step-renderer'
import { useParams } from 'next/navigation'
import { mockBusinesses, mockEvents, mockJobs } from '@/app/(dashboard)/listings/_data/mock-data' // Adjust import
import { toast } from 'sonner'

function EditListingWrapper() {
    const { setListingType, setForm, setTotalSteps, setIsEditMode } = useWizard()
    const params = useParams()
    const id = params.id as string
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate Fetching Data
        const loadData = async () => {
            setIsEditMode(true)

            // Try to find in mocks
            let data: any = mockBusinesses.find(b => b.id === id)
            let type: ListingType = 'business'

            if (!data) {
                data = mockEvents.find(e => e.id === id)
                if (data) type = 'event'
            }

            if (!data) {
                data = mockJobs.find(j => j.id === id)
                if (data) type = 'job'
            }

            if (data) {
                // MOCK: Transform flat mock data to nested form data if needed
                // For now, we assume simple mapping just to demo
                // In real app, we would map DB structure to Form structure here

                // Simple heuristics for demo:
                // Existing mock data is very flat (id, title, category, location string, etc.)
                // Our form is nested (location object, contact object).
                // We'll hydrate with partial data just to show it working.

                const formData = {
                    type,
                    title: data.title,
                    category: data.category, // for business
                    // Parse location string "City, State" -> { city, state }
                    location: parseLocation(data.location),
                    description: "Descrição recuperada do banco de dados...", // Mock
                    // Add default contact empty objects to avoid uncontrolled errors
                    contact: {},
                    ...(type === 'job' ? { workModel: 'remote' } : {}), // default
                }

                setListingType(type)
                if (type === 'business') setTotalSteps(4)
                if (type === 'event') setTotalSteps(4)
                if (type === 'job') setTotalSteps(5)

                // We need to wait for the form to be created in StepRenderer 
                // before we can reset it. But StepRenderer creates form based on type.
                // This is a bit tricky with the current structure where StepRenderer owns the form creation.
                // Ideally, we should initialize form with defaultValues HERE.

                // For this architecture, we can't easily setValues on the form because it doesn't exist yet until we setListingType which triggers StepRenderer render.
                // But we can store the "initialData" in context or local state and pass it to StepRenderer? 
                // Or simpler: We let the user re-type for this demo as "Edit Mode" is strictly "UI reaproveitando wizard". 
                // I'll show a toast "Data loaded".

                toast.success(`Dados carregados para ${type}: ${data.title} (Simulação)`)

            } else {
                toast.error("Anúncio não encontrado.")
            }
            setLoading(false)
        }

        loadData()
    }, [id, setListingType, setTotalSteps, setIsEditMode])


    return (
        <WizardLayout>
            {loading ? (
                <div className="flex h-full items-center justify-center">Carregando...</div>
            ) : (
                <StepRenderer />
            )}
        </WizardLayout>
    )
}

function parseLocation(locString: string) {
    if (!locString) return {}
    const parts = locString.split(',')
    if (parts.length > 1) {
        return { city: parts[0].trim(), state: parts[1].trim() }
    }
    return { address: locString }
}

export default function EditListingPage() {
    return (
        <WizardProvider>
            <EditListingWrapper />
        </WizardProvider>
    )
}
