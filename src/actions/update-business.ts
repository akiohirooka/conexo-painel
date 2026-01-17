"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { businessSchema } from "@/lib/schemas/listing-wizard"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const updateBusinessSchema = businessSchema.extend({
    id: z.string()
})

export async function updateBusiness(data: z.infer<typeof updateBusinessSchema>) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    const result = updateBusinessSchema.safeParse(data)

    if (!result.success) {
        return { success: false, error: result.error.flatten() }
    }

    const validatedData = result.data

    try {
        const businessId = BigInt(validatedData.id)

        const existing = await db.businesses.findFirst({
            where: {
                id: businessId,
                clerk_user_id: userId
            }
        })

        if (!existing) {
            return { success: false, error: "Negócio não encontrado" }
        }

        const category = await db.business_categories.findFirst({
            where: {
                OR: [
                    { name: validatedData.category },
                    { slug: validatedData.category }
                ]
            }
        })

        if (!category) {
            return { success: false, error: `Categoria '${validatedData.category}' não encontrada.` }
        }

        const baseSlug = validatedData.title
            .trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "-")
            .replace(/^-+|-+$/g, "")

        let newSlug = baseSlug || existing.slug || `negocio-${validatedData.id}`

        if (baseSlug && baseSlug !== existing.slug) {
            let suffix = 0
            while (true) {
                const candidate = suffix === 0 ? newSlug : `${baseSlug}-${suffix}`
                const conflict = await db.businesses.findFirst({
                    where: {
                        slug: candidate,
                        NOT: { id: businessId }
                    }
                })
                if (!conflict) {
                    newSlug = candidate
                    break
                }
                suffix += 1
            }
        }

        await db.businesses.update({
            where: { id: businessId },
            data: {
                name: validatedData.title,
                slug: newSlug,
                description: validatedData.description,
                business_category_id: category.id,
                category: validatedData.category,
                subcategory: validatedData.subcategory || [],
                address: validatedData.location.address,
                city: validatedData.location.city,
                state: validatedData.location.state,
                zip_code: validatedData.location.zipCode,
                phone: validatedData.contactsData.find(c => c.type === 'phone' || c.type === 'whatsapp')?.value,
                email: validatedData.contactsData.find(c => c.type === 'email')?.value,
                whatsapp: validatedData.contactsData.find(c => c.type === 'whatsapp')?.value,
                instagram: validatedData.contactsData.find(c => c.type === 'instagram')?.value,
                site_url: validatedData.siteUrl || validatedData.contactsData.find(c => c.type === 'website')?.value,
                contacts_data: validatedData.contactsData.filter(c => c.type !== 'website'),
                amenities: validatedData.amenities || [],
                operating_modes: validatedData.operatingModes || [],
                service_languages: validatedData.serviceLanguages || [],
                payment_methods: validatedData.paymentMethods || [],
                specialties: validatedData.specialties || [],
                opening_hours: validatedData.openingHoursData,
                // Note: gallery_images is managed by /api/upload, not here
                logo_url: validatedData.logo || null,
                cover_image_url: validatedData.coverImage || null,
                is_published: validatedData.isPublished,
                is_open: existing.is_open,
                is_verified: existing.is_verified
            }
        })

        revalidatePath('/dashboard/listings')
        return { success: true }
    } catch (error) {
        console.error("Failed to update business:", error)
        const message = error instanceof Error ? error.message : "Failed to update business"
        return { success: false, error: message }
    }
}
