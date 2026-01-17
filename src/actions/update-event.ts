"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { eventSchema } from "@/lib/schemas/listing-wizard"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const updateEventSchema = eventSchema.extend({
    id: z.string()
})

export async function updateEvent(data: z.infer<typeof updateEventSchema>) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    const result = updateEventSchema.safeParse(data)

    if (!result.success) {
        return { success: false, error: result.error.flatten() }
    }

    const validatedData = result.data

    try {
        const eventId = BigInt(validatedData.id)

        const existing = await db.events.findFirst({
            where: {
                id: eventId,
                clerk_user_id: userId
            }
        })

        if (!existing) {
            return { success: false, error: "Evento não encontrado" }
        }

        // Build slug
        const baseSlug = validatedData.title
            .trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "-")
            .replace(/^-+|-+$/g, "")

        let newSlug = baseSlug || existing.slug || `evento-${validatedData.id}`

        if (baseSlug && baseSlug !== existing.slug) {
            let suffix = 0
            while (true) {
                const candidate = suffix === 0 ? newSlug : `${baseSlug}-${suffix}`
                const conflict = await db.events.findFirst({
                    where: {
                        slug: candidate,
                        NOT: { id: eventId }
                    }
                })
                if (!conflict) {
                    newSlug = candidate
                    break
                }
                suffix += 1
            }
        }

        // Combine date and time for starts_at
        const startsAt = new Date(`${validatedData.startDate}T${validatedData.startTime}:00`)

        // Combine date and time for ends_at if provided
        let endsAt: Date | null = null
        if (validatedData.endDate) {
            const endTime = validatedData.endTime || validatedData.startTime
            endsAt = new Date(`${validatedData.endDate}T${endTime}:00`)
        }

        await db.events.update({
            where: { id: eventId },
            data: {
                organizer_id: BigInt(validatedData.organizerId),
                title: validatedData.title,
                slug: newSlug,
                description: validatedData.description,

                // Date & Time
                starts_at: startsAt,
                ends_at: endsAt,

                // Location
                event_mode: validatedData.eventMode || 'presencial',
                address: validatedData.location?.address || null,
                city: validatedData.location?.city || null,
                state: validatedData.location?.state || null,

                // Price
                price_amount: validatedData.price ? Math.round(validatedData.price) : null,
                price_currency: validatedData.priceCurrency || "JPY",
                ticket_url: validatedData.ticketUrl || null,

                // Contacts (Rich)
                contacts_data: validatedData.contactsData || [],

                // Media
                cover_image_url: validatedData.coverImage || null,
                gallery_images: validatedData.galleryImages || [],

                // Status
                status: validatedData.isPublished ? "APPROVED" : "DRAFT",
                is_active: validatedData.isPublished,
                published_at: validatedData.isPublished && !existing.published_at ? new Date() : existing.published_at,
            }
        })

        revalidatePath('/listings/events')
        return { success: true }
    } catch (error) {
        console.error("Failed to update event:", error)
        const message = error instanceof Error ? error.message : "Failed to update event"
        return { success: false, error: message }
    }
}
