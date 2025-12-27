"use server"

import { auth } from "@clerk/nextjs/server"
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
            where: { name: validatedData.category }
        })

        if (!category) {
            // For now, if category not found, maybe create or throw
            // Let's assume categories exist or we just use ID 1 for fallback/demo
            // or we could map the string to known IDs
            throw new Error(`Category ${validatedData.category} not found`)
        }

        // Create business
        const business = await db.businesses.create({
            data: {
                clerk_user_id: userId,
                name: validatedData.title,
                slug: validatedData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(), // Simple slug gen
                description: validatedData.description,

                // Relations
                business_category_id: category.id,
                category: validatedData.category, // Storing string name too as per schema legacy?

                // Location
                address: validatedData.location.address,
                city: validatedData.location.city,
                state: validatedData.location.state,
                zip_code: validatedData.location.zipCode,

                // Contact
                phone: validatedData.contact.phone,
                whatsapp: validatedData.contact.whatsapp,
                email: validatedData.contact.email,
                instagram: validatedData.contact.instagram,
                site_url: validatedData.contact.website,

                // Extras
                amenities: validatedData.amenities || [],
                opening_hours: validatedData.openingHours,
                gallery_images: validatedData.gallery.images || [], // Schema expects string[]

                // Defaults
                is_verified: false,
                is_open: false
            }
        })

        revalidatePath('/dashboard/listings')
        return { success: true, businessId: business.id.toString() }

    } catch (error) {
        console.error("Failed to create business:", error)
        return { success: false, error: "Failed to create business" }
    }
}
