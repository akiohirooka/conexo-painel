"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { jobSchema } from "@/lib/schemas/listing-wizard"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const updateJobSchema = jobSchema.extend({
    id: z.string()
})

export async function updateJob(data: z.infer<typeof updateJobSchema>) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    const result = updateJobSchema.safeParse(data)

    if (!result.success) {
        return { success: false, error: result.error.flatten() }
    }

    const validatedData = result.data

    try {
        const jobId = BigInt(validatedData.id)

        const existing = await db.jobs.findFirst({
            where: {
                id: jobId,
                clerk_user_id: userId
            }
        })

        if (!existing) {
            return { success: false, error: "Vaga não encontrada" }
        }

        // Build slug
        const baseSlug = validatedData.title
            .trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "-")
            .replace(/^-+|-+$/g, "")

        let newSlug = baseSlug || existing.slug || `vaga-${validatedData.id}`

        if (baseSlug && baseSlug !== existing.slug) {
            let suffix = 0
            while (true) {
                const candidate = suffix === 0 ? newSlug : `${baseSlug}-${suffix}`
                const conflict = await db.jobs.findFirst({
                    where: {
                        slug: candidate,
                        NOT: { id: jobId }
                    }
                })
                if (!conflict) {
                    newSlug = candidate
                    break
                }
                suffix += 1
            }
        }

        // Determine company name
        let companyName = validatedData.companyName
        if (!companyName) {
            const contractor = await db.businesses.findUnique({ where: { id: BigInt(validatedData.contractorId) } })
            companyName = contractor?.name || ""
        }

        await db.jobs.update({
            where: { id: jobId },
            data: {
                contractor_id: BigInt(validatedData.contractorId),
                company_name: companyName,
                title: validatedData.title,
                slug: newSlug,
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
                published_at: validatedData.isPublished && !existing.published_at ? new Date() : existing.published_at,

                updated_at: new Date(),
            }
        })

        revalidatePath('/listings/jobs')
        return { success: true }
    } catch (error) {
        console.error("Failed to update job:", error)
        const message = error instanceof Error ? error.message : "Failed to update job"
        return { success: false, error: message }
    }
}
