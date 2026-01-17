"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getJob(id: string) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const jobId = BigInt(id)
        const job = await db.jobs.findFirst({
            where: {
                id: jobId,
                clerk_user_id: userId
            }
        })

        if (!job) {
            return { success: false, error: "Vaga não encontrada" }
        }

        const contactsData = Array.isArray(job.contacts_data)
            ? job.contacts_data as any[]
            : []

        const data = {
            id: job.id.toString(),
            type: "job" as const,
            contractorId: job.contractor_id?.toString() || "",
            title: job.title,
            slug: job.slug,
            description: job.description || "",

            // Type
            category: job.category || "",
            employmentType: job.employment_type || "",
            workModel: (job.work_model as 'onsite' | 'hybrid' | 'remote') || 'onsite',

            // Location
            location: {
                address: job.address || "",
                city: job.city || "",
                state: job.state || "",
            },

            // Salary
            salary: {
                amount: job.salary_amount || 0,
                unit: (job.salary_unit as 'hour' | 'month' | 'year') || 'month',
                currency: job.salary_currency || "JPY",
                negotiable: false,
            },

            companyName: job.company_name || "",

            // Requirements (stored in description or separate - for now empty)
            requirements: job.requirements || [],
            benefits: job.benefits || [],

            // Application
            applicationUrl: job.application_url || "",
            contactEmail: job.contact_email || "",

            // Contacts
            contactsData: contactsData.map((c: any) => ({
                type: c.type || "other",
                value: c.value || "",
                responsible: c.responsible || ""
            })).filter(c => c.value),

            // Media
            coverImage: job.cover_image_url || "",
            galleryImages: job.gallery_images || [],

            // Status
            isPublished: job.status === "APPROVED" && job.is_active,
        }

        return { success: true, data }
    } catch (error) {
        console.error("Failed to load job:", error)
        return { success: false, error: "Erro ao carregar vaga" }
    }
}
