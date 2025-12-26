import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui-conexo/page-header"

export default function JobListingsPage() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <PageHeader
                title="Minhas Vagas"
                description="Gerencie suas vagas de emprego cadastradas."
                action={
                    <Button asChild className="bg-conexo-blue hover:bg-conexo-blue/90 text-white">
                        <Link href="/listings/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Vaga
                        </Link>
                    </Button>
                }
            />
            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6">
                    <p className="text-muted-foreground">Lista de vagas será exibida aqui.</p>
                </div>
            </div>
        </div>
    )
}
