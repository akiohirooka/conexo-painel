"use client"

import React from 'react'
import { useWizard } from './wizard-context'
import { TypeSelection } from './type-selection'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { businessSchema, eventSchema, jobSchema } from '@/lib/schemas/listing-wizard'
import { Form } from '@/components/ui/form'
import { z } from 'zod'

// Business Steps
import { BusinessBasicStep } from './steps/business/basic-info'
import { BusinessLocationStep } from './steps/business/location-step'
import { BusinessContactStep } from './steps/business/contact-step'
import { BusinessHoursStep } from './steps/business/hours-step' // New
import { BusinessMediaStep } from './steps/business/media-step' // New

// Event Steps
import { EventBasicStep } from './steps/event/basic-info'
import { EventDateLocationStep } from './steps/event/date-location'
import { EventContactStep } from './steps/event/contact-step'
import { EventGalleryStep } from './steps/event/gallery-step'

// Job Steps
import { JobBasicStep } from './steps/job/basic-info'
import { JobLocationSalaryStep } from './steps/job/location-salary'
import { JobDescriptionStep } from './steps/job/description-step'
import { JobRequirementsStep } from './steps/job/requirements-step'
import { JobContactCoverStep } from './steps/job/contact-cover'

// Placeholder imports for step components (to be implemented)
// We will replace these with real components in next steps
const PlaceholderStep = ({ name }: { name: string }) => (
    <div className="p-10 border border-dashed rounded-lg text-center text-muted-foreground">
        Step: {name} (Not Implemented)
    </div>
)

export function StepRenderer() {
    const { listingType, initialData } = useWizard()

    // Initialize form based on type
    // Note: In a real app we might want to lift this instantiation up or memoize it better 
    // to preserve state across re-renders if we were unmounting, 
    // but WizardLayout keeps this component mounted.
    // However, switching types resets everything which is fine.

    // We need a way to create the form only ONCE when type changes.
    // Since this component renders INSIDE the provider, we can use a side effect or 
    // just conditional rendering logic.

    // BETTER APPROACH:
    // Create a wrapper for the form that is only rendered when type is selected.

    if (!listingType) {
        return <TypeSelection />
    }

    return <StepContent initialData={initialData} />
}

function StepContent({ initialData }: { initialData?: Record<string, unknown> | null }) {
    const { listingType, currentStep, setForm } = useWizard()

    // Choose schema
    const schema = listingType === 'business' ? businessSchema
        : listingType === 'event' ? eventSchema
            : jobSchema

    const getDefaultValues = (type: string) => {
        // Cast type to any to satisfy Zod literal expectations during initialization
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const common = { type: type as any }

        if (type === 'business') {
            return {
                ...common,
                title: "",
                category: "",
                description: "",
                siteUrl: "",
                isPublished: false,
                location: { address: "", city: "", state: "", zipCode: "" },
                contactsData: [],
                openingHoursData: [],
                amenities: [],
                gallery: { images: [] },
                // Legacy fields just in case
                contact: { phone: "", whatsapp: "", email: "", website: "", instagram: "" }
            }
        }

        if (type === 'event') {
            return {
                ...common,
                title: "",
                description: "",
                category: "",
                startDate: "",
                endDate: "",
                startTime: "",
                location: { address: "", city: "", state: "", zipCode: "" },
                isOnline: false,
                price: 0,
                organizer: "",
                contact: { phone: "", whatsapp: "", email: "", website: "", instagram: "" },
                gallery: { images: [] }
            }
        }

        if (type === 'job') {
            return {
                ...common,
                title: "",
                company: "",
                workModel: "onsite",
                description: "",
                requirements: [],
                salary: { amount: 0, period: "month", currency: "BRL", negotiable: false },
                location: { city: "", state: "" }
            }
        }

        return common
    }

    const baseDefaults = React.useMemo(
        () => getDefaultValues(listingType || 'business'),
        [listingType]
    )

    const mergedDefaults = React.useMemo(() => {
        if (!initialData) return baseDefaults
        if (listingType === 'business') {
            return {
                ...baseDefaults,
                ...initialData,
                location: { ...baseDefaults.location, ...(initialData as any).location },
                gallery: { ...baseDefaults.gallery, ...(initialData as any).gallery },
                contact: { ...baseDefaults.contact, ...(initialData as any).contact },
            }
        }
        return { ...baseDefaults, ...initialData }
    }, [baseDefaults, initialData, listingType])

    const form = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        defaultValues: mergedDefaults as any
    })

    // Register form in context for Layout to access (for trigger validation)
    React.useEffect(() => {
        setForm(form)
    }, [form, setForm])


    // RENDER STEPS BASED ON TYPE AND INDEX
    // This is where we wire up the actual step components

    const renderBusinessStep = () => {
        switch (currentStep) {
            case 0: return <BusinessBasicStep />
            case 1: return <BusinessLocationStep />
            case 2: return <BusinessContactStep />
            case 3: return <BusinessHoursStep />
            case 4: return <BusinessMediaStep />
            default: return null
        }
    }

    const renderEventStep = () => {
        switch (currentStep) {
            case 0: return <EventBasicStep />
            case 1: return <EventDateLocationStep />
            case 2: return <EventContactStep />
            case 3: return <EventGalleryStep />
            default: return null
        }
    }

    const renderJobStep = () => {
        switch (currentStep) {
            case 0: return <JobBasicStep />
            case 1: return <JobLocationSalaryStep />
            case 2: return <JobDescriptionStep />
            case 3: return <JobRequirementsStep />
            case 4: return <JobContactCoverStep />
            default: return null
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                {listingType === 'business' && renderBusinessStep()}
                {listingType === 'event' && renderEventStep()}
                {listingType === 'job' && renderJobStep()}
            </form>
        </Form>
    )
}
