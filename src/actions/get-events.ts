"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getEvents() {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const events = await db.events.findMany({
            where: {
                clerk_user_id: userId,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                cover_image_url: true,
                starts_at: true,
                ends_at: true,
                price_amount: true,
                price_currency: true,
                status: true,
                is_active: true,
                event_mode: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        const safeEvents = events.map(e => ({
            ...e,
            id: e.id.toString(),
        }))

        return { success: true, data: safeEvents }
    } catch (error) {
        console.error("Failed to fetch events:", error)
        return { success: false, error: "Failed to fetch events" }
    }
}

