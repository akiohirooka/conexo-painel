"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getClerkUserProfile, getUsersFallbackEmail } from "@/lib/auth/clerk-user-profile"

export async function getUserProfile() {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const user = await db.users.findUnique({
            where: {
                clerk_user_id: userId
            },
            select: {
                first_name: true,
                last_name: true,
                email: true,
                phone: true
            }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        return { success: true, data: user }
    } catch (error) {
        console.error("Failed to get user profile:", error)
        return { success: false, error: "Erro ao carregar perfil" }
    }
}

export async function updateUserProfile(data: {
    first_name: string
    last_name: string
    phone?: string
}) {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const result = await db.users.update({
            where: {
                clerk_user_id: userId
            },
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone
            }
        })
        revalidatePath("/account")
        return { success: true, data: result }
    } catch (error) {
        console.error("Failed to update user profile:", error)
        return { success: false, error: "Erro ao atualizar perfil" }
    }
}

export async function activateBusinessMode() {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Não autorizado" }
    }

    try {
        const now = new Date()
        const clerkProfile = await getClerkUserProfile(userId)
        const resolvedEmail = clerkProfile?.email ?? null

        await db.users.upsert({
            where: {
                clerk_user_id: userId
            },
            update: {
                role: "business",
                updated_at: now,
                ...(resolvedEmail ? { email: resolvedEmail } : {}),
            },
            create: {
                clerk_user_id: userId,
                email: resolvedEmail ?? getUsersFallbackEmail(),
                role: "business",
                updated_at: now,
                first_name: clerkProfile?.firstName ?? null,
                last_name: clerkProfile?.lastName ?? null,
            }
        })

        // Revalidate all paths that depend on user role
        revalidatePath("/", "layout")
        revalidatePath("/home")
        revalidatePath("/dashboard")

        return { success: true }
    } catch (error) {
        console.error("Failed to activate business mode:", error)
        const isDev = process.env.NODE_ENV !== "production"
        const errorMessage =
            error instanceof Error ? error.message : "Erro ao ativar modo business"

        return {
            success: false,
            error: isDev ? errorMessage : "Erro ao ativar modo business"
        }
    }
}

export async function requestAccountDeletion() {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const updatedRows = await db.$transaction(async (tx) => {
            const usersUpdated = await tx.$executeRaw`
                UPDATE public.users
                SET role = 'deleted',
                    deletion_requested_at = COALESCE(deletion_requested_at, NOW())
                WHERE clerk_user_id = ${userId}
            `

            if (!usersUpdated) {
                return 0
            }

            await tx.businesses.updateMany({
                where: { clerk_user_id: userId },
                data: { is_published: false }
            })

            await tx.events.updateMany({
                where: { clerk_user_id: userId },
                data: {
                    status: "DRAFT",
                    is_active: false
                }
            })

            await tx.jobs.updateMany({
                where: { clerk_user_id: userId },
                data: {
                    status: "DRAFT",
                    is_active: false
                }
            })

            return usersUpdated
        })

        if (!updatedRows) {
            return { success: false, error: "Usuário não encontrado" }
        }

        return { success: true }
    } catch (error) {
        console.error("Failed to request account deletion:", error)
        const isDev = process.env.NODE_ENV !== "production"
        const errorMessage =
            error instanceof Error ? error.message : "Erro ao solicitar exclusão da conta"

        return {
            success: false,
            error: isDev ? errorMessage : "Erro ao solicitar exclusão da conta"
        }
    }
}
