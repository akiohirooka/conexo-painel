import { requireAuth } from "@/lib/auth"
import { getUserReviews } from "@/actions/get-user-reviews"
import { MeusReviewsClient } from "./client"

export default async function MeusReviewsPage() {
    await requireAuth()

    const { data: reviews } = await getUserReviews()

    return <MeusReviewsClient reviews={reviews || []} />
}
