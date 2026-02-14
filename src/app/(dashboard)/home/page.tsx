import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserStats } from "@/actions/get-user-reviews"
import { PageHeader } from "@/components/ui-conexo/page-header"
import { KpiCard } from "@/components/ui-conexo/kpi-card"
import { Star, Heart, FileText } from "lucide-react"
import { ActivateBusinessCard } from "./activate-business-card"
import { buildAccountDeletedDecisionPath } from "@/lib/auth/deleted-account"

import { TutorialModal } from "@/components/onboarding/tutorial-modal"

export default async function HomePage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/sign-in')
    }

    if (user.role === 'deleted') {
        redirect(buildAccountDeletedDecisionPath({
            clerkUserId: user.clerkUserId,
            email: user.email,
        }))
    }

    // Business users should go to /dashboard
    if (user.role === 'business') {
        redirect('/dashboard')
    }

    const { data: stats } = await getUserStats()

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <TutorialModal />
            <PageHeader
                title={`Olá${user.firstName ? `, ${user.firstName}` : ''}!`}
                description="Bem-vindo ao Conexo. Seu hub para conexões e oportunidades."
            />

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <KpiCard
                    title="Meus Reviews"
                    value={stats?.reviewsCount ?? 0}
                    icon={Star}
                    description="Reviews que você escreveu"
                />
                <KpiCard
                    title="Favoritos"
                    value={stats?.favoritesCount ?? 0}
                    icon={Heart}
                    description="Itens salvos"
                />
                <KpiCard
                    title="Currículo"
                    value="—"
                    icon={FileText}
                    description="Em breve"
                />
            </div>

            {/* Educational Card for Business Mode */}
            <ActivateBusinessCard />
        </div>
    )
}
