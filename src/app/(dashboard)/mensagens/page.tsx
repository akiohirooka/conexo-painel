import { requireAnyRole } from "@/lib/auth"
import { MensagensClient } from "./client"
import { getBusinessReviews } from "@/actions/get-business-reviews"

export default async function MensagensPage() {
    await requireAnyRole(['user', 'business'])

    const { data: reviews } = await getBusinessReviews()

    return <MensagensClient reviews={reviews || []} />
}
