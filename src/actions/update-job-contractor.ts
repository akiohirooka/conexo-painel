"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateJobContractor(jobId: string, contractorId: string) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const id = BigInt(jobId)
        const newContractorId = BigInt(contractorId)

        // Verify job ownership
        const job = await db.jobs.findFirst({
            where: {
                id,
                clerk_user_id: userId
            }
        })

        if (!job) {
            return { success: false, error: "Vaga não encontrada" }
        }

        // Verify contractor (business) ownership
        const contractor = await db.businesses.findFirst({
            where: {
                id: newContractorId,
                clerk_user_id: userId
            }
        })

        if (!contractor) {
            return { success: false, error: "Contratante não encontrado" }
        }

        // Update job with new contractor
        await db.jobs.update({
            where: { id },
            data: {
                contractor_id: newContractorId,
                company_name: contractor.name, // Also update company name
                updated_at: new Date()
            }
        })

        revalidatePath('/listings/jobs')
        return { success: true }
    } catch (error) {
        console.error("Failed to update job contractor:", error)
        const message = error instanceof Error ? error.message : "Failed to update contractor"
        return { success: false, error: message }
    }
}
