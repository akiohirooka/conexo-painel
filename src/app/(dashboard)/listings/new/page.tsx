import { WizardProvider } from '@/components/listing-wizard/wizard-context'
import { WizardLayout } from '@/components/listing-wizard/wizard-layout'
import { StepRenderer } from '@/components/listing-wizard/step-renderer'
import { ListingType } from '@/components/listing-wizard/wizard-context'
import { requireRole } from "@/lib/auth"

interface NewListingPageProps {
    searchParams: { type?: string }
}

export default async function NewListingPage({ searchParams }: NewListingPageProps) {
    await requireRole('business')

    const type = searchParams.type as ListingType | undefined
    const validTypes: ListingType[] = ['business', 'event', 'job']
    const initialType = type && validTypes.includes(type) ? type : undefined

    return (
        <WizardProvider initialType={initialType}>
            <WizardLayout>
                <StepRenderer />
            </WizardLayout>
        </WizardProvider>
    )
}
