"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { jobSchema } from "@/lib/schemas/listing-wizard"
import { z } from "zod"
import { revalidatePath } from "next/cache"

export async function createJob(data: z.infer<typeof jobSchema>) {
    const { userId } = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    // Ensure a users row exists for this Clerk user (required by FK)
    try {
        const clerkUser = clerkClient?.users?.getUser ? await clerkClient.users.getUser(userId).catch(() => null) : null
        const email =
            clerkUser?.primaryEmailAddress?.emailAddress ||
            clerkUser?.emailAddresses?.[0]?.emailAddress ||
            `${userId}@placeholder.local`

        await db.users.upsert({
            where: { clerk_user_id: userId },
            update: {
                email,
                first_name: clerkUser?.firstName ?? null,
                last_name: clerkUser?.lastName ?? null,
            },
            create: {
                clerk_user_id: userId,
                email,
                first_name: clerkUser?.firstName ?? null,
                last_name: clerkUser?.lastName ?? null,
            },
        })
    } catch (err) {
        console.error("Failed to upsert user before creating job:", err)
        const reason = err instanceof Error ? err.message : String(err)
        return { success: false, error: `Usuário não sincronizado. Motivo: ${reason}` }
    }

    // Check job limit (same as business/event: 3)
    const existingCount = await db.jobs.count({
        where: { clerk_user_id: userId }
    })

    if (existingCount >= 3) {
        return { success: false, error: "Você atingiu o limite máximo de 3 vagas cadastradas." }
    }

    // Server-side validation
    const result = jobSchema.safeParse(data)

    if (!result.success) {
        return { success: false, error: result.error.flatten() }
    }

    const validatedData = result.data

    try {
        // Build slug
        const baseSlug = validatedData.title
            .trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "-")
            .replace(/^-+|-+$/g, "")

        // Fetch contractor to get name fallback
        const contractorId = BigInt(validatedData.contractorId)
        const contractor = await db.businesses.findUnique({
            where: { id: contractorId }
        })

        const companyName = validatedData.companyName || contractor?.name || ""

        // Create job
        const job = await db.jobs.create({
            data: {
                clerk_user_id: userId,
                contractor_id: contractorId,
                company_name: companyName,
                title: validatedData.title,
                slug: baseSlug || `vaga-${Date.now()}`,
                description: validatedData.description,

                // Type
                category: validatedData.category || null,
                employment_type: validatedData.employmentType || null,
                work_model: validatedData.workModel || 'onsite',

                // Location
                address: validatedData.location?.address || null,
                city: validatedData.location?.city || null,
                state: validatedData.location?.state || null,

                // Salary
                salary_amount: validatedData.salary?.amount ? Math.round(validatedData.salary.amount) : null,
                salary_currency: validatedData.salary?.currency || "JPY",
                salary_unit: validatedData.salary?.unit || "month",

                // Application
                application_url: validatedData.applicationUrl || null,
                contact_email: validatedData.contactEmail || null,

                // Contacts (Rich)
                contacts_data: validatedData.contactsData || [],

                // Media
                cover_image_url: validatedData.coverImage || null,
                gallery_images: validatedData.galleryImages || [],

                // Lists
                requirements: validatedData.requirements || [],
                benefits: validatedData.benefits || [],

                // Status
                status: validatedData.isPublished ? "APPROVED" : "DRAFT",
                is_active: validatedData.isPublished,
                is_published: validatedData.isPublished,
                published_at: validatedData.isPublished ? new Date() : null,
            }
        })

        revalidatePath('/listings/jobs')
        return { success: true, jobId: job.id.toString() }

    } catch (error) {
        console.error("Failed to create job:", error)
        const message = error instanceof Error ? error.message : "Failed to create job"
        return { success: false, error: message }
    }
}
