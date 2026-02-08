"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function hasUserBusiness() {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized", hasBusiness: false }
    }

    try {
        const count = await db.businesses.count({
            where: {
                clerk_user_id: userId,
            },
        })

        return { success: true, hasBusiness: count > 0 }
    } catch (error) {
        console.error("Failed to check user businesses:", error)
        return { success: false, error: "Failed to check user businesses", hasBusiness: false }
    }
}
