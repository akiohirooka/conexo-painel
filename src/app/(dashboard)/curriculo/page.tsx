import { requireAuth } from "@/lib/auth"
import { PageHeader } from "@/components/ui-conexo/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock } from "lucide-react"

export default async function CurriculoPage() {
    await requireAuth()

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <PageHeader
                title="Currículo / Portfólio"
                description="Crie e gerencie seu currículo ou portfólio."
            />

            <Card className="max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <FileText className="h-6 w-6 text-muted-foreground" />
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
                        Em breve você poderá criar e compartilhar seu currículo ou portfólio
                        diretamente no Conexo. Fique ligado para atualizações!
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
