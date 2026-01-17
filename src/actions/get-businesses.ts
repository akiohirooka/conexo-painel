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
            rating: b.rating ? b.rating.toNumber() : 0,
            // logo_url is now stored as full URL in DB, no transformation needed
        }))

        return { success: true, data: safeBusinesses }
    } catch (error) {
        console.error("Failed to fetch businesses:", error)
        return { success: false, error: "Failed to fetch businesses" }
    }
}
