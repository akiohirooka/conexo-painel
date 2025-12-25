import { WizardProvider } from '@/components/listing-wizard/wizard-context'
import { WizardLayout } from '@/components/listing-wizard/wizard-layout'
import { StepRenderer } from '@/components/listing-wizard/step-renderer'

export default function NewListingPage() {
    return (
        <WizardProvider>
            <WizardLayout>
                <StepRenderer />
            </WizardLayout>
        </WizardProvider>
    )
}
