"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getUserBusinesses() {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized", data: [] }
    }

    try {
        const businesses = await db.businesses.findMany({
            where: {
                clerk_user_id: userId
            },
            select: {
                id: true,
                name: true,
                logo_url: true,
            },
            orderBy: {
                name: 'asc'
            }
        })

        return {
            success: true,
            data: businesses.map(b => ({
                id: b.id.toString(),
                name: b.name,
                logoUrl: b.logo_url
            }))
        }
    } catch (error) {
        console.error("Failed to get user businesses:", error)
        return { success: false, error: "Erro ao carregar negócios", data: [] }
    }
}
