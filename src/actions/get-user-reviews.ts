"use server"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export interface UserReview {
    id: string
    rating: number
    title: string | null
    comment: string | null
    itemType: string
    itemName: string
    createdAt: string
    hasResponse: boolean
    response: {
        body: string
        createdAt: string
    } | null
}

export interface UserStats {
    reviewsCount: number
    favoritesCount: number
}

export async function getUserReviews(): Promise<{ success: boolean; data?: UserReview[]; error?: string }> {
    const user = await getCurrentUser()

    if (!user) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const reviews = await db.reviews.findMany({
            where: { clerk_user_id: user.clerkUserId },
            include: { response: true },
            orderBy: { created_at: 'desc' }
        })

        // Get item names for each review
        const businessIds = reviews.filter(r => r.item_type === 'BUSINESS').map(r => r.item_id)
        const eventIds = reviews.filter(r => r.item_type === 'EVENT').map(r => r.item_id)
        const jobIds = reviews.filter(r => r.item_type === 'JOB').map(r => r.item_id)

        const [businesses, events, jobs] = await Promise.all([
            businessIds.length > 0
                ? db.businesses.findMany({ where: { id: { in: businessIds } }, select: { id: true, name: true } })
                : [],
            eventIds.length > 0
                ? db.events.findMany({ where: { id: { in: eventIds } }, select: { id: true, title: true } })
                : [],
            jobIds.length > 0
                ? db.jobs.findMany({ where: { id: { in: jobIds } }, select: { id: true, title: true } })
                : []
        ])

        const itemNameMap = new Map<string, string>()
        businesses.forEach(b => itemNameMap.set(`BUSINESS-${b.id}`, b.name))
        events.forEach(e => itemNameMap.set(`EVENT-${e.id}`, e.title))
        jobs.forEach(j => itemNameMap.set(`JOB-${j.id}`, j.title))

        const data: UserReview[] = reviews.map(review => ({
            id: review.id.toString(),
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            itemType: review.item_type,
            itemName: itemNameMap.get(`${review.item_type}-${review.item_id}`) || 'Item',
            createdAt: review.created_at.toISOString(),
            hasResponse: !!review.response,
            response: review.response ? {
                body: review.response.body,
                createdAt: review.response.created_at.toISOString()
            } : null
        }))

        return { success: true, data }

    } catch (error) {
        console.error("Failed to get user reviews:", error)
        return { success: false, error: "Erro ao carregar reviews" }
    }
}

export async function getUserStats(): Promise<{ success: boolean; data?: UserStats; error?: string }> {
    const user = await getCurrentUser()

    if (!user) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const [reviewsCount, favoritesCount] = await Promise.all([
            db.reviews.count({ where: { clerk_user_id: user.clerkUserId } }),
            db.favorites.count({ where: { clerk_user_id: user.clerkUserId } })
        ])

        return {
            success: true,
            data: { reviewsCount, favoritesCount }
        }

    } catch (error) {
        console.error("Failed to get user stats:", error)
        return { success: false, error: "Erro ao carregar estatísticas" }
    }
}
