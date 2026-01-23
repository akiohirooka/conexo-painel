"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { eventSchema } from "@/lib/schemas/listing-wizard"
import { z } from "zod"
import { revalidatePath } from "next/cache"

export async function createEvent(data: z.infer<typeof eventSchema>) {
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
        console.error("Failed to upsert user before creating event:", err)
        const reason = err instanceof Error ? err.message : String(err)
        return { success: false, error: `Usuário não sincronizado. Motivo: ${reason}` }
    }

    // Check event limit (same as business: 3)
    const existingCount = await db.events.count({
        where: { clerk_user_id: userId }
    })

    if (existingCount >= 3) {
        return { success: false, error: "Você atingiu o limite máximo de 3 eventos cadastrados." }
    }

    // Server-side validation
    const result = eventSchema.safeParse(data)

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

        // Combine date and time for starts_at
        const startsAt = new Date(`${validatedData.startDate}T${validatedData.startTime}:00`)

        // Combine date and time for ends_at if provided
        let endsAt: Date | null = null
        if (validatedData.endDate) {
            const endTime = validatedData.endTime || validatedData.startTime
            endsAt = new Date(`${validatedData.endDate}T${endTime}:00`)
        }

        // Create event
        const event = await db.events.create({
            data: {
                clerk_user_id: userId,
                organizer_id: BigInt(validatedData.organizerId),
                title: validatedData.title,
                slug: baseSlug || `evento-${Date.now()}`,
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
                published_at: validatedData.isPublished ? new Date() : null,
            }
        })

        revalidatePath('/listings/events')
        return { success: true, eventId: event.id.toString() }

    } catch (error) {
        console.error("Failed to create event:", error)

        // Handle Prisma unique constraint violations (P2002)
        if (error && typeof error === 'object' && 'code' in error) {
            const prismaError = error as { code: string; meta?: { target?: string[] } }
            if (prismaError.code === 'P2002') {
                const target = prismaError.meta?.target
                if (target?.includes('slug') || target?.includes('title')) {
                    return {
                        success: false,
                        error: "Já existe um evento cadastrado com esse nome. Por favor, escolha um nome diferente."
                    }
                }
                return {
                    success: false,
                    error: "Já existe um registro com essas informações. Por favor, verifique os dados e tente novamente."
                }
            }
        }

        const message = error instanceof Error ? error.message : "Failed to create event"
        return { success: false, error: message }
    }
}
