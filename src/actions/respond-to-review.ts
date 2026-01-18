"use server"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const responseSchema = z.object({
    reviewId: z.string(),
    body: z.string().min(10, "A resposta deve ter pelo menos 10 caracteres").max(2000, "A resposta deve ter no máximo 2000 caracteres"),
})

export type ReviewResponseInput = z.infer<typeof responseSchema>

export async function respondToReview(data: ReviewResponseInput) {
    const user = await getCurrentUser()

    if (!user) {
        return { success: false, error: "Você precisa estar logado." }
    }

    // Validate input
    const result = responseSchema.safeParse(data)

    if (!result.success) {
        return { success: false, error: result.error.flatten().fieldErrors }
    }

    const { reviewId, body } = result.data

    try {
        // Get the review
        const review = await db.reviews.findUnique({
            where: { id: BigInt(reviewId) },
            include: { response: true }
        })

        if (!review) {
            return { success: false, error: "Review não encontrado." }
        }

        // Check if the review is for a business
        if (review.item_type !== 'BUSINESS') {
            return { success: false, error: "Tipo de review não suportado." }
        }

        // Verify the user owns this business
        const business = await db.businesses.findFirst({
            where: {
                id: review.item_id,
                clerk_user_id: user.clerkUserId
            }
        })

        if (!business) {
            return { success: false, error: "Você não tem permissão para responder este review." }
        }

        // Create or update the response
        if (review.response) {
            // Update existing response
            await db.review_responses.update({
                where: { review_id: BigInt(reviewId) },
                data: {
                    body,
                    updated_at: new Date()
                }
            })
        } else {
            // Create new response
            await db.review_responses.create({
                data: {
                    review_id: BigInt(reviewId),
                    responder_user_id: user.clerkUserId,
                    body
                }
            })
        }

        revalidatePath('/mensagens')
        return { success: true }

    } catch (error) {
        console.error("Failed to respond to review:", error)
        return { success: false, error: "Erro ao salvar resposta." }
    }
}
