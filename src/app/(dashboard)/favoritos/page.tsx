import { requireAuth } from "@/lib/auth"
import { PageHeader } from "@/components/ui-conexo/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Clock } from "lucide-react"

export default async function FavoritosPage() {
    await requireAuth()

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <PageHeader
                title="Favoritos"
                description="Seus negócios, eventos e vagas salvos."
            />

            <Card className="max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Heart className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Em breve
                            </CardTitle>
                            <CardDescription>
                                Esta funcionalidade está em desenvolvimento.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Em breve você poderá salvar seus negócios, eventos e vagas favoritos
                        para acessar rapidamente depois. Fique ligado para atualizações!
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
