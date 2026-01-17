"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { businessSchema } from "@/lib/schemas/listing-wizard"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBusiness(data: z.infer<typeof businessSchema>) {
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
        console.error("Failed to upsert user before creating business:", err)
        const reason = err instanceof Error ? err.message : String(err)
        return { success: false, error: `Usuário não sincronizado. Motivo: ${reason}` }
    }

    // Check business limit
    const existingCount = await db.businesses.count({
        where: { clerk_user_id: userId }
    })

    if (existingCount >= 3) {
        return { success: false, error: "Você atingiu o limite máximo de 3 negócios cadastrados." }
    }

    // Server-side validation
    const result = businessSchema.safeParse(data)

    if (!result.success) {
        return { success: false, error: result.error.flatten() }
    }

    const validatedData = result.data

    try {
        // Find category ID
        // In a real app we might want to cache this or use IDs in the form
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

        // Build slug (favor nome limpo; se já existir, Prisma vai acusar unique violation)
        const baseSlug = validatedData.title
            .trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "-")
            .replace(/^-+|-+$/g, "")

        // Create business
        const business = await db.businesses.create({
            data: {
                clerk_user_id: userId,
                name: validatedData.title,
                slug: baseSlug || `negocio-${Date.now()}`,
                description: validatedData.description,

                // Relations
                business_category_id: category.id,
                category: validatedData.category,
                subcategory: validatedData.subcategory || [],

                // Location
                address: validatedData.location.address,
                city: validatedData.location.city,
                state: validatedData.location.state,
                zip_code: validatedData.location.zipCode,

                // Contact (Legacy - populate first found if available for index/search)
                phone: validatedData.contactsData.find(c => c.type === 'phone' || c.type === 'whatsapp')?.value,
                email: validatedData.contactsData.find(c => c.type === 'email')?.value,
                whatsapp: validatedData.contactsData.find(c => c.type === 'whatsapp')?.value,
                instagram: validatedData.contactsData.find(c => c.type === 'instagram')?.value,
                site_url: validatedData.siteUrl || validatedData.contactsData.find(c => c.type === 'website')?.value,

                // Contact (Rich)
                contacts_data: validatedData.contactsData.filter(c => c.type !== 'website'),

                // Extras
                amenities: validatedData.amenities || [],
                opening_hours: validatedData.openingHoursData,
                gallery_images: validatedData.gallery.images || [],

                // Defaults
                is_verified: false,
                is_open: false,
                is_published: validatedData.isPublished
            }
        })

        revalidatePath('/dashboard/listings')
        return { success: true, businessId: business.id.toString() }

    } catch (error) {
        console.error("Failed to create business:", error)
        const message = error instanceof Error ? error.message : "Failed to create business"
        return { success: false, error: message }
    }
}
