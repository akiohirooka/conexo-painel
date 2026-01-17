"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getJobs() {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const jobs = await db.jobs.findMany({
            where: {
                clerk_user_id: userId,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                company_name: true,
                employment_type: true,
                work_model: true,
                salary_amount: true,
                salary_currency: true,
                salary_unit: true,
                cover_image_url: true,
                status: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        const safeJobs = jobs.map(j => ({
            ...j,
            id: j.id.toString(),
        }))

        return { success: true, data: safeJobs }
    } catch (error) {
        console.error("Failed to fetch jobs:", error)
        return { success: false, error: "Failed to fetch jobs" }
    }
}
