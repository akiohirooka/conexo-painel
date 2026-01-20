"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

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
        await db.users.update({
            where: {
                clerk_user_id: userId
            },
            data: {
                role: "business"
            }
        })

        // Revalidate all paths that depend on user role
        revalidatePath("/", "layout")
        revalidatePath("/home")
        revalidatePath("/dashboard")

        return { success: true }
    } catch (error) {
        console.error("Failed to activate business mode:", error)
        return { success: false, error: "Erro ao ativar modo business" }
    }
}
