"use server"

import { auth } from "@clerk/nextjs/server"
import { db as prisma } from "@/lib/db"
import { unstable_cache } from "next/cache"

export interface DashboardListing {
    id: string
    title: string
    type: "Negócio" | "Event" | "Vaga"
    status: "approved" | "pending" | "rejected"
    date: string
    clicks: number
}

interface DashboardData {
    listings: DashboardListing[]
    stats: {
        approved: number
        pending: number
        rejected: number
        totalClicks: number
    }
}

export async function getDashboardData(): Promise<DashboardData> {
    const { userId } = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    // Parallel Fetching
    const [businesses, events, jobs] = await Promise.all([
        prisma.businesses.findMany({
            where: { clerk_user_id: userId },
            select: {
                id: true,
                name: true,
                is_published: true, // Treating as status
                created_at: true,
            },
            orderBy: { created_at: "desc" },
        }),
        prisma.events.findMany({
            where: { clerk_user_id: userId },
            select: {
                id: true,
                title: true,
                status: true,
                created_at: true,
            },
            orderBy: { created_at: "desc" },
        }),
        prisma.jobs.findMany({
            where: { clerk_user_id: userId },
            select: {
                id: true,
                title: true,
                status: true,
                created_at: true,
            },
            orderBy: { created_at: "desc" },
        }),
    ])

    const formattedListings: DashboardListing[] = []

    // Process Businesses
    businesses.forEach((b) => {
        formattedListings.push({
            id: `biz-${b.id}`,
            title: b.name,
            type: "Negócio",
            status: b.is_published ? "approved" : "pending",
            date: new Date(b.created_at).toLocaleDateString("pt-BR"),
            clicks: 0, // Mock for now
        })
    })

    // Process Events
    events.forEach((e) => {
        let status: "approved" | "pending" | "rejected" = "pending"
        if (e.status === "APPROVED") status = "approved"
        else if (e.status === "REJECTED") status = "rejected"

        formattedListings.push({
            id: `evt-${e.id}`,
            title: e.title,
            type: "Event",
            status: status,
            date: new Date(e.created_at).toLocaleDateString("pt-BR"),
            clicks: 0, // Mock for now
        })
    })

    // Process Jobs
    jobs.forEach((j) => {
        let status: "approved" | "pending" | "rejected" = "pending"
        if (j.status === "APPROVED") status = "approved"
        else if (j.status === "REJECTED") status = "rejected"

        formattedListings.push({
            id: `job-${j.id}`,
            title: j.title,
            type: "Vaga",
            status: status,
            date: new Date(j.created_at).toLocaleDateString("pt-BR"),
            clicks: 0, // Mock for now
        })
    })

    // Sort combined list by date desc (converting back to verify sort)
    // Since dates are strings now, this might be simpler if we kept date objects briefly, 
    // but relying on the DB sort usually suffices if we just merge. 
    // However, merging 3 sorted lists requires re-sort.
    formattedListings.sort((a, b) => {
        // Parse "DD/MM/YYYY" back to compare
        const [dayA, monthA, yearA] = a.date.split('/').map(Number)
        const [dayB, monthB, yearB] = b.date.split('/').map(Number)
        const dateA = new Date(yearA, monthA - 1, dayA).getTime()
        const dateB = new Date(yearB, monthB - 1, dayB).getTime()
        return dateB - dateA
    })

    // Calculate Stats
    const approved = formattedListings.filter(l => l.status === "approved").length
    const pending = formattedListings.filter(l => l.status === "pending").length
    const rejected = formattedListings.filter(l => l.status === "rejected").length
    // Total clicks is sum of all clicks (currently 0)
    const totalClicks = formattedListings.reduce((sum, item) => sum + item.clicks, 0)

    return {
        listings: formattedListings,
        stats: {
            approved,
            pending,
            rejected,
            totalClicks,
        }
    }
}
