import { requireRole } from "@/lib/auth"
import { MensagensClient } from "./client"
import { getBusinessReviews } from "@/actions/get-business-reviews"

export default async function MensagensPage() {
    await requireRole('business')

    const { data: reviews } = await getBusinessReviews()

    return <MensagensClient reviews={reviews || []} />
}
