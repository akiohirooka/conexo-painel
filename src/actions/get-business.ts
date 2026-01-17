"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getBusiness(id: string) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const businessId = BigInt(id)
        const business = await db.businesses.findFirst({
            where: {
                id: businessId,
                clerk_user_id: userId
            }
        })

        if (!business) {
            return { success: false, error: "Negócio não encontrado" }
        }

        const contactsData = Array.isArray(business.contacts_data)
            ? business.contacts_data as any[]
            : []

        const openingHoursData = Array.isArray(business.opening_hours)
            ? business.opening_hours as any[]
            : []

        const fallbackContacts = [
            business.phone ? { type: "phone", value: business.phone } : null,
            business.whatsapp ? { type: "whatsapp", value: business.whatsapp } : null,
            business.email ? { type: "email", value: business.email } : null,
            business.instagram ? { type: "instagram", value: business.instagram } : null,
        ].filter(Boolean) as { type: string, value: string }[]

        const data = {
            id: business.id.toString(),
            type: "business" as const,
            title: business.name,
            slug: business.slug,
            category: business.category || "",
            subcategory: business.subcategory || [],
            description: business.description || "",
            siteUrl: business.site_url || "",
            isPublished: business.is_published,
            location: {
                address: business.address || "",
                city: business.city || "",
                state: business.state || "",
                zipCode: business.zip_code || "",
            },
            contactsData: (contactsData.length ? contactsData : fallbackContacts).map((c: any) => ({
                type: c.type || "other",
                value: c.value || "",
                responsible: c.responsible || ""
            })).filter(c => c.value),
            openingHoursData,
            logo: business.logo_url || "",
            coverImage: business.cover_image_url || "",
            galleryImages: business.gallery_images || [],
            amenities: business.amenities || [],
            operatingModes: business.operating_modes || [],
            serviceLanguages: business.service_languages || [],
            paymentMethods: business.payment_methods || [],
            specialties: business.specialties || [],
            contact: {
                phone: business.phone || "",
                whatsapp: business.whatsapp || "",
                email: business.email || "",
                instagram: business.instagram || "",
                website: business.site_url || "",
            },
        }

        return { success: true, data }
    } catch (error) {
        console.error("Failed to load business:", error)
        return { success: false, error: "Erro ao carregar negócio" }
    }
}
