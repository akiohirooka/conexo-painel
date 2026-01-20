"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Building2, Loader2 } from "lucide-react"
import { activateBusinessMode } from "@/actions/user"
import { toast } from "sonner"

export function ActivateBusinessCard() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleActivateBusiness() {
        setIsLoading(true)
        try {
            const result = await activateBusinessMode()

            if (result.success) {
                toast.success("Modo Business ativado com sucesso!", {
                    description: "Agora você pode cadastrar negócios, eventos e vagas."
                })
                // Redirect to dashboard and force a hard refresh to update the layout
                router.push("/dashboard")
                router.refresh()
            } else {
                toast.error("Erro ao ativar modo Business", {
                    description: result.error
                })
            }
        } catch (error) {
            toast.error("Erro ao ativar modo Business", {
                description: "Por favor, tente novamente."
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
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
                    <Button onClick={handleActivateBusiness} disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Ativar modo Business
                    </Button>
                    <Button variant="outline" asChild>
                        <a href="https://conexo.jp" target="_blank" rel="noopener noreferrer">
                            <Building2 className="mr-2 h-4 w-4" />
                            Saiba mais
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
