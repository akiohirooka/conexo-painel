"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateEventGallery(eventId: string, galleryUrls: string[]) {
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
                gallery_images: galleryUrls,
                updated_at: new Date()
            }
        })

        revalidatePath('/listings/events')
        return { success: true }
    } catch (error) {
        console.error("Failed to update event gallery:", error)
        return { success: false, error: "Erro ao atualizar galeria" }
    }
}
