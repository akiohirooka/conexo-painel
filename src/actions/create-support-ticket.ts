"use server"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { Resend } from "resend"

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Validation schema
const supportTicketSchema = z.object({
    category: z.enum(['QUESTION', 'BUG', 'SUGGESTION', 'OTHER']).default('OTHER'),
    subject: z.string().min(3, "O assunto deve ter pelo menos 3 caracteres").max(200, "O assunto deve ter no máximo 200 caracteres"),
    message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres").max(5000, "A mensagem deve ter no máximo 5000 caracteres"),
})

export type SupportTicketInput = z.infer<typeof supportTicketSchema>

// Category labels for display
const categoryLabels: Record<string, string> = {
    'QUESTION': 'Dúvida',
    'BUG': 'Problema / Bug',
    'SUGGESTION': 'Sugestão',
    'OTHER': 'Outro'
}

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

    // Get request headers for device/location info
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || 'Desconhecido'
    const referer = headersList.get('referer') || 'N/A'
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const clientIp = forwardedFor?.split(',')[0]?.trim() || realIp || 'N/A'

    // Parse user agent for device info
    const deviceInfo = parseUserAgent(userAgent)

    // Format date and time in JST
    const now = new Date()
    const jstFormatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'Asia/Tokyo',
        dateStyle: 'full',
        timeStyle: 'medium'
    })
    const formattedDateTime = jstFormatter.format(now)

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

        // Send email via Resend
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Conexo <noreply@conexo.jp>'
        const supportEmail = process.env.SUPPORT_EMAIL || 'suporte@conexo.jp'
        const categoryLabel = categoryLabels[validatedData.category] || validatedData.category

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .message-box { background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #3B82F6; margin: 16px 0; }
        .info-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .info-table td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; }
        .info-table td:first-child { font-weight: 600; color: #64748b; width: 140px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
        .badge-question { background: #DBEAFE; color: #1E40AF; }
        .badge-bug { background: #FEE2E2; color: #991B1B; }
        .badge-suggestion { background: #D1FAE5; color: #065F46; }
        .badge-other { background: #E5E7EB; color: #374151; }
        .footer { background: #1e293b; color: #94a3b8; padding: 16px 20px; border-radius: 0 0 8px 8px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">📩 Nova Mensagem de Suporte</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">Ticket #${ticket.id}</p>
        </div>
        
        <div class="content">
            <p style="margin-top: 0;">
                <span class="badge badge-${validatedData.category.toLowerCase()}">${categoryLabel}</span>
            </p>
            
            <div class="message-box">
                <p style="margin: 0; white-space: pre-wrap;">${validatedData.message}</p>
            </div>
            
            <table class="info-table">
                <tr>
                    <td>📅 Data/Hora</td>
                    <td>${formattedDateTime} (JST)</td>
                </tr>
                <tr>
                    <td>👤 Nome</td>
                    <td>${user.firstName || 'N/A'} ${user.lastName || ''}</td>
                </tr>
                <tr>
                    <td>📧 Email</td>
                    <td><a href="mailto:${user.email}">${user.email}</a></td>
                </tr>
                <tr>
                    <td>🔑 Clerk ID</td>
                    <td><code>${user.clerkUserId}</code></td>
                </tr>
                <tr>
                    <td>🌐 IP</td>
                    <td>${clientIp}</td>
                </tr>
                <tr>
                    <td>💻 Dispositivo</td>
                    <td>${deviceInfo.device}</td>
                </tr>
                <tr>
                    <td>🌍 Navegador</td>
                    <td>${deviceInfo.browser}</td>
                </tr>
                <tr>
                    <td>📱 Sistema</td>
                    <td>${deviceInfo.os}</td>
                </tr>
                <tr>
                    <td>📍 Origem</td>
                    <td>${referer}</td>
                </tr>
            </table>
        </div>
        
        <div class="footer">
            <p style="margin: 0;">Este email foi enviado automaticamente pelo sistema Conexo.</p>
            <p style="margin: 4px 0 0;">Para responder, use o email do usuário acima.</p>
        </div>
    </div>
</body>
</html>
        `

        const emailText = `
Nova Mensagem de Suporte - Ticket #${ticket.id}
================================================

Assunto: ${categoryLabel}

Mensagem:
${validatedData.message}

---
Informações do Usuário:
- Data/Hora: ${formattedDateTime} (JST)
- Nome: ${user.firstName || 'N/A'} ${user.lastName || ''}
- Email: ${user.email}
- Clerk ID: ${user.clerkUserId}
- IP: ${clientIp}
- Dispositivo: ${deviceInfo.device}
- Navegador: ${deviceInfo.browser}
- Sistema: ${deviceInfo.os}
- Origem: ${referer}
        `

        // Send email (don't await to avoid blocking UI, but log errors)
        resend.emails.send({
            from: fromEmail,
            to: supportEmail,
            replyTo: user.email,
            subject: `[Suporte] ${categoryLabel} - Ticket #${ticket.id}`,
            html: emailHtml,
            text: emailText,
        }).catch(err => console.error("Failed to send support email via Resend:", err))

        revalidatePath('/fale-conosco')
        return { success: true }

    } catch (error) {
        console.error("Failed to create support ticket:", error)
        return { success: false, error: "Erro ao enviar mensagem. Tente novamente." }
    }
}

// Helper function to parse user agent
function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
    let device = 'Desktop'
    let browser = 'Desconhecido'
    let os = 'Desconhecido'

    // Detect device
    if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
        device = /iPad/i.test(ua) ? 'Tablet (iPad)' : 'Mobile'
    }
    if (/iPhone/i.test(ua)) device = 'iPhone'
    if (/Android/i.test(ua) && /Mobile/i.test(ua)) device = 'Android Phone'
    if (/Android/i.test(ua) && !/Mobile/i.test(ua)) device = 'Android Tablet'

    // Detect browser
    if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome'
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari'
    else if (/Firefox/i.test(ua)) browser = 'Firefox'
    else if (/Edg/i.test(ua)) browser = 'Microsoft Edge'
    else if (/Opera|OPR/i.test(ua)) browser = 'Opera'

    // Extract version
    const chromeMatch = ua.match(/Chrome\/(\d+)/)
    const safariMatch = ua.match(/Version\/(\d+)/)
    const firefoxMatch = ua.match(/Firefox\/(\d+)/)
    if (chromeMatch && browser === 'Chrome') browser += ` ${chromeMatch[1]}`
    if (safariMatch && browser === 'Safari') browser += ` ${safariMatch[1]}`
    if (firefoxMatch && browser === 'Firefox') browser += ` ${firefoxMatch[1]}`

    // Detect OS
    if (/Windows NT 10/i.test(ua)) os = 'Windows 10/11'
    else if (/Windows/i.test(ua)) os = 'Windows'
    else if (/Mac OS X/i.test(ua)) os = 'macOS'
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS'
    else if (/Android/i.test(ua)) os = 'Android'
    else if (/Linux/i.test(ua)) os = 'Linux'

    return { device, browser, os }
}
