import { WizardProvider } from '@/components/listing-wizard/wizard-context'
import { WizardLayout } from '@/components/listing-wizard/wizard-layout'
import { StepRenderer } from '@/components/listing-wizard/step-renderer'
import { getBusiness } from '@/actions/get-business'
import { getEvent } from '@/actions/get-event'

interface EditListingPageProps {
    params: { id: string }
    searchParams: { type?: string }
}

export default async function EditListingPage({ params, searchParams }: EditListingPageProps) {
    const { id } = params
    const listingType = searchParams.type || 'business'

    if (listingType === 'event') {
        const { success, data, error } = await getEvent(id)

        if (!success || !data) {
            return (
                <div className="p-8 text-sm text-destructive">
                    {error || "Não foi possível carregar este evento."}
                </div>
            )
        }

        return (
            <WizardProvider
                initialType="event"
                initialData={data}
                initialIsEditMode
                initialEditId={data.id}
            >
                <WizardLayout>
                    <StepRenderer />
                </WizardLayout>
            </WizardProvider>
        )
    }

    // Default: business
    const { success, data, error } = await getBusiness(id)

    if (!success || !data) {
        return (
            <div className="p-8 text-sm text-destructive">
                {error || "Não foi possível carregar este negócio."}
            </div>
        )
    }

    return (
        <WizardProvider
            initialType="business"
            initialData={data}
            initialIsEditMode
            initialEditId={data.id}
        >
            <WizardLayout>
                <StepRenderer />
            </WizardLayout>
        </WizardProvider>
    )
}
