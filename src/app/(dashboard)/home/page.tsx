import { requireAuth } from "@/lib/auth"
import { getUserStats } from "@/actions/get-user-reviews"
import { PageHeader } from "@/components/ui-conexo/page-header"
import { KpiCard } from "@/components/ui-conexo/kpi-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Heart, FileText, Sparkles, Building2 } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
    const user = await requireAuth()
    const { data: stats } = await getUserStats()

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
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
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Quer publicar no Conexo?</CardTitle>
                            <CardDescription>
                                É gratuito e leva poucos minutos para começar.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Ative o modo Business para cadastrar seu negócio, eventos ou vagas de emprego.
                        Alcance milhares de pessoas na comunidade.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild>
                            <Link href="/account">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Ativar modo Business
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/account">
                                <Building2 className="mr-2 h-4 w-4" />
                                Saiba mais
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
