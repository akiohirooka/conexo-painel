"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateEventCover(eventId: string, coverUrl: string) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const id = BigInt(eventId)

        const existing = await db.events.findFirst({
            where: {
                id: id,
                clerk_user_id: userId
            }
        })

        if (!existing) {
            return { success: false, error: "Evento não encontrado" }
        }

        await db.events.update({
            where: { id: id },
            data: {
                cover_image_url: coverUrl,
                updated_at: new Date()
            }
        })

        revalidatePath('/listings/events')
        return { success: true }
    } catch (error) {
        console.error("Failed to update event cover:", error)
        return { success: false, error: "Erro ao atualizar capa" }
    }
}
