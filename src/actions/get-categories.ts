"use server"

import { db } from "@/lib/db"

export type CategoryWithSubs = {
    id: number
    name: string
    slug: string
    subcategories: {
        id: number
        name: string
        slug: string
    }[]
}

export async function getCategories() {
    try {
        const categories = await db.business_categories.findMany({
            where: {
                is_active: true
            },
            include: {
                business_subcategories: {
                    orderBy: {
                        name: 'asc'
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        // Transform BigInt to number for client consumption (safe for IDs in this context)
        const safeCategories = categories.map(cat => ({
            id: Number(cat.id),
            name: cat.name,
            slug: cat.slug,
            subcategories: cat.business_subcategories.map(sub => ({
                id: Number(sub.id),
                name: sub.name,
                slug: sub.slug
            }))
        }))

        return { success: true, data: safeCategories }
    } catch (error) {
        console.error("Failed to fetch categories:", error)
        return { success: false, error: "Failed to fetch categories" }
    }
}
