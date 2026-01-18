"use server"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"
import { revalidatePath } from "next/cache"

// Validation schema
const supportTicketSchema = z.object({
    category: z.enum(['QUESTION', 'BUG', 'SUGGESTION', 'OTHER']).default('OTHER'),
    subject: z.string().min(3, "O assunto deve ter pelo menos 3 caracteres").max(200, "O assunto deve ter no máximo 200 caracteres"),
    message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres").max(5000, "A mensagem deve ter no máximo 5000 caracteres"),
})

export type SupportTicketInput = z.infer<typeof supportTicketSchema>

export async function createSupportTicket(data: SupportTicketInput) {
    const user = await getCurrentUser()

    if (!user) {
        return { success: false, error: "Você precisa estar logado para enviar uma mensagem." }
    }

    // Validate input
    const result = supportTicketSchema.safeParse(data)

    if (!result.success) {
        return { success: false, error: result.error.flatten().fieldErrors }
    }

    const validatedData = result.data

    try {
        const ticket = await db.support_tickets.create({
            data: {
                clerk_user_id: user.clerkUserId,
                category: validatedData.category,
                subject: validatedData.subject,
                message: validatedData.message,
                status: 'open',
            }
        })

        // Optional: Trigger webhook for email notification (n8n, Zapier, etc.)
        const webhookUrl = process.env.SUPPORT_WEBHOOK_URL
        if (webhookUrl) {
            // we don't await this to not block the UI
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticketId: ticket.id,
                    userEmail: user.email, // Assuming getCurrentUser returns email
                    userName: user.firstName,
                    category: validatedData.category,
                    subject: validatedData.subject,
                    message: validatedData.message,
                    createdAt: new Date().toISOString()
                })
            }).catch(err => console.error("Failed to trigger support webhook:", err))
        }

        revalidatePath('/fale-conosco')
        return { success: true }

    } catch (error) {
        console.error("Failed to create support ticket:", error)
        return { success: false, error: "Erro ao enviar mensagem. Tente novamente." }
    }
}
