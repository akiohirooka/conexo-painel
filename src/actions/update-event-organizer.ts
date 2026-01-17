"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateEventOrganizer(eventId: string, organizerId: string) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const id = BigInt(eventId)
        const orgId = BigInt(organizerId)

        const existing = await db.events.findFirst({
            where: {
                id: id,
                clerk_user_id: userId
            }
        })

        if (!existing) {
            return { success: false, error: "Evento não encontrado" }
        }

        // Verify the business belongs to the user
        const business = await db.businesses.findFirst({
            where: {
                id: orgId,
                clerk_user_id: userId
            }
        })

        if (!business) {
            return { success: false, error: "Negócio não encontrado" }
        }

        await db.events.update({
            where: { id: id },
            data: {
                organizer_id: orgId,
                updated_at: new Date()
            }
        })

        revalidatePath('/listings/events')
        return { success: true }
    } catch (error) {
        console.error("Failed to update event organizer:", error)
        return { success: false, error: "Erro ao atualizar organizador" }
    }
}
