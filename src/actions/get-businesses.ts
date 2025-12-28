"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getBusinesses() {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const businesses = await db.businesses.findMany({
            where: {
                clerk_user_id: userId,
            },
            select: {
                id: true,
                name: true,
                category: true,
                description: true,
                is_verified: true,
                is_published: true,
                // Schema checks:
                // id: BigInt
                // clerk_user_id: String
                // business_category_id: BigInt
                // name: String
                // slug: String
                // site_url: String?
                // category: String?
                // description: String
                // is_verified: Boolean
                // is_published: Boolean
                // created_at: DateTime
                // updated_at: DateTime

                // Wait, the schema I saw:
                // model businesses {
                //   id                   BigInt
                //   ...
                //   rating               Decimal?            @default(0) @db.Decimal(2, 1)
                //   review_count         Int                 @default(0)
                //   is_verified          Boolean             @default(false)
                //   is_open              Boolean             @default(false)
                //   is_published         Boolean             @default(false) 
                //   created_at           DateTime
                //   ...
                // }
                // There is no `status` field in `businesses` table in the schema I viewed! 
                // `events` and `jobs` have `status` (ListingStatus enum), but `businesses` has `is_published`, `is_verified`.
                // I will use `is_published` and `is_verified` to derive status if needed, or just return them.

                created_at: true,
                slug: true,
                logo_url: true,
                review_count: true,
                rating: true,
                city: true,
                state: true,
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        const safeBusinesses = businesses.map(b => ({
            ...b,
            id: b.id.toString(),
            rating: b.rating ? b.rating.toNumber() : 0, // Decimal to number
        }))

        return { success: true, data: safeBusinesses }
    } catch (error) {
        console.error("Failed to fetch businesses:", error)
        return { success: false, error: "Failed to fetch businesses" }
    }
}
