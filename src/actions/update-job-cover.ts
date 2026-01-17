"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateJobCover(jobId: string | number, coverUrl: string) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const id = BigInt(jobId)

        // Verify ownership
        const job = await db.jobs.findFirst({
            where: {
                id,
                clerk_user_id: userId
            }
        })

        if (!job) {
            return { success: false, error: "Vaga não encontrada" }
        }

        await db.jobs.update({
            where: { id },
            data: {
                cover_image_url: coverUrl,
                updated_at: new Date()
            }
        })

        revalidatePath('/listings/jobs')
        return { success: true }
    } catch (error) {
        console.error("Failed to update job cover:", error)
        const message = error instanceof Error ? error.message : "Failed to update cover"
        return { success: false, error: message }
    }
}
