"use server"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export interface BusinessReview {
    id: string
    rating: number
    title: string | null
    comment: string | null
    authorName: string | null
    createdAt: string
    businessId: string
    businessName: string
    hasResponse: boolean
    response: {
        body: string
        createdAt: string
    } | null
}

export async function getBusinessReviews(): Promise<{ success: boolean; data?: BusinessReview[]; error?: string }> {
    const user = await getCurrentUser()

    if (!user) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        // Get all businesses owned by the user
        const businesses = await db.businesses.findMany({
            where: { clerk_user_id: user.clerkUserId },
            select: { id: true, name: true }
        })

        if (businesses.length === 0) {
            return { success: true, data: [] }
        }

        const businessIds = businesses.map(b => b.id)
        const businessMap = new Map(businesses.map(b => [b.id.toString(), b.name]))

        // Get all reviews for these businesses
        const reviews = await db.reviews.findMany({
            where: {
                item_type: 'BUSINESS',
                item_id: { in: businessIds }
            },
            include: {
                response: true
            },
            orderBy: { created_at: 'desc' }
        })

        // Get author info for each review
        const authorIds = [...new Set(reviews.map(r => r.clerk_user_id))]
        const authors = await db.users.findMany({
            where: { clerk_user_id: { in: authorIds } },
            select: { clerk_user_id: true, first_name: true, last_name: true }
        })
        const authorMap = new Map(authors.map(a => [
            a.clerk_user_id,
            a.first_name && a.last_name ? `${a.first_name} ${a.last_name}` : a.first_name || 'Usuário'
        ]))

        const data: BusinessReview[] = reviews.map(review => ({
            id: review.id.toString(),
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            authorName: authorMap.get(review.clerk_user_id) || 'Usuário',
            createdAt: review.created_at.toISOString(),
            businessId: review.item_id.toString(),
            businessName: businessMap.get(review.item_id.toString()) || 'Negócio',
            hasResponse: !!review.response,
            response: review.response ? {
                body: review.response.body,
                createdAt: review.response.created_at.toISOString()
            } : null
        }))

        return { success: true, data }

    } catch (error) {
        console.error("Failed to get business reviews:", error)
        return { success: false, error: "Erro ao carregar reviews" }
    }
}
