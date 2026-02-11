"use client"

import { useState } from "react"
import { useClerk } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { requestAccountDeletion } from "@/actions/user"
import { toast } from "@/hooks/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeleteAccountSection() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const { signOut } = useClerk()

    const handleDeleteAccount = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (isDeleting) return

        setIsDeleting(true)

        try {
            const result = await requestAccountDeletion()

            if (!result.success) {
                toast({
                    title: "Erro",
                    description: result.error || "Não foi possível deletar a conta.",
                    variant: "destructive",
                })
                return
            }

            await signOut({ redirectUrl: "/sign-up" })
        } catch {
            toast({
                title: "Erro",
                description: "Não foi possível deletar a conta.",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 text-card-foreground shadow">
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-destructive">Zona de perigo</h2>
                    <p className="text-sm text-muted-foreground">
                        Sua conta será excluída definitivamente em 14 dias. Após esse prazo, a exclusão é
                        irreversível e todos os dados serão removidos.
                    </p>
                </div>

                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive">
                            Deletar conta
                        </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="border-destructive/50 bg-red-50 dark:bg-red-950/40">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive">
                                Tem certeza que deseja deletar sua conta?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-foreground/90">
                                <span className="block">
                                    Sua conta será excluída definitivamente em 14 dias.
                                </span>
                                <span className="block">
                                    Até lá, você pode cancelar a exclusão fazendo login novamente.
                                </span>
                                <span className="block">
                                    Após esse prazo, a exclusão é irreversível e todos os dados serão
                                    removidos.
                                </span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Deletar conta
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
