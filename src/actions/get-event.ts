"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getEvent(id: string) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const eventId = BigInt(id)
        const event = await db.events.findFirst({
            where: {
                id: eventId,
                clerk_user_id: userId
            }
        })

        if (!event) {
            return { success: false, error: "Evento não encontrado" }
        }

        const contactsData = Array.isArray(event.contacts_data)
            ? event.contacts_data as any[]
            : []

        // Format date and time from starts_at
        const startsAt = new Date(event.starts_at)
        const startDate = startsAt.toISOString().split('T')[0]
        const startTime = startsAt.toTimeString().slice(0, 5)

        // Format date and time from ends_at if exists
        let endDate = ""
        let endTime = ""
        if (event.ends_at) {
            const endsAt = new Date(event.ends_at)
            endDate = endsAt.toISOString().split('T')[0]
            endTime = endsAt.toTimeString().slice(0, 5)
        }

        const data = {
            id: event.id.toString(),
            type: "event" as const,
            organizerId: event.organizer_id?.toString() || "",
            title: event.title,
            slug: event.slug,
            description: event.description || "",

            // Date & Time
            startDate,
            endDate,
            startTime,
            endTime,
            eventMode: (event.event_mode as 'presencial' | 'online' | 'hybrid') || 'presencial',

            // Location
            location: {
                address: event.address || "",
                city: event.city || "",
                state: event.state || "",
                zipCode: "",
            },

            // Price
            price: event.price_amount || 0,
            priceCurrency: event.price_currency || "JPY",
            ticketUrl: event.ticket_url || "",

            // Contacts
            contactsData: contactsData.map((c: any) => ({
                type: c.type || "other",
                value: c.value || "",
                responsible: c.responsible || ""
            })).filter(c => c.value),

            // Media
            coverImage: event.cover_image_url || "",
            galleryImages: event.gallery_images || [],

            // Status
            isPublished: event.status === "APPROVED" && event.is_active,
        }

        return { success: true, data }
    } catch (error) {
        console.error("Failed to load event:", error)
        return { success: false, error: "Erro ao carregar evento" }
    }
}
