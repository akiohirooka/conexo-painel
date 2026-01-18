import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, ArrowLeft, Sparkles } from "lucide-react"

export default function NoAccessPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                        <ShieldAlert className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <CardTitle className="text-2xl">Acesso Restrito</CardTitle>
                    <CardDescription className="text-base">
                        Para publicar no Conexo, ative o modo Business (gratuito).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button asChild className="w-full" size="lg">
                        <Link href="/account">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Ativar modo Business
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="lg">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
